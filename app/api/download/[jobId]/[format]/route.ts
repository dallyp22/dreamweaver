import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string; format: string } }
) {
  try {
    const { jobId, format } = params;

    // Get job to find file paths
    const job = global.jobStore?.get(jobId);

    if (!job || !job.files) {
      return NextResponse.json({ error: 'Files not found' }, { status: 404 });
    }

    let filePath: string;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'markdown':
        filePath = job.files.markdown;
        contentType = 'text/markdown';
        filename = path.basename(filePath);
        break;
      case 'json':
        filePath = job.files.json;
        contentType = 'application/json';
        filename = path.basename(filePath);
        break;
      case 'csv':
        filePath = job.files.csv;
        contentType = 'text/csv';
        filename = path.basename(filePath);
        break;
      case 'summary':
        filePath = job.files.summary;
        contentType = 'text/plain';
        filename = path.basename(filePath);
        break;
      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

