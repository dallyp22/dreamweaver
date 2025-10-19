import { Season } from '../models/types';

export const COST_ICONS: Record<string, string> = {
  free: '🆓',
  low: '💲',
  medium: '💳',
  high: '💳',
  membership: '🎫'
};

export const SEASON_ICONS: Record<Season, string> = {
  winter: '❄️',
  spring: '🌱',
  summer: '☀️',
  fall: '🍂'
};

export const LOCATION_ICONS = {
  indoor: '🏠',
  outdoor: '🌳'
};

export const AMENITY_ICONS = {
  toddlerFriendly: '👶',
  excellent: '🌟', // Score 80+
  strollerAccessible: '🍼',
  parking: '🅿️',
  snackFriendly: '🍎'
};

