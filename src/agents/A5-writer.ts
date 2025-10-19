import Anthropic from '@anthropic-ai/sdk';
import { CityMetadata, WeekTemplate, Week, Activity, Recipe } from '../models/types';
import { config } from '../config';
import { logger } from '../utils/logger';
import { sleep } from '../utils/sleep';
import { getRandomSong, getRandomBook, getRandomRecipe, SONGS_BY_SEASON, BOOKS_BY_SEASON, RECIPES_BY_SEASON } from '../constants/content-library';

const anthropic = new Anthropic({
  apiKey: config.anthropicApiKey
});

const BATCH_SIZE = 6; // Generate 6 weeks at a time

export async function generateAllWeeks(
  templates: WeekTemplate[],
  city: CityMetadata
): Promise<Week[]> {
  logger.info(`Generating content for 52 weeks...`);

  const weeks: Week[] = [];
  const usedSongTitles = new Set<string>();
  const usedBookTitles = new Set<string>();
  const usedRecipeNames = new Set<string>();
  const usedWeekTitles = new Set<string>();

  // Pre-allocate constant week titles
  templates.forEach(t => {
    if (t.isConstant && t.title) {
      usedWeekTitles.add(t.title);
    }
  });

  // Pre-allocate songs, books, and recipes for all 52 weeks to avoid repetition
  const weekContent: Array<{ song: any; book: any; recipe: any }> = [];
  
  // Get all songs from all seasons
  const allSongs = [...SONGS_BY_SEASON.winter, ...SONGS_BY_SEASON.spring, ...SONGS_BY_SEASON.summer, ...SONGS_BY_SEASON.fall];
  const allBooks = [...BOOKS_BY_SEASON.winter, ...BOOKS_BY_SEASON.spring, ...BOOKS_BY_SEASON.summer, ...BOOKS_BY_SEASON.fall];
  const allRecipes = [...RECIPES_BY_SEASON.winter, ...RECIPES_BY_SEASON.spring, ...RECIPES_BY_SEASON.summer, ...RECIPES_BY_SEASON.fall];
  
  for (const template of templates) {
    const weekTitle = template.title || '';
    
    // Get unique song (never repeat) - filter from ALL songs, not just seasonal
    let availableSongs = allSongs.filter(s => !usedSongTitles.has(s.title));
    
    // Filter by season preference
    let seasonalSongs = availableSongs.filter(s => 
      SONGS_BY_SEASON[template.season].some(ss => ss.title === s.title)
    );
    
    // Filter out Christmas songs unless it's week 51
    if (template.weekNumber !== 51) {
      seasonalSongs = seasonalSongs.filter(s => !s.isChristmas);
    } else {
      const christmasSongs = seasonalSongs.filter(s => s.isChristmas);
      if (christmasSongs.length > 0) {
        seasonalSongs = christmasSongs;
      }
    }
    
    // Pick a song (with fallback if no seasonal songs available)
    let song;
    if (seasonalSongs.length > 0) {
      song = seasonalSongs[Math.floor(Math.random() * seasonalSongs.length)];
    } else if (availableSongs.length > 0) {
      // Use song from another season if seasonal pool exhausted
      song = availableSongs[Math.floor(Math.random() * availableSongs.length)];
    } else {
      // Last resort: reuse a song (shouldn't happen if we have 52+ songs)
      logger.warn(`Ran out of unique songs for week ${template.weekNumber}, allowing reuse`);
      song = allSongs[Math.floor(Math.random() * allSongs.length)];
    }
    usedSongTitles.add(song.title);
    
    // Get unique book (never repeat)
    let availableBooks = allBooks.filter(b => !usedBookTitles.has(b.title));
    let seasonalBooks = availableBooks.filter(b =>
      BOOKS_BY_SEASON[template.season].some(sb => sb.title === b.title)
    );
    
    let book;
    if (seasonalBooks.length > 0) {
      book = seasonalBooks[Math.floor(Math.random() * seasonalBooks.length)];
    } else if (availableBooks.length > 0) {
      book = availableBooks[Math.floor(Math.random() * availableBooks.length)];
    } else {
      logger.warn(`Ran out of unique books for week ${template.weekNumber}, allowing reuse`);
      book = allBooks[Math.floor(Math.random() * allBooks.length)];
    }
    usedBookTitles.add(book.title);
    
    // Get unique recipe (never repeat)
    let availableRecipes = allRecipes.filter(r => !usedRecipeNames.has(r.name));
    let seasonalRecipes = availableRecipes.filter(r =>
      RECIPES_BY_SEASON[template.season].some(sr => sr.name === r.name)
    );
    
    let recipe;
    if (seasonalRecipes.length > 0) {
      recipe = seasonalRecipes[Math.floor(Math.random() * seasonalRecipes.length)];
    } else if (availableRecipes.length > 0) {
      recipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
    } else {
      logger.warn(`Ran out of unique recipes for week ${template.weekNumber}, allowing reuse`);
      recipe = allRecipes[Math.floor(Math.random() * allRecipes.length)];
    }
    usedRecipeNames.add(recipe.name);
    
    weekContent.push({ song, book, recipe });
  }

  // Generate weeks sequentially to ensure title tracking works properly
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    
    // Log progress every 6 weeks
    if (i % 6 === 0) {
      logger.info(`Generating weeks ${i + 1}-${Math.min(i + 6, 52)}...`);
    }

    const week = await generateWeekWithRetry(
      template, 
      city, 
      weekContent[i], 
      usedWeekTitles, 
      config.maxRetries
    );
    
    // Track generated title for non-constant weeks
    if (!template.isConstant) {
      usedWeekTitles.add(week.title);
    }
    
    weeks.push(week);

    // Brief pause every 6 weeks
    if ((i + 1) % 6 === 0 && i + 1 < templates.length) {
      await sleep(1000);
    }
  }

  logger.info(`Week generation complete: ${weeks.length} weeks created`);
  return weeks;
}

async function generateWeekWithRetry(
  template: WeekTemplate,
  city: CityMetadata,
  preAllocatedContent: { song: any; book: any; recipe: any },
  usedWeekTitles: Set<string>,
  maxRetries: number
): Promise<Week> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateWeek(template, city, preAllocatedContent, usedWeekTitles);
    } catch (error) {
      logger.error(`Week ${template.weekNumber} generation failed (attempt ${attempt}/${maxRetries})`, error);

      if (attempt === maxRetries) {
        throw new Error(`Failed to generate week ${template.weekNumber} after ${maxRetries} attempts`);
      }

      // Exponential backoff
      await sleep(1000 * Math.pow(2, attempt - 1));
    }
  }

  throw new Error('Unexpected error in generateWeekWithRetry');
}

async function generateWeek(
  template: WeekTemplate,
  city: CityMetadata,
  preAllocatedContent: { song: any; book: any; recipe: any },
  usedWeekTitles: Set<string>
): Promise<Week> {
  const prompt = buildWeekPrompt(template, city, usedWeekTitles);

  const response = await anthropic.messages.create({
    model: config.claudeModel,
    max_tokens: 4096,
    temperature: 0.7,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  // Extract content from Claude response
  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse the JSON response
  const weekData = parseWeekResponse(content.text);

  // Determine week title
  const weekTitle = template.isConstant ? template.title! : weekData.title;

  // Use pre-allocated song, book, and recipe (no repetition possible)
  const song = preAllocatedContent.song;
  const book = preAllocatedContent.book;
  const recipe = preAllocatedContent.recipe;

  // Construct final week
  const week: Week = {
    week: template.weekNumber,
    title: weekTitle,
    placeToVisit: template.placeToVisit?.name || weekData.placeToVisit || '',
    activities: weekData.activities,
    song: song,
    book: book,
    recipe: recipe
  };

  return week;
}

function buildWeekPrompt(template: WeekTemplate, city: CityMetadata, usedWeekTitles: Set<string>): string {
  const placeInfo = template.placeToVisit
    ? `\nPlace to Visit: ${template.placeToVisit.name}\nDescription: ${template.placeToVisit.description || 'A local activity spot'}\nType: ${template.placeToVisit.type}`
    : '\nNo specific place assigned for this week.';

  const usedTitlesStr = !template.isConstant && usedWeekTitles.size > 0
    ? `\n\nTITLES ALREADY USED (DO NOT REPEAT):\n${Array.from(usedWeekTitles).join(', ')}`
    : '';

  return `You are the creative director for WilderSeasons, creating family activity guides for children ages 0-10.

CITY CONTEXT:
- Location: ${city.name}, ${city.state}
- Climate: ${city.climateZone}
- Region: ${city.region}

WEEK DETAILS:
- Week Number: ${template.weekNumber}
- Season: ${template.season}
${template.isConstant ? `- Title (LOCKED): ${template.title}` : '- Title: You will create a fitting title'}
${template.theme ? `- Theme: ${template.theme}` : ''}${placeInfo}${usedTitlesStr}

YOUR TASK:
Generate week content matching the existing WilderSeasons style from Omaha and Lincoln editions.

${!template.isConstant ? `1. WEEK TITLE (3-5 words):
Create a warm, evocative title that is UNIQUE and has NOT been used yet.
CRITICAL: Do NOT use any of the titles listed in "TITLES ALREADY USED" above.
Examples from existing editions: "Winter Birds", "Signs of Spring", "Mud & Puddles", "Leaf Week", "Art & Wonder", "River Walks"` : ''}

2. ACTIVITIES (Create 3-4):
Write CONCISE activities matching the existing style (5-10 word descriptions).

Examples from existing editions:
- "Add scarves, mittens, soft objects"
- "Make paper tube binoculars"
- "Use white crayons + watercolor"
- "Find buds, birds, bugs"
- "Roll in nut butter and seeds"

For each activity:
- Name: Short, action-oriented (e.g., "Texture Walk", "Cloud Watching")
- Description: 5-10 words, action-focused, simple

CRITICAL STYLE GUIDELINES:
- Keep activity descriptions VERY concise (5-10 words)
- Use simple, everyday language
- Assume limited time and resources
- No expert language or overly detailed instructions

OUTPUT FORMAT (valid JSON):
{
  "title": "${template.isConstant ? template.title : 'Your created title'}",
  "placeToVisit": "${template.placeToVisit?.name || 'Local activity spot'}",
  "activities": [
    {
      "name": "Activity Name",
      "description": "Short 5-10 word description"
    }
  ]
}

Generate the week content now (JSON only, no markdown):`;
}

function parseWeekResponse(text: string): {
  title: string;
  placeToVisit?: string;
  activities: Activity[];
} {
  // Extract JSON from response (Claude might wrap it)
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('No valid JSON found in Claude response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    title: parsed.title,
    placeToVisit: parsed.placeToVisit,
    activities: parsed.activities || []
  };
}

