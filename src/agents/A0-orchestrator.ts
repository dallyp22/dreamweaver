import { normalizeCity } from './A1-city-normalizer';
import { researchPlaces } from './A2-researcher';
import { curatePlaces } from './A3-curator';
import { mapThemesToWeeks } from './A4-theme-mapper';
import { generateAllWeeks } from './A5-writer';
import { validateAndEnhance } from './A6-qa';
import { exportEdition } from './A7-exporter';
import { Edition } from '../models/types';
import { logger } from '../utils/logger';

export interface GenerationRequest {
  city: string;
  onProgress?: (update: ProgressUpdate) => void;
}

export interface ProgressUpdate {
  agent: string;
  message: string;
  progress: number; // 0-100
}

export interface GenerationResult {
  success: boolean;
  edition?: Edition;
  error?: string;
  metadata: {
    startTime: string;
    endTime: string;
    durationMs: number;
    agentTimings: Record<string, number>;
  };
  files?: {
    markdown: string;
    json: string;
    csv: string;
    summary: string;
  };
}

export async function generateEdition(request: GenerationRequest): Promise<GenerationResult> {
  const startTime = Date.now();
  const agentTimings: Record<string, number> = {};

  const emitProgress = (agent: string, message: string, progress: number) => {
    logger.info(`[${agent}] ${message}`);
    request.onProgress?.({ agent, message, progress });
  };

  try {
    logger.info(`Starting edition generation for: ${request.city}`);

    // A1: City Normalizer
    emitProgress('A1-Normalizer', 'Normalizing city information...', 5);
    const t1 = Date.now();
    const cityMetadata = await normalizeCity(request.city);
    agentTimings['A1-Normalizer'] = Date.now() - t1;
    emitProgress('A1-Normalizer', `City normalized: ${cityMetadata.name}, ${cityMetadata.state}`, 10);

    // A2: Researcher
    emitProgress('A2-Researcher', 'Researching local places (this may take 2-3 minutes)...', 15);
    const t2 = Date.now();
    const rawPlaces = await researchPlaces(cityMetadata);
    agentTimings['A2-Researcher'] = Date.now() - t2;
    emitProgress('A2-Researcher', `Research complete: ${rawPlaces.length} places found`, 30);

    // A3: Curator
    emitProgress('A3-Curator', 'Scoring and organizing places...', 35);
    const t3 = Date.now();
    const placesBank = await curatePlaces(rawPlaces);
    agentTimings['A3-Curator'] = Date.now() - t3;
    const totalCurated = Object.values(placesBank).reduce((sum, arr) => sum + arr.length, 0);
    emitProgress('A3-Curator', `Curation complete: ${totalCurated} quality places organized`, 45);

    // A4: Theme Mapper
    emitProgress('A4-ThemeMapper', 'Mapping places to 52 weeks...', 50);
    const t4 = Date.now();
    const weekTemplates = await mapThemesToWeeks(placesBank);
    agentTimings['A4-ThemeMapper'] = Date.now() - t4;
    emitProgress('A4-ThemeMapper', 'Week templates created', 55);

    // A5: Writer
    emitProgress('A5-Writer', 'Generating week content with AI (this may take 3-4 minutes)...', 60);
    const t5 = Date.now();
    const weeks = await generateAllWeeks(weekTemplates, cityMetadata);
    agentTimings['A5-Writer'] = Date.now() - t5;
    emitProgress('A5-Writer', 'All 52 weeks generated', 85);

    // A6: QA
    emitProgress('A6-QA', 'Running quality checks...', 90);
    const t6 = Date.now();
    const { weeks: validatedWeeks, issues } = await validateAndEnhance(weeks, cityMetadata);
    agentTimings['A6-QA'] = Date.now() - t6;
    emitProgress('A6-QA', `QA complete: ${issues.filter(i => i.severity === 'error').length} errors, ${issues.filter(i => i.severity === 'warning').length} warnings`, 92);

    // Build Edition
    const edition: Edition = {
      edition: `${cityMetadata.name} Edition`,
      city: cityMetadata,
      generatedAt: new Date().toISOString(),
      version: '1.0',
      weeks: validatedWeeks,
      metadata: {
        totalPlaces: rawPlaces.length,
        generationTimeMs: Date.now() - startTime
      }
    };

    // A7: Exporter
    emitProgress('A7-Exporter', 'Exporting files...', 95);
    const t7 = Date.now();
    const exportResult = await exportEdition(edition);
    agentTimings['A7-Exporter'] = Date.now() - t7;
    emitProgress('A7-Exporter', 'Export complete!', 100);

    const endTime = Date.now();

    logger.info(`Generation complete! Duration: ${((endTime - startTime) / 1000).toFixed(1)}s`);

    return {
      success: true,
      edition,
      metadata: {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationMs: endTime - startTime,
        agentTimings
      },
      files: exportResult.paths
    };

  } catch (error) {
    const endTime = Date.now();
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error(`Generation failed: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
      metadata: {
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        durationMs: endTime - startTime,
        agentTimings
      }
    };
  }
}

