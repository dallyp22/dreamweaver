import { Season } from '../models/types';

export interface ConstantWeek {
  week: number;
  title: string;
  season: Season;
  theme: string;
}

export const CONSTANT_WEEKS: ConstantWeek[] = [
  {
    week: 1,
    title: "Cozy Beginnings",
    season: "winter",
    theme: "Starting the year with comfort and connection"
  },
  {
    week: 7,
    title: "Kindness & Hearts",
    season: "winter",
    theme: "Valentine's celebration and love"
  },
  {
    week: 27,
    title: "Patriotic Play",
    season: "summer",
    theme: "Fourth of July celebration"
  },
  {
    week: 44,
    title: "Halloween Fun",
    season: "fall",
    theme: "Costume play and autumn magic"
  },
  {
    week: 47,
    title: "Gratitude Week",
    season: "fall",
    theme: "Thanksgiving and thankfulness"
  },
  {
    week: 51,
    title: "Christmas Week",
    season: "winter",
    theme: "Holiday wonder and traditions"
  },
  {
    week: 52,
    title: "New Year's Celebrations",
    season: "winter",
    theme: "Reflection and fresh starts"
  }
];

export const WEEK_SEASON_MAP: Record<number, Season> = {
  // Winter: Weeks 1-13 (Jan 1 - Mar 31)
  1: 'winter', 2: 'winter', 3: 'winter', 4: 'winter',
  5: 'winter', 6: 'winter', 7: 'winter', 8: 'winter',
  9: 'winter', 10: 'winter', 11: 'winter', 12: 'winter', 13: 'winter',
  
  // Spring: Weeks 14-26 (Apr 1 - Jun 30)
  14: 'spring', 15: 'spring', 16: 'spring', 17: 'spring',
  18: 'spring', 19: 'spring', 20: 'spring', 21: 'spring',
  22: 'spring', 23: 'spring', 24: 'spring', 25: 'spring', 26: 'spring',
  
  // Summer: Weeks 27-39 (Jul 1 - Sep 30)
  27: 'summer', 28: 'summer', 29: 'summer', 30: 'summer',
  31: 'summer', 32: 'summer', 33: 'summer', 34: 'summer',
  35: 'summer', 36: 'summer', 37: 'summer', 38: 'summer', 39: 'summer',
  
  // Fall: Weeks 40-52 (Oct 1 - Dec 31)
  40: 'fall', 41: 'fall', 42: 'fall', 43: 'fall', 44: 'fall',
  45: 'fall', 46: 'fall', 47: 'fall', 48: 'fall', 49: 'fall',
  50: 'fall', 51: 'fall', 52: 'fall'
};

export function getSeasonForWeek(weekNum: number): Season {
  return WEEK_SEASON_MAP[weekNum] || 'winter';
}

