# WilderSeasons Edition Generator

AI-powered system that generates complete 52-week city-specific WilderSeasons editions in under 5 minutes.

## 🌟 Features

- **Automated Research**: Generates 40 real, family-friendly places using Claude's knowledge base
- **AI Content Generation**: Creates activities, recipes, songs, and books using Claude Sonnet
- **Dakota's Voice**: Maintains the warm, encouraging tone from existing editions
- **Vetted Content**: Uses pre-approved songs and books from Omaha/Lincoln editions
- **Multi-Format Export**: Outputs Markdown, JSON, and CSV (Canva-ready)
- **Web Interface**: Simple web app for company-wide access
- **CLI Tool**: Command-line interface for developers

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Anthropic API key

### Installation

1. Clone the repository:
```bash
cd /Users/dallas/WilderGenerator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# API keys are already in .env file
# ANTHROPIC_API_KEY=your_key_here
```

### Usage

#### CLI (Command Line)

Generate an edition from the terminal:

```bash
npm run generate -- --city="Madison, Wisconsin"
```

Output files will be created in the `/output` directory:
- `WilderSeasons_Madison_Edition_2025-10-18.md` - Full book in Markdown
- `WilderSeasons_Madison_Edition_2025-10-18.json` - Structured data
- `WilderSeasons_Madison_Canva_2025-10-18.csv` - CSV for Canva import
- `WilderSeasons_Madison_Summary_2025-10-18.txt` - Generation statistics

#### Web App

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

1. Enter a city name (e.g., "Des Moines, Iowa")
2. Click "Generate Edition"
3. Watch real-time progress
4. Download files when complete

## 📊 Generation Process

The system runs through 7 agents sequentially:

1. **A1: City Normalizer** - Geocodes and enriches city metadata
2. **A2: Researcher** - Generates 40 real places using Claude's knowledge base (10 per season)
3. **A3: Curator** - Scores, deduplicates, and organizes places
4. **A4: Theme Mapper** - Assigns places to 52 weeks (respects constant weeks)
5. **A5: Writer** - Generates content using Claude Sonnet
6. **A6: QA** - Validates safety, tone, and quality
7. **A7: Exporter** - Creates Markdown, JSON, and CSV files

**Typical generation time:** 4-5 minutes

## 🎨 Content Structure

Each week contains:
- **Title**: Warm, evocative (3-5 words)
- **Place to Visit**: Local family-friendly destination
- **Activities (3-4)**: Concise, 5-10 word descriptions
- **Recipe**: Simple, toddler-friendly with "toddler task"
- **Song**: From vetted library, matched to season
- **Book**: From vetted library, matched to theme

### Constant Weeks

These weeks have locked titles across all editions:
- Week 1: "Cozy Beginnings"
- Week 7: "Kindness & Hearts"
- Week 27: "Patriotic Play"
- Week 44: "Halloween Fun"
- Week 47: "Gratitude Week"
- Week 51: "Christmas Week"
- Week 52: "New Year's Celebrations"

## 📁 Project Structure

```
wilderseasons-generator/
├── src/
│   ├── agents/              # Generation pipeline agents
│   │   ├── A0-orchestrator.ts
│   │   ├── A1-city-normalizer.ts
│   │   ├── A2-researcher.ts
│   │   ├── A3-curator.ts
│   │   ├── A4-theme-mapper.ts
│   │   ├── A5-writer.ts
│   │   ├── A6-qa.ts
│   │   └── A7-exporter.ts
│   ├── constants/          # Songs, books, weeks definitions
│   ├── models/             # TypeScript types and Zod schemas
│   ├── utils/              # Helper functions
│   ├── config.ts           # Configuration
│   └── cli.ts              # CLI entry point
├── app/                    # Next.js web app
│   ├── api/               # API routes
│   ├── page.tsx           # Main web interface
│   └── layout.tsx         # Layout
├── output/                # Generated editions (gitignored)
├── package.json
├── tsconfig.json
└── .env                   # API keys (gitignored)
```

## 🔧 Configuration

Environment variables in `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-...
OUTPUT_DIR=./output        # Optional, defaults to ./output
LOG_LEVEL=info            # Optional: debug, info, warn, error
CLAUDE_MODEL=claude-sonnet-4-20250514  # Optional
MAX_RETRIES=3             # Optional
```

## 💰 API Costs

Per edition (estimated):
- **Claude Research**: 4 calls × 4096 tokens × $0.003/1K = $0.05
- **Claude Content**: 52 weeks × 4096 tokens × $0.003/1K = $0.64
- **Total**: ~$0.69 per edition (52% cost reduction!)

Monthly (20 editions): ~$14
Yearly (250 editions): ~$173

## 🎯 Target Cities

### Phase 1 (Midwest)
- Des Moines, IA
- Madison, WI
- Kansas City, MO
- Minneapolis/St. Paul, MN
- Indianapolis, IN

### Future Expansion
- 100+ US cities with 100k+ population
- International editions (Canada, UK, Australia)

## 🚢 Deployment

### Development
```bash
npm run dev
```

### Production (Vercel)
```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
vercel deploy
```

### Docker (Future)
```dockerfile
# Coming soon
```

## 🧪 Testing

To test with a pilot city:

```bash
npm run generate -- --city="Des Moines, Iowa"
```

Verify output:
1. Check `/output` directory for files
2. Open Markdown file to review content
3. Import CSV into Canva for design testing
4. Validate voice consistency against Omaha/Lincoln editions

## 📝 Development Notes

- Uses TypeScript 5.7 with strict mode
- Zod for runtime validation
- Claude Sonnet 4 for both place research and content generation
- Next.js 14 App Router for web interface
- Claude generates 40 real places per city from its knowledge base
- Works best with mid-sized+ cities; may generate generic suggestions for very small towns

## 🐛 Troubleshooting

### "City not found" error
- Check city name spelling
- Include state (e.g., "Madison, Wisconsin" not just "Madison")
- Try alternative names (e.g., "St. Paul" vs "Saint Paul")

### Generation timeout
- Check internet connection
- Verify API keys are valid
- Check API rate limits

### Missing output files
- Ensure `/output` directory exists
- Check file permissions
- Verify `OUTPUT_DIR` in `.env`

## 🤝 Contributing

This is an internal tool for WilderSeasons. For questions or issues, contact Dallas Polivka.

## 📄 License

Proprietary - WilderSeasons © 2025

---

**Built with 🌲 by Dallas & Dakota Polivka**

