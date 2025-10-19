import dotenv from 'dotenv';
dotenv.config();

export const config = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  outputDir: process.env.OUTPUT_DIR || './output',
  logLevel: process.env.LOG_LEVEL || 'info',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
  maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
  timeoutMs: parseInt(process.env.TIMEOUT_MS || '60000')
};

// Validate required API keys
export function validateConfig(): void {
  if (!config.anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY is required in .env file');
  }
}

