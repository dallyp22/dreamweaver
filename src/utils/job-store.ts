import { promises as fs } from 'fs';
import path from 'path';

const JOB_STORE_DIR = process.env.VERCEL 
  ? '/tmp/jobs' 
  : path.join(process.cwd(), 'output', '.jobs');

// Ensure job store directory exists
async function ensureJobStoreDir() {
  try {
    await fs.mkdir(JOB_STORE_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

export async function saveJob(jobId: string, jobData: any): Promise<void> {
  await ensureJobStoreDir();
  const filePath = path.join(JOB_STORE_DIR, `${jobId}.json`);
  await fs.writeFile(filePath, JSON.stringify(jobData, null, 2));
}

export async function getJob(jobId: string): Promise<any | null> {
  try {
    await ensureJobStoreDir();
    const filePath = path.join(JOB_STORE_DIR, `${jobId}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

export async function updateJob(jobId: string, updates: Partial<any>): Promise<void> {
  const job = await getJob(jobId);
  if (job) {
    const updated = { ...job, ...updates };
    await saveJob(jobId, updated);
  }
}

