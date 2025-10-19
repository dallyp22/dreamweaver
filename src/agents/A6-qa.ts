import { Week, CityMetadata } from '../models/types';
import { logger } from '../utils/logger';

interface QAIssue {
  weekNumber: number;
  severity: 'error' | 'warning' | 'info';
  category: 'safety' | 'tone' | 'development' | 'local' | 'practical';
  message: string;
  field?: string;
}

export async function validateAndEnhance(
  weeks: Week[],
  city: CityMetadata
): Promise<{ weeks: Week[]; issues: QAIssue[] }> {
  logger.info('Running QA checks on generated weeks...');

  const issues: QAIssue[] = [];
  const validatedWeeks: Week[] = [];

  for (const week of weeks) {
    const weekIssues: QAIssue[] = [];

    // Run all QA checks
    weekIssues.push(...checkSafety(week));
    weekIssues.push(...checkTone(week));
    weekIssues.push(...checkPractical(week));

    issues.push(...weekIssues);
    validatedWeeks.push(week);
  }

  // Check for repetition across all weeks
  issues.push(...checkTitleRepetition(weeks));
  issues.push(...checkSongRepetition(weeks));
  issues.push(...checkPlaceRepetition(weeks));
  issues.push(...checkSeasonalAppropriate(weeks));

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;

  logger.info(`QA complete: ${errorCount} errors, ${warningCount} warnings`);

  // Log specific repetition issues if found
  const songRepetitions = issues.filter(i => i.category === 'development' && i.message.includes('Song repetition'));
  if (songRepetitions.length > 0) {
    logger.error(`CRITICAL: Song repetition detected in ${songRepetitions.length} instances!`);
  }

  return { weeks: validatedWeeks, issues };
}

function checkSafety(week: Week): QAIssue[] {
  const issues: QAIssue[] = [];
  const CHOKING_HAZARDS = ['small button', 'bead', 'marble', 'coin', 'small ball'];
  const ALLERGENS = ['peanut', 'tree nut', 'shellfish', 'egg', 'milk', 'dairy', 'soy', 'wheat'];

  // Check recipe for allergens
  if (week.recipe) {
    const recipeText = (week.recipe.name + ' ' + week.recipe.ingredients.join(' ')).toLowerCase();

    ALLERGENS.forEach(allergen => {
      if (recipeText.includes(allergen)) {
        // Allergen mentions are OK, this is just informational
        issues.push({
          weekNumber: week.week,
          severity: 'info',
          category: 'safety',
          message: `Recipe contains ${allergen} - ensure parents are aware`,
          field: 'recipe'
        });
      }
    });
  }

  return issues;
}

function checkTone(week: Week): QAIssue[] {
  const issues: QAIssue[] = [];
  const DIRECTIVE_PHRASES = ['you must', 'you need to', 'make sure', 'be sure to'];

  const allText = [
    week.recipe?.toddlerTask || '',
    week.recipe?.instructions || ''
  ].join(' ').toLowerCase();

  DIRECTIVE_PHRASES.forEach(phrase => {
    if (allText.includes(phrase)) {
      issues.push({
        weekNumber: week.week,
        severity: 'warning',
        category: 'tone',
        message: `Uses directive phrase "${phrase}" - consider softening to "might", "could", "love to"`
      });
    }
  });

  return issues;
}

function checkPractical(week: Week): QAIssue[] {
  const issues: QAIssue[] = [];

  // Check that we have enough activities
  if (week.activities.length < 3) {
    issues.push({
      weekNumber: week.week,
      severity: 'warning',
      category: 'practical',
      message: `Only ${week.activities.length} activities - recommend 3-4`
    });
  }

  return issues;
}

function checkTitleRepetition(weeks: Week[]): QAIssue[] {
  const issues: QAIssue[] = [];
  const titleOccurrences = new Map<string, number[]>();

  // Track which weeks each title appears in
  weeks.forEach(week => {
    if (!titleOccurrences.has(week.title)) {
      titleOccurrences.set(week.title, []);
    }
    titleOccurrences.get(week.title)!.push(week.week);
  });

  // Report any title repetitions
  titleOccurrences.forEach((weekNumbers, title) => {
    if (weekNumbers.length > 1) {
      issues.push({
        weekNumber: weekNumbers[0],
        severity: 'error',
        category: 'development',
        message: `Title repetition: "${title}" appears in weeks ${weekNumbers.join(', ')}`,
        field: 'title'
      });
    }
  });

  return issues;
}

function checkSongRepetition(weeks: Week[]): QAIssue[] {
  const issues: QAIssue[] = [];
  const songOccurrences = new Map<string, number[]>();

  // Track which weeks each song appears in
  weeks.forEach(week => {
    const songKey = week.song.title;
    if (!songOccurrences.has(songKey)) {
      songOccurrences.set(songKey, []);
    }
    songOccurrences.get(songKey)!.push(week.week);
  });

  // Report any repetitions (songs should NEVER repeat)
  songOccurrences.forEach((weekNumbers, songTitle) => {
    if (weekNumbers.length > 1) {
      issues.push({
        weekNumber: weekNumbers[0],
        severity: 'error',
        category: 'development',
        message: `Song repetition: "${songTitle}" appears in weeks ${weekNumbers.join(', ')}`,
        field: 'song'
      });
    }
  });

  return issues;
}

function checkPlaceRepetition(weeks: Week[]): QAIssue[] {
  const issues: QAIssue[] = [];
  const placeOccurrences = new Map<string, number[]>();

  // Track which weeks each place appears in
  weeks.forEach(week => {
    if (week.placeToVisit) {
      const placeName = week.placeToVisit;
      if (!placeOccurrences.has(placeName)) {
        placeOccurrences.set(placeName, []);
      }
      placeOccurrences.get(placeName)!.push(week.week);
    }
  });

  // Report excessive repetitions (places ideally used once, max twice)
  placeOccurrences.forEach((weekNumbers, placeName) => {
    if (weekNumbers.length > 2) {
      issues.push({
        weekNumber: weekNumbers[0],
        severity: 'warning',
        category: 'development',
        message: `Excessive place repetition: "${placeName}" appears ${weekNumbers.length} times in weeks ${weekNumbers.join(', ')}`,
        field: 'placeToVisit'
      });
    }
  });

  return issues;
}

function checkSeasonalAppropriate(weeks: Week[]): QAIssue[] {
  const issues: QAIssue[] = [];

  // Winter weeks (1-13) should not have summer-only venues
  const summerKeywords = ['splash pad', 'outdoor pool', 'beach', 'water park'];
  const winterWeeks = weeks.filter(w => w.week >= 1 && w.week <= 13);

  winterWeeks.forEach(week => {
    if (week.placeToVisit) {
      const placeLower = week.placeToVisit.toLowerCase();
      summerKeywords.forEach(keyword => {
        if (placeLower.includes(keyword) && !placeLower.includes('indoor')) {
          issues.push({
            weekNumber: week.week,
            severity: 'warning',
            category: 'local',
            message: `Potential seasonal mismatch: "${week.placeToVisit}" in winter (week ${week.week})`,
            field: 'placeToVisit'
          });
        }
      });
    }
  });

  return issues;
}

