import Anthropic from '@anthropic-ai/sdk';
import { CityMetadata, Place, Season } from '../models/types';
import { config } from '../config';
import { logger } from '../utils/logger';
import { sleep } from '../utils/sleep';

const SEASONAL_PROMPTS: Record<Season, string> = {
  winter: `Generate 15 real, family-friendly INDOOR places in {city} perfect for winter with toddlers (ages 0-5).

CRITICAL: Winter activities must be primarily INDOOR. Include:

REGULAR WINTER VENUES (10 places):
- Children's museums, science centers
- Libraries with children's sections  
- Indoor play centers, trampoline parks, gymnastics centers
- Art museums, cultural centers
- Indoor pools (clearly mark as "indoor pool" in description)
- Botanical gardens with conservatories/indoor spaces
- Community centers with tot programs
- Aquariums, indoor zoos

HOLIDAY/DECEMBER VENUES (5 places):
- Holiday light displays or festivals
- Botanical gardens with holiday/poinsettia shows
- Museums with Christmas exhibits
- Zoo lights events (December)
- Community centers with holiday events
- Children's theaters with holiday performances

Requirements:
- Real venues that exist with full proper names (e.g., "Greater Des Moines Botanical Garden")
- Provide brief description and address if known
- For holiday venues, note they're best for December/late November
- Include typical operating hours and admission costs when known
- Note amenities like parking, restrooms, stroller access

DO NOT include: outdoor-only splash pads, beaches, outdoor pools, or seasonal venues closed in winter

Return as JSON array of objects with this exact structure:
[
  {{
    "name": "Venue Full Name",
    "type": "museum|library|park|farm|zoo|aquarium|botanical_garden|splash_pad|pool|beach|trail|nature_center|market|indoor_play|other",
    "description": "Brief description suitable for parents",
    "address": "Full street address if known",
    "cost": "free|low|medium|high|membership",
    "indoor": true/false,
    "outdoor": true/false,
    "toddlerFriendly": true/false,
    "strollerAccessible": true/false,
    "parking": true/false,
    "snackFriendly": true/false,
    "bestSeason": ["winter"],
    "operatingHours": "Typical hours if known (e.g., '9am-5pm Tue-Sat')",
    "tags": ["relevant", "tags"]
  }}
]`,

  spring: `Generate 15 real, family-friendly places in {city} perfect for spring with toddlers (ages 0-5).

Include: botanical gardens, arboretums, nature centers, petting farms, community gardens, farmers markets, state parks with easy trails, playgrounds, ponds, flower gardens, light outdoor spaces.

Requirements:
- Real venues that exist with full proper names (e.g., "Living History Farms")
- Mix of gardens, nature centers, farms, parks, and outdoor spaces
- Provide brief description and address if known
- Include typical operating hours and admission costs when known
- Note amenities like parking, restrooms, stroller access
- Focus on venues with emerging flowers, baby animals, light outdoor activities

Return as JSON array of objects with this exact structure:
[
  {{
    "name": "Venue Full Name",
    "type": "museum|library|park|farm|zoo|aquarium|botanical_garden|splash_pad|pool|beach|trail|nature_center|market|indoor_play|other",
    "description": "Brief description suitable for parents",
    "address": "Full street address if known",
    "cost": "free|low|medium|high|membership",
    "indoor": true/false,
    "outdoor": true/false,
    "toddlerFriendly": true/false,
    "strollerAccessible": true/false,
    "parking": true/false,
    "snackFriendly": true/false,
    "bestSeason": ["spring"],
    "operatingHours": "Typical hours if known (e.g., '9am-5pm Tue-Sat')",
    "tags": ["relevant", "tags"]
  }}
]`,

  summer: `Generate 15 real, family-friendly places in {city} perfect for summer with toddlers (ages 0-5).

Include: splash pads, public pools, lake beaches, outdoor pools, zoos, water features, farmers markets, outdoor theaters, parks with playgrounds, easy hiking trails, pick-your-own farms, outdoor festivals.

Requirements:
- Real venues that exist with full proper names (e.g., "Blank Park Zoo")
- Mix of water activities, outdoor venues, zoos, and summer activities
- Provide brief description and address if known
- Include typical operating hours and admission costs when known
- Note amenities like parking, restrooms, stroller access, shade
- Focus on water play, outdoor adventures, and cool activities

Return as JSON array of objects with this exact structure:
[
  {{
    "name": "Venue Full Name",
    "type": "museum|library|park|farm|zoo|aquarium|botanical_garden|splash_pad|pool|beach|trail|nature_center|market|indoor_play|other",
    "description": "Brief description suitable for parents",
    "address": "Full street address if known",
    "cost": "free|low|medium|high|membership",
    "indoor": true/false,
    "outdoor": true/false,
    "toddlerFriendly": true/false,
    "strollerAccessible": true/false,
    "parking": true/false,
    "snackFriendly": true/false,
    "bestSeason": ["summer"],
    "operatingHours": "Typical hours if known (e.g., '9am-5pm Tue-Sat')",
    "tags": ["relevant", "tags"]
  }}
]`,

  fall: `Generate 15 real, family-friendly places in {city} perfect for fall with toddlers (ages 0-5).

Include: pumpkin patches, apple orchards, corn mazes (toddler-friendly), hayride farms, fall festivals, nature preserves with fall colors, parks with autumn leaves, harvest festivals, farm markets.

Requirements:
- Real venues that exist with full proper names (e.g., "Saylorville Farm")
- Mix of harvest activities, fall festivals, farms, and outdoor spaces
- Provide brief description and address if known
- Include typical operating hours and admission costs when known
- Note amenities like parking, restrooms, stroller access
- Focus on pumpkins, apples, fall leaves, harvest themes

Return as JSON array of objects with this exact structure:
[
  {{
    "name": "Venue Full Name",
    "type": "museum|library|park|farm|zoo|aquarium|botanical_garden|splash_pad|pool|beach|trail|nature_center|market|indoor_play|other",
    "description": "Brief description suitable for parents",
    "address": "Full street address if known",
    "cost": "free|low|medium|high|membership",
    "indoor": true/false,
    "outdoor": true/false,
    "toddlerFriendly": true/false,
    "strollerAccessible": true/false,
    "parking": true/false,
    "snackFriendly": true/false,
    "bestSeason": ["fall"],
    "operatingHours": "Typical hours if known (e.g., '9am-5pm Tue-Sat')",
    "tags": ["relevant", "tags"]
  }}
]`
};

const HIDDEN_GEMS_PROMPT = `Generate 12 HIDDEN GEM family-friendly places in {city} - lesser-known local spots perfect for families with toddlers (ages 0-5).

Focus on UNIQUE, LOCAL, and LESSER-KNOWN venues that aren't the obvious big attractions:

INCLUDE:
- Local bakeries with kid-friendly spaces
- Independent bookstores with story times
- Art studios offering toddler classes
- Play cafes with indoor play areas
- Specialty shops (candle making, pottery, toy stores)
- Community gardens or small urban farms
- Family-owned ice cream or treat shops
- Unique local toy stores or children's shops
- Neighborhood libraries (not main branch)
- Coffee shops with play spaces
- Local farms or petting zoos
- Family-owned restaurants with play areas

DO NOT include: Chain stores, major museums already covered, McDonald's playplaces, generic venues

Requirements:
- Real venues that exist with full proper names
- Brief description emphasizing what makes them special/unique
- Note if they're year-round or seasonal
- Include address if known
- Mark as toddler-friendly with special amenities

Return as JSON array with same structure as above.`;

interface ClaudePlaceResponse {
  name: string;
  type: Place['type'];
  description: string;
  address?: string;
  cost: Place['cost'];
  indoor: boolean;
  outdoor: boolean;
  toddlerFriendly: boolean;
  strollerAccessible: boolean;
  parking: boolean;
  snackFriendly: boolean;
  bestSeason: Season[];
  operatingHours?: string;
  tags: string[];
}

interface ResearchOutput {
  city: string;
  season: Season;
  rawResponse: string;
  parsedPlaces: ClaudePlaceResponse[];
  timestamp: string;
}

export async function researchPlaces(city: CityMetadata): Promise<Place[]> {
  logger.info(`Researching places for ${city.name}, ${city.state} using Claude`);

  const anthropic = new Anthropic({
    apiKey: config.anthropicApiKey,
  });

  const allPlaces: Place[] = [];

  // Research all seasons using Claude
  for (const season of ['winter', 'spring', 'summer', 'fall'] as Season[]) {
    logger.info(`Researching ${season} activities with Claude...`);

    try {
      const prompt = SEASONAL_PROMPTS[season].replace('{city}', `${city.name}, ${city.state}`);

      const response = await anthropic.messages.create({
        model: config.claudeModel,
        max_tokens: 4096,
        temperature: 0.7,
        system: "You are an expert at finding family-friendly places for toddlers. You have extensive knowledge of venues across cities. Always return only valid JSON - no markdown formatting or explanations.",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const rawResponse = response.content[0].type === 'text' ? response.content[0].text : '';

      logger.debug(`Claude response for ${season}: ${rawResponse.substring(0, 200)}...`);

      // Parse Claude's JSON response
      const claudePlaces = parseClaudeResponse(rawResponse, season);

      // Convert Claude places to our Place format
      const places = claudePlacesToPlaces(claudePlaces, city);

      allPlaces.push(...places);
      logger.info(`Found ${places.length} places for ${season}`);

      // Brief pause between requests
      await sleep(500);

    } catch (error) {
      logger.warn(`Claude research failed for ${season}: ${error}`);
      // Continue with other seasons even if one fails
      continue;
    }
  }

  // Research hidden gems (year-round unique spots)
  logger.info(`Researching hidden gems and local favorites...`);

  try {
    const prompt = HIDDEN_GEMS_PROMPT.replace('{city}', `${city.name}, ${city.state}`);

    const response = await anthropic.messages.create({
      model: config.claudeModel,
      max_tokens: 4096,
      temperature: 0.8, // Higher temperature for more creative suggestions
      system: "You are a local expert who knows the hidden gems and unique family spots that locals love but tourists might miss. Always return only valid JSON - no markdown formatting or explanations.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const rawResponse = response.content[0].type === 'text' ? response.content[0].text : '';

    logger.debug(`Claude response for hidden gems: ${rawResponse.substring(0, 200)}...`);

    // Parse Claude's JSON response
    const claudePlaces = parseClaudeResponse(rawResponse, 'spring'); // Use spring as placeholder

    // Convert Claude places to our Place format and tag as year-round hidden gems
    const places = claudePlacesToPlaces(claudePlaces, city).map(p => ({
      ...p,
      bestSeason: ['winter', 'spring', 'summer', 'fall'] as Season[], // Year-round
      tags: [...p.tags, 'hidden-gem', 'local-favorite']
    }));

    allPlaces.push(...places);
    logger.info(`Found ${places.length} hidden gems`);

  } catch (error) {
    logger.warn(`Hidden gems research failed: ${error}`);
    // Continue even if hidden gems fail
  }

  logger.info(`Research complete: ${allPlaces.length} total places found`);

  // Warn if we got fewer places than expected
  if (allPlaces.length < 65) {
    logger.warn(`Only found ${allPlaces.length} places, expected ~72. Results may be limited for this city.`);
  }

  return allPlaces;
}

function parseClaudeResponse(rawResponse: string, season: Season): ClaudePlaceResponse[] {
  try {
    // Claude might wrap the JSON in ```json ... ``` or just return raw JSON
    let jsonText = rawResponse.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON
    const parsed = JSON.parse(jsonText);

    // Validate that we got an array of places
    if (!Array.isArray(parsed)) {
      logger.warn(`Claude returned non-array response for ${season}: ${jsonText.substring(0, 100)}...`);
      return [];
    }

    // Validate each place object has required fields
    const validPlaces: ClaudePlaceResponse[] = [];
    for (const place of parsed) {
      if (place.name && place.type && place.description) {
        // Ensure bestSeason is set to the requested season if not specified
        if (!place.bestSeason || place.bestSeason.length === 0) {
          place.bestSeason = [season];
        }
        validPlaces.push(place);
      } else {
        logger.warn(`Skipping invalid place object: ${JSON.stringify(place)}`);
      }
    }

    logger.info(`Parsed ${validPlaces.length} valid places from Claude response for ${season}`);
    return validPlaces;

  } catch (error) {
    logger.error(`Failed to parse Claude JSON response for ${season}: ${error}`);
    logger.debug(`Raw response: ${rawResponse.substring(0, 500)}...`);
    return [];
  }
}

function claudePlacesToPlaces(claudePlaces: ClaudePlaceResponse[], city: CityMetadata): Place[] {
  return claudePlaces.map(claudePlace => ({
    name: claudePlace.name,
    type: claudePlace.type,
    description: claudePlace.description,
    url: undefined, // Claude doesn't provide URLs
    address: claudePlace.address,
    cost: claudePlace.cost,
    indoor: claudePlace.indoor,
    outdoor: claudePlace.outdoor,
    toddlerFriendly: claudePlace.toddlerFriendly,
    strollerAccessible: claudePlace.strollerAccessible,
    parking: claudePlace.parking,
    snackFriendly: claudePlace.snackFriendly,
    bestSeason: claudePlace.bestSeason,
    tags: claudePlace.tags || [],
    score: 0 // Will be calculated by curator
  }));
}

