import { NextRequest, NextResponse } from 'next/server';
import { generateEdition } from '../../../src/agents/A0-orchestrator';
import { v4 as uuidv4 } from 'uuid';
import { saveJob, updateJob } from '../../../src/utils/job-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city } = body;

    if (!city) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    const jobId = uuidv4();

    // Initialize job
    await saveJob(jobId, {
      jobId,
      city,
      status: 'running',
      progress: 0,
      message: 'Starting generation...',
      startTime: new Date().toISOString()
    });

    // Start generation in background
    generateEdition({
      city,
      onProgress: async (update) => {
        await updateJob(jobId, {
          progress: update.progress,
          message: update.message
        });
      }
    }).then(async (result) => {
      if (result.success) {
        await updateJob(jobId, {
          status: 'completed',
          progress: 100,
          message: 'Generation complete!',
          files: result.files,
          endTime: new Date().toISOString()
        });
      } else {
        await updateJob(jobId, {
          status: 'failed',
          error: result.error,
          endTime: new Date().toISOString()
        });
      }
    }).catch(async (error) => {
      await updateJob(jobId, {
        status: 'failed',
        error: error.message,
        endTime: new Date().toISOString()
      });
    });

    return NextResponse.json({ jobId });

  } catch (error) {
    console.error('Error starting generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

