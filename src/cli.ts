#!/usr/bin/env node

import { generateEdition } from './agents/A0-orchestrator';
import { validateConfig } from './config';
import { logger } from './utils/logger';

async function main() {
  console.log('\n🌲 WilderSeasons Edition Generator 🌲\n');

  // Parse arguments
  const args = process.argv.slice(2);
  const cityArg = args.find(arg => arg.startsWith('--city='));

  if (!cityArg) {
    console.error('Usage: npm run generate -- --city="City, State"');
    console.error('Example: npm run generate -- --city="Madison, Wisconsin"');
    process.exit(1);
  }

  const city = cityArg.replace('--city=', '').replace(/^["']|["']$/g, '');

  try {
    // Validate configuration
    validateConfig();

    console.log(`Generating edition for: ${city}\n`);

    // Progress bar
    let lastProgress = 0;
    const progressBar = (progress: number) => {
      const width = 40;
      const filled = Math.floor((progress / 100) * width);
      const empty = width - filled;
      const bar = '█'.repeat(filled) + '░'.repeat(empty);
      return `[${bar}] ${progress}%`;
    };

    // Generate edition
    const result = await generateEdition({
      city,
      onProgress: (update) => {
        if (update.progress > lastProgress) {
          process.stdout.write(`\r${progressBar(update.progress)} ${update.message}`);
          lastProgress = update.progress;
        }
      }
    });

    console.log('\n');

    if (result.success) {
      console.log('✅ Generation complete!\n');
      console.log('📁 Output files:');
      console.log(`   Markdown: ${result.files?.markdown}`);
      console.log(`   JSON: ${result.files?.json}`);
      console.log(`   CSV: ${result.files?.csv}`);
      console.log(`   Summary: ${result.files?.summary}`);
      console.log('');
      console.log(`⏱️  Generation time: ${(result.metadata.durationMs / 1000).toFixed(1)}s`);
      console.log('');
      console.log('Agent timings:');
      for (const [agent, time] of Object.entries(result.metadata.agentTimings)) {
        console.log(`   ${agent}: ${(time / 1000).toFixed(1)}s`);
      }
      console.log('');
    } else {
      console.error('❌ Generation failed:', result.error);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();

