import { Place, CuratedPlacesBank, Season } from '../models/types';
import { logger } from '../utils/logger';

const CHAIN_LOCATIONS = [
  'mcdonalds', 'burger king', 'walmart', 'target', 'costco',
  'chuck e cheese', 'dave and busters', 'urban air', 'sky zone'
];

export async function curatePlaces(places: Place[]): Promise<CuratedPlacesBank> {
  logger.info(`Curating ${places.length} places...`);

  // 1. Deduplicate
  const deduplicated = deduplicatePlaces(places);
  logger.info(`After deduplication: ${deduplicated.length} places`);

  // 2. Score each place
  const scored = deduplicated.map(place => ({
    ...place,
    score: scorePlace(place)
  }));

  // 3. Filter minimum score
  const filtered = scored.filter(place => place.score >= 40);
  logger.info(`After filtering (score >= 40): ${filtered.length} places`);

  // 4. Organize by seasonality
  const organized = organizePlacesBySeasonality(filtered);

  logger.info(`Curation complete:`, {
    winter: organized.winter.length,
    spring: organized.spring.length,
    summer: organized.summer.length,
    fall: organized.fall.length,
    yearRound: organized.yearRound.length
  });

  return organized;
}

function deduplicatePlaces(places: Place[]): Place[] {
  const seen = new Map<string, Place>();

  for (const place of places) {
    const key = generatePlaceKey(place);

    if (!seen.has(key)) {
      seen.set(key, place);
    } else {
      // Merge data from duplicates (take better description, combine tags)
      const existing = seen.get(key)!;
      const merged = mergePlaces(existing, place);
      seen.set(key, merged);
    }
  }

  return Array.from(seen.values());
}

function generatePlaceKey(place: Place): string {
  // Normalize name: lowercase, remove punctuation, trim
  const normalizedName = place.name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();

  // Include first part of address if available for disambiguation
  const addressKey = place.address
    ? place.address.toLowerCase().split(',')[0]
    : '';

  return `${normalizedName}|${addressKey}`;
}

function mergePlaces(place1: Place, place2: Place): Place {
  return {
    ...place1,
    description: place1.description && place1.description.length > (place2.description?.length || 0)
      ? place1.description
      : place2.description,
    address: place1.address || place2.address,
    url: place1.url || place2.url,
    tags: Array.from(new Set([...place1.tags, ...place2.tags])),
    bestSeason: Array.from(new Set([...place1.bestSeason, ...place2.bestSeason])) as Season[]
  };
}

function scorePlace(place: Place): number {
  let score = 50; // baseline

  // Cost (0-20 points)
  const costScores = { free: 20, low: 15, medium: 10, high: 5, membership: 12 };
  score += costScores[place.cost];

  // Age Appropriateness (0-20 points)
  if (place.toddlerFriendly) score += 15;
  if (place.description?.toLowerCase().includes('toddler')) score += 5;
  if (place.description?.toLowerCase().includes('ages 0-5')) score += 5;
  if (place.description?.toLowerCase().includes('infant')) score += 3;

  // Accessibility (0-20 points)
  if (place.strollerAccessible) score += 10;
  if (place.parking) score += 5;
  if (place.indoor && place.outdoor) score += 5; // Flexible options

  // Seasonal Relevance (0-15 points)
  if (place.bestSeason.length >= 3) score += 15; // Multi-season
  else if (place.bestSeason.length === 2) score += 10;
  else if (place.bestSeason.length === 1) score += 5;

  // Amenities (0-10 points)
  if (place.snackFriendly) score += 3;
  if (place.tags.includes('restrooms')) score += 3;
  if (place.tags.includes('nursing-friendly')) score += 2;
  if (place.tags.includes('shaded')) score += 2;

  // Novelty (0-10 points)
  if (!isChainLocation(place.name)) score += 10;

  // Quality Signals (0-5 points)
  if (place.description && place.description.length > 100) score += 3;
  if (place.url) score += 2;

  return Math.min(score, 100);
}

function isChainLocation(name: string): boolean {
  const normalized = name.toLowerCase();
  return CHAIN_LOCATIONS.some(chain => normalized.includes(chain));
}

function organizePlacesBySeasonality(places: Place[]): CuratedPlacesBank {
  const bank: CuratedPlacesBank = {
    winter: [],
    spring: [],
    summer: [],
    fall: [],
    yearRound: []
  };

  for (const place of places) {
    // If place is good for all seasons, add to yearRound
    if (place.bestSeason.length >= 3) {
      bank.yearRound.push(place);
    } else {
      // Add to each applicable season
      for (const season of place.bestSeason) {
        bank[season].push(place);
      }
    }
  }

  // Sort each array by score (highest first)
  bank.winter.sort((a, b) => b.score - a.score);
  bank.spring.sort((a, b) => b.score - a.score);
  bank.summer.sort((a, b) => b.score - a.score);
  bank.fall.sort((a, b) => b.score - a.score);
  bank.yearRound.sort((a, b) => b.score - a.score);

  return bank;
}

