import { NextRequest, NextResponse } from 'next/server';

// Access the same job store (in production, use shared storage)
declare global {
  var jobStore: Map<string, any>;
}

if (!global.jobStore) {
  global.jobStore = new Map();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId;
  
  // Note: In the actual implementation, jobs are stored in the generate route
  // This is a simplified version for the demo
  const job = global.jobStore.get(jobId);

  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(job);
}

