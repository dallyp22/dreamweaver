import { CityMetadata, ClimateZone } from '../models/types';
import { logger } from '../utils/logger';

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

export async function normalizeCity(cityInput: string): Promise<CityMetadata> {
  logger.info(`Normalizing city: ${cityInput}`);

  try {
    // Geocode using OpenStreetMap Nominatim API
    const geocoded = await geocodeCity(cityInput);
    
    // Determine climate zone based on latitude
    const climateZone = determineClimateZone(geocoded.latitude);
    
    // Determine timezone (simplified - using US zones)
    const timezone = getTimezoneForCoordinates(geocoded.latitude, geocoded.longitude);
    
    const metadata: CityMetadata = {
      name: geocoded.name,
      state: geocoded.state,
      country: geocoded.country || 'USA',
      latitude: geocoded.latitude,
      longitude: geocoded.longitude,
      timezone,
      climateZone,
      region: determineRegion(geocoded.state || '')
    };

    logger.info(`City normalized successfully: ${metadata.name}, ${metadata.state}`);
    return metadata;
  } catch (error) {
    logger.error(`Failed to normalize city: ${error}`);
    throw new Error(`City normalization failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function geocodeCity(cityInput: string): Promise<{
  name: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
}> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityInput)}&format=json&limit=1&addressdetails=1`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'WilderSeasons Edition Generator'
    }
  });

  if (!response.ok) {
    throw new Error(`Geocoding API returned ${response.status}`);
  }

  const data: NominatimResponse[] = await response.json();

  if (!data || data.length === 0) {
    throw new Error(`City "${cityInput}" not found`);
  }

  const result = data[0];
  const cityName = result.address?.city || result.address?.town || result.address?.village || cityInput.split(',')[0];
  
  return {
    name: cityName,
    state: result.address?.state,
    country: result.address?.country || 'USA',
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon)
  };
}

function determineClimateZone(latitude: number): ClimateZone {
  const absLat = Math.abs(latitude);
  
  // Simplified Köppen-Geiger climate classification for US
  if (absLat > 45) return 'cold'; // Northern states
  if (absLat > 37) return 'temperate'; // Mid-latitude
  if (absLat > 28) return 'warm'; // Southern states
  return 'hot'; // Deep south/tropical
}

function getTimezoneForCoordinates(lat: number, lng: number): string {
  // Simplified timezone mapping for US
  if (lng > -75) return 'America/New_York'; // Eastern
  if (lng > -90) return 'America/Chicago'; // Central
  if (lng > -115) return 'America/Denver'; // Mountain
  return 'America/Los_Angeles'; // Pacific
}

function determineRegion(state: string): string {
  const regions: Record<string, string> = {
    'Maine': 'Northeast', 'New Hampshire': 'Northeast', 'Vermont': 'Northeast',
    'Massachusetts': 'Northeast', 'Rhode Island': 'Northeast', 'Connecticut': 'Northeast',
    'New York': 'Northeast', 'New Jersey': 'Northeast', 'Pennsylvania': 'Northeast',
    
    'Ohio': 'Midwest', 'Indiana': 'Midwest', 'Illinois': 'Midwest', 'Michigan': 'Midwest',
    'Wisconsin': 'Midwest', 'Minnesota': 'Midwest', 'Iowa': 'Midwest', 'Missouri': 'Midwest',
    'North Dakota': 'Midwest', 'South Dakota': 'Midwest', 'Nebraska': 'Midwest', 'Kansas': 'Midwest',
    
    'Delaware': 'South', 'Maryland': 'South', 'Virginia': 'South', 'West Virginia': 'South',
    'Kentucky': 'South', 'North Carolina': 'South', 'South Carolina': 'South', 'Tennessee': 'South',
    'Georgia': 'South', 'Florida': 'South', 'Alabama': 'South', 'Mississippi': 'South',
    'Arkansas': 'South', 'Louisiana': 'South', 'Texas': 'South', 'Oklahoma': 'South',
    
    'Montana': 'West', 'Idaho': 'West', 'Wyoming': 'West', 'Nevada': 'West',
    'Utah': 'West', 'Colorado': 'West', 'Arizona': 'West', 'New Mexico': 'West',
    'Alaska': 'West', 'Washington': 'West', 'Oregon': 'West', 'California': 'West', 'Hawaii': 'West'
  };

  return regions[state] || 'Midwest';
}

