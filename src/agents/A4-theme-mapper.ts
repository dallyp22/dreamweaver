import { CuratedPlacesBank, WeekTemplate, Place, Season } from '../models/types';
import { CONSTANT_WEEKS, getSeasonForWeek } from '../constants/weeks';
import { logger } from '../utils/logger';

function getGenericPlace(season: Season, weekNum: number): Place {
  // Weeks 48-52 are late Nov/Dec - use winter/holiday themes (NOT pumpkin patches)
  if (weekNum >= 48 && weekNum <= 52) {
    const lateYearPlaces = [
      { name: 'Local toy store or children\'s shop', type: 'other' as Place['type'] },        // Week 48
      { name: 'Neighborhood holiday light displays', type: 'cultural_center' as Place['type'] }, // Week 49
      { name: 'Local botanical garden holiday show', type: 'botanical_garden' as Place['type'] }, // Week 50
      { name: 'Community Christmas lights display', type: 'cultural_center' as Place['type'] },  // Week 51
      { name: 'Local children\'s museum', type: 'museum' as Place['type'] }                      // Week 52
    ];
    const placeData = lateYearPlaces[weekNum - 48] || lateYearPlaces[0];
    
    return {
      name: placeData.name,
      type: placeData.type,
      description: 'A local family-friendly winter venue',
      cost: 'low',
      indoor: true,
      outdoor: false,
      toddlerFriendly: true,
      strollerAccessible: true,
      parking: true,
      snackFriendly: true,
      bestSeason: ['winter'],
      tags: ['winter', 'holiday'],
      score: 50
    };
  }
  
  // Vary summer generics to avoid 4 consecutive identical splash pads
  if (season === 'summer' && weekNum >= 36) {
    const summerVariety = [
      { name: 'Local splash pad or pool', type: 'splash_pad' as Place['type'] },
      { name: 'Neighborhood park with playground', type: 'park' as Place['type'] },
      { name: 'Local farmers market', type: 'market' as Place['type'] },
      { name: 'Community pool or recreation center', type: 'pool' as Place['type'] }
    ];
    const placeData = summerVariety[(weekNum - 36) % summerVariety.length];
    
    return {
      name: placeData.name,
      type: placeData.type,
      description: 'A local family-friendly summer venue',
      cost: 'low',
      indoor: false,
      outdoor: true,
      toddlerFriendly: true,
      strollerAccessible: true,
      parking: true,
      snackFriendly: true,
      bestSeason: ['summer'],
      tags: [],
      score: 50
    };
  }
  
  // Regular seasonal generics for other weeks
  const generics: Record<Season, { name: string; type: Place['type'] }> = {
    winter: { name: 'Local library children\'s section', type: 'library' },
    spring: { name: 'Neighborhood parks and gardens', type: 'park' },
    summer: { name: 'Local park with playground', type: 'park' },
    fall: { name: 'Local farmers market', type: 'market' }
  };
  
  const generic = generics[season];
  
  return {
    name: generic.name,
    type: generic.type,
    description: 'A local family-friendly venue',
    cost: 'low',
    indoor: season === 'winter',
    outdoor: season !== 'winter',
    toddlerFriendly: true,
    strollerAccessible: true,
    parking: true,
    snackFriendly: true,
    bestSeason: [season],
    tags: [],
    score: 50
  };
}

export async function mapThemesToWeeks(placesBank: CuratedPlacesBank): Promise<WeekTemplate[]> {
  logger.info('Mapping places to 52 weeks...');

  const templates: WeekTemplate[] = [];
  const usedPlaceNames = new Set<string>();
  const recentTypes: Map<number, string> = new Map();

  // Create pools for each season (combining seasonal + year-round places)
  const pools = {
    winter: [...placesBank.winter, ...placesBank.yearRound],
    spring: [...placesBank.spring, ...placesBank.yearRound],
    summer: [...placesBank.summer, ...placesBank.yearRound],
    fall: [...placesBank.fall, ...placesBank.yearRound]
  };

  for (let weekNum = 1; weekNum <= 52; weekNum++) {
    const season = getSeasonForWeek(weekNum);
    const constantWeek = CONSTANT_WEEKS.find(c => c.week === weekNum);
    
    // For weeks 48-52 (late Nov/Dec), also include winter places for holiday themes
    let pool: Place[] = [];
    if (weekNum >= 48 && weekNum <= 52) {
      // Combine fall AND winter places for late-year holiday weeks
      pool = [...pools.fall, ...pools.winter].filter(p => !usedPlaceNames.has(p.name));
      // Filter out pumpkin patches and farms (wrong theme for Christmas/New Year)
      pool = pool.filter(p => {
        const nameLower = p.name.toLowerCase();
        return !nameLower.includes('pumpkin') && !nameLower.includes('harvest') && 
               !(p.type === 'farm' && !nameLower.includes('museum'));
      });
      // Prefer holiday-themed venues
      const holidayPlaces = pool.filter(p => {
        const nameLower = p.name.toLowerCase();
        const descLower = (p.description || '').toLowerCase();
        return nameLower.includes('holiday') || nameLower.includes('light') || 
               nameLower.includes('christmas') || descLower.includes('holiday') ||
               descLower.includes('december');
      });
      if (holidayPlaces.length > 0) {
        pool = holidayPlaces;
      }
    } else {
      // Regular seasonal pools for other weeks
      pool = pools[season].filter(p => !usedPlaceNames.has(p.name));
    }

    let selectedPlace: Place | null = null;

    if (pool.length > 0) {
      // Select place varying types and preferring higher scores
      selectedPlace = selectNextBestPlace(pool, weekNum, recentTypes);
      if (selectedPlace) {
        usedPlaceNames.add(selectedPlace.name);
        recentTypes.set(weekNum, selectedPlace.type);
      }
    } else {
      // Use generic seasonal fallback when we run out of specific places
      logger.warn(`No unique places available for week ${weekNum} (${season}), using generic fallback`);
      selectedPlace = getGenericPlace(season, weekNum);
      recentTypes.set(weekNum, selectedPlace.type);
    }

    templates.push({
      weekNumber: weekNum,
      title: constantWeek?.title || null,
      season: season,
      isConstant: !!constantWeek,
      placeToVisit: selectedPlace,
      theme: constantWeek?.theme || null
    });
  }

  logger.info(`Theme mapping complete: ${usedPlaceNames.size} unique places assigned, ${52 - usedPlaceNames.size} generic fallbacks`);
  return templates;
}

function selectNextBestPlace(
  pool: Place[],
  weekNum: number,
  recentTypes: Map<number, string>
): Place | null {
  if (pool.length === 0) return null;

  // Get place types used in last 3 weeks
  const lastThreeTypes: string[] = [];
  for (let i = Math.max(1, weekNum - 3); i < weekNum; i++) {
    const type = recentTypes.get(i);
    if (type) lastThreeTypes.push(type);
  }

  // Filter out recently used types if possible
  let candidates = pool.filter(p => !lastThreeTypes.includes(p.type));

  if (candidates.length === 0) {
    candidates = pool; // Fallback if all types used recently
  }

  // Return highest scored candidate
  return candidates.sort((a, b) => b.score - a.score)[0];
}

