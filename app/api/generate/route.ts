import { NextRequest, NextResponse } from 'next/server';
import { generateEdition } from '../../../src/agents/A0-orchestrator';
import { v4 as uuidv4 } from 'uuid';

// Global job store shared across API routes
declare global {
  var jobStore: Map<string, any>;
}

if (!global.jobStore) {
  global.jobStore = new Map();
}

const jobs = global.jobStore;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city } = body;

    if (!city) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    const jobId = uuidv4();

    // Initialize job
    jobs.set(jobId, {
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
      onProgress: (update) => {
        const job = jobs.get(jobId);
        if (job) {
          job.progress = update.progress;
          job.message = update.message;
          jobs.set(jobId, job);
        }
      }
    }).then((result) => {
      const job = jobs.get(jobId);
      if (job) {
        if (result.success) {
          job.status = 'completed';
          job.progress = 100;
          job.message = 'Generation complete!';
          job.files = result.files;
          job.endTime = new Date().toISOString();
        } else {
          job.status = 'failed';
          job.error = result.error;
          job.endTime = new Date().toISOString();
        }
        jobs.set(jobId, job);
      }
    }).catch((error) => {
      const job = jobs.get(jobId);
      if (job) {
        job.status = 'failed';
        job.error = error.message;
        job.endTime = new Date().toISOString();
        jobs.set(jobId, job);
      }
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

