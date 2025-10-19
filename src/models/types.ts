import { z } from 'zod';

// Enums
export const SeasonEnum = z.enum(['winter', 'spring', 'summer', 'fall']);
export const ClimateZoneEnum = z.enum(['cold', 'temperate', 'warm', 'hot', 'variable']);
export const PlaceTypeEnum = z.enum([
  'park',
  'playground',
  'museum',
  'library',
  'indoor_play',
  'farm',
  'market',
  'nature_center',
  'botanical_garden',
  'zoo',
  'aquarium',
  'splash_pad',
  'pool',
  'beach',
  'trail',
  'forest',
  'garden',
  'art_studio',
  'bakery',
  'cafe',
  'cultural_center',
  'other'
]);

export type Season = z.infer<typeof SeasonEnum>;
export type ClimateZone = z.infer<typeof ClimateZoneEnum>;
export type PlaceType = z.infer<typeof PlaceTypeEnum>;

// City Metadata
export const CityMetadataSchema = z.object({
  name: z.string(),
  state: z.string().optional(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  climateZone: ClimateZoneEnum,
  population: z.number().optional(),
  region: z.string().optional(),
  culturalNotes: z.array(z.string()).optional()
});

export type CityMetadata = z.infer<typeof CityMetadataSchema>;

// Place
export const PlaceSchema = z.object({
  name: z.string(),
  type: PlaceTypeEnum,
  description: z.string().optional(),
  address: z.string().optional(),
  url: z.string().optional(),
  cost: z.enum(['free', 'low', 'medium', 'high', 'membership']),
  indoor: z.boolean().default(false),
  outdoor: z.boolean().default(false),
  toddlerFriendly: z.boolean().default(false),
  strollerAccessible: z.boolean().default(false),
  parking: z.boolean().default(false),
  snackFriendly: z.boolean().default(false),
  bestSeason: z.array(SeasonEnum).default([]),
  tags: z.array(z.string()).default([]),
  score: z.number().min(0).max(100).default(0)
});

export type Place = z.infer<typeof PlaceSchema>;

// Activity
export const ActivitySchema = z.object({
  name: z.string(),
  description: z.string()
});

export type Activity = z.infer<typeof ActivitySchema>;

// Recipe
export const RecipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.string(),
  toddlerTask: z.string()
});

export type Recipe = z.infer<typeof RecipeSchema>;

// Song
export const SongSchema = z.object({
  title: z.string(),
  artist: z.string(),
  isChristmas: z.boolean().optional()
});

export type Song = z.infer<typeof SongSchema>;

// Book
export const BookSchema = z.object({
  title: z.string(),
  author: z.string()
});

export type Book = z.infer<typeof BookSchema>;

// Week
export const WeekSchema = z.object({
  week: z.number().min(1).max(52),
  title: z.string(),
  placeToVisit: z.string().optional(),
  activities: z.array(ActivitySchema),
  song: SongSchema,
  book: BookSchema,
  recipe: RecipeSchema
});

export type Week = z.infer<typeof WeekSchema>;

// Week Template (used during generation)
export const WeekTemplateSchema = z.object({
  weekNumber: z.number().min(1).max(52),
  title: z.string().nullable(),
  season: SeasonEnum,
  isConstant: z.boolean(),
  placeToVisit: PlaceSchema.nullable(),
  theme: z.string().nullable()
});

export type WeekTemplate = z.infer<typeof WeekTemplateSchema>;

// Curated Places Bank
export const CuratedPlacesBankSchema = z.object({
  winter: z.array(PlaceSchema),
  spring: z.array(PlaceSchema),
  summer: z.array(PlaceSchema),
  fall: z.array(PlaceSchema),
  yearRound: z.array(PlaceSchema)
});

export type CuratedPlacesBank = z.infer<typeof CuratedPlacesBankSchema>;

// Edition
export const EditionSchema = z.object({
  edition: z.string(),
  city: CityMetadataSchema,
  generatedAt: z.string(),
  version: z.string(),
  weeks: z.array(WeekSchema),
  metadata: z.object({
    totalPlaces: z.number(),
    wordCount: z.number().optional(),
    generationTimeMs: z.number().optional()
  })
});

export type Edition = z.infer<typeof EditionSchema>;

// Job Status (for web app)
export const JobStatusEnum = z.enum(['pending', 'running', 'completed', 'failed']);
export type JobStatus = z.infer<typeof JobStatusEnum>;

export const GenerationJobSchema = z.object({
  jobId: z.string(),
  city: z.string(),
  status: JobStatusEnum,
  currentAgent: z.string().optional(),
  progress: z.number().min(0).max(100),
  startTime: z.string(),
  endTime: z.string().optional(),
  edition: EditionSchema.optional(),
  error: z.string().optional(),
  files: z.object({
    markdown: z.string().optional(),
    json: z.string().optional(),
    csv: z.string().optional(),
    summary: z.string().optional()
  }).optional()
});

export type GenerationJob = z.infer<typeof GenerationJobSchema>;

// Progress Event
export const ProgressEventSchema = z.object({
  jobId: z.string(),
  type: z.enum(['agent_start', 'agent_complete', 'progress_update', 'error', 'complete']),
  agent: z.string().optional(),
  message: z.string(),
  progress: z.number().min(0).max(100)
});

export type ProgressEvent = z.infer<typeof ProgressEventSchema>;

