import { promises as fs } from 'fs';
import path from 'path';
import { Edition, Week } from '../models/types';
import { logger } from '../utils/logger';
import { config } from '../config';
import { COST_ICONS, SEASON_ICONS } from '../constants/icons';

interface ExportResult {
  markdown: string;
  json: string;
  csv: string;
  summary: string;
  paths: {
    markdown: string;
    json: string;
    csv: string;
    summary: string;
  };
}

export async function exportEdition(edition: Edition): Promise<ExportResult> {
  logger.info(`Exporting edition for ${edition.city.name}...`);

  // Ensure output directory exists
  await fs.mkdir(config.outputDir, { recursive: true });

  const citySlug = slugify(edition.city.name);
  const date = new Date(edition.generatedAt).toISOString().split('T')[0];

  // 1. Generate Markdown
  const markdown = buildMarkdownBook(edition);
  const mdPath = path.join(config.outputDir, `WilderSeasons_${citySlug}_Edition_${date}.md`);
  await fs.writeFile(mdPath, markdown);
  logger.info(`Markdown saved: ${mdPath}`);

  // 2. Generate JSON
  const json = JSON.stringify(edition, null, 2);
  const jsonPath = path.join(config.outputDir, `WilderSeasons_${citySlug}_Edition_${date}.json`);
  await fs.writeFile(jsonPath, json);
  logger.info(`JSON saved: ${jsonPath}`);

  // 3. Generate CSV
  const csv = buildCanvaCSV(edition);
  const csvPath = path.join(config.outputDir, `WilderSeasons_${citySlug}_Canva_${date}.csv`);
  await fs.writeFile(csvPath, csv);
  logger.info(`CSV saved: ${csvPath}`);

  // 4. Generate summary
  const summary = buildSummary(edition);
  const summaryPath = path.join(config.outputDir, `WilderSeasons_${citySlug}_Summary_${date}.txt`);
  await fs.writeFile(summaryPath, summary);
  logger.info(`Summary saved: ${summaryPath}`);

  return {
    markdown,
    json,
    csv,
    summary,
    paths: {
      markdown: mdPath,
      json: jsonPath,
      csv: csvPath,
      summary: summaryPath
    }
  };
}

function buildMarkdownBook(edition: Edition): string {
  const sections: string[] = [];

  // Title page
  sections.push(`# WilderSeasons — ${edition.city.name} Edition`);
  sections.push(`*52 Weeks of Seasonal Learning & Play for Families*\n`);
  sections.push(`Generated: ${new Date(edition.generatedAt).toLocaleDateString()}`);
  sections.push(`Version: ${edition.version}\n`);
  sections.push(`---\n`);

  // Table of Contents
  sections.push(buildTableOfContents(edition));
  sections.push(`\n---\n`);

  // Week Content
  for (const week of edition.weeks) {
    sections.push(buildWeekSection(week));
    sections.push(`\n---\n`);
  }

  return sections.join('\n');
}

function buildTableOfContents(edition: Edition): string {
  const toc: string[] = ['# Table of Contents\n'];

  const seasons = {
    winter: edition.weeks.filter(w => w.week >= 1 && w.week <= 13),
    spring: edition.weeks.filter(w => w.week >= 14 && w.week <= 26),
    summer: edition.weeks.filter(w => w.week >= 27 && w.week <= 39),
    fall: edition.weeks.filter(w => w.week >= 40 && w.week <= 52)
  };

  for (const [seasonName, weeks] of Object.entries(seasons)) {
    if (weeks.length > 0) {
      toc.push(`## ${capitalize(seasonName)} Weeks (Weeks ${weeks[0].week}-${weeks[weeks.length - 1].week})`);

      for (const week of weeks) {
        const place = week.placeToVisit ? ` — *${week.placeToVisit}*` : '';
        toc.push(`${week.week}. ${week.title}${place}`);
      }

      toc.push('');
    }
  }

  return toc.join('\n');
}

function buildWeekSection(week: Week): string {
  const parts: string[] = [];

  // Header
  parts.push(`## WEEK ${week.week}`);
  parts.push('');
  parts.push(`${week.title}`);
  if (week.placeToVisit) {
    parts.push(`PLACE TO VISIT`);
    parts.push(week.placeToVisit);
  }
  parts.push('');

  // Activities
  parts.push('ACTIVITIES');
  week.activities.forEach(activity => {
    parts.push(activity.name);
    if (activity.description) {
      parts.push(activity.description);
    }
  });
  parts.push('');

  // Song
  parts.push('SONG');
  parts.push('');
  parts.push(`"${week.song.title}"`);
  parts.push(`by ${week.song.artist}`);
  parts.push('');

  // Book
  parts.push('BOOK');
  parts.push('');
  parts.push(week.book.title);
  parts.push(`by ${week.book.author}`);
  parts.push('');

  // Recipe
  parts.push('RECIPE');
  parts.push('');
  parts.push(week.recipe.name);
  parts.push('Ingredients:');
  week.recipe.ingredients.forEach(ing => parts.push(ing));
  parts.push('');
  parts.push('Instructions:');
  parts.push(week.recipe.instructions);
  parts.push('');
  parts.push('Toddler Task:');
  parts.push(week.recipe.toddlerTask);
  parts.push('');

  return parts.join('\n');
}

function buildCanvaCSV(edition: Edition): string {
  const headers = [
    'week_number',
    'title',
    'place_name',
    'activity_1_name',
    'activity_2_name',
    'activity_3_name',
    'activity_4_name',
    'recipe_name',
    'song_title',
    'song_artist',
    'book_title',
    'book_author'
  ];

  const rows = edition.weeks.map(week => {
    return [
      week.week,
      escapeCsvValue(week.title),
      escapeCsvValue(week.placeToVisit || ''),
      escapeCsvValue(week.activities[0]?.name || ''),
      escapeCsvValue(week.activities[1]?.name || ''),
      escapeCsvValue(week.activities[2]?.name || ''),
      escapeCsvValue(week.activities[3]?.name || ''),
      escapeCsvValue(week.recipe.name),
      escapeCsvValue(week.song.title),
      escapeCsvValue(week.song.artist),
      escapeCsvValue(week.book.title),
      escapeCsvValue(week.book.author)
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

function buildSummary(edition: Edition): string {
  const summary: string[] = [];

  summary.push(`WilderSeasons ${edition.city.name} Edition - Generation Summary`);
  summary.push(`Generated: ${new Date(edition.generatedAt).toLocaleString()}`);
  summary.push(`Version: ${edition.version}\n`);

  summary.push(`CITY INFORMATION:`);
  summary.push(`- Location: ${edition.city.name}, ${edition.city.state}`);
  summary.push(`- Climate Zone: ${edition.city.climateZone}`);
  summary.push(`- Region: ${edition.city.region}\n`);

  summary.push(`CONTENT STATISTICS:`);
  summary.push(`- Total Weeks: ${edition.weeks.length}`);
  summary.push(`- Total Places Researched: ${edition.metadata.totalPlaces}`);
  summary.push(`- Generation Time: ${((edition.metadata.generationTimeMs || 0) / 1000).toFixed(1)}s\n`);

  return summary.join('\n');
}

function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_');
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

