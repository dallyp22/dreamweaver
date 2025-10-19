import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '../../../../src/utils/job-store';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  const jobId = params.jobId;
  
  const job = await getJob(jobId);

  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(job);
}

