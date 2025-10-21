# Add Hidden Gems Research for More Variety

## Overview
Add a 5th Claude research call to find lesser-known, unique local spots that families with toddlers would love. This supplements the 60 seasonal places with 10-12 "hidden gems" for total variety of ~70-72 places.

## Examples from Omaha Edition
- **Dundee Candle Co.** - Specialty shop
- **Sweet Magnolias Bakery** - Local bakery
- **Doodle Art Studio** - Art studio
- **Kids Cave Play Cafe** - Play cafe
- **Gifford Park Community Garden** - Community garden

## Implementation

### 1. Add Hidden Gems Prompt to A2-researcher.ts

Add after the SEASONAL_PROMPTS object:

```typescript
const HIDDEN_GEMS_PROMPT = `Generate 12 HIDDEN GEM family-friendly places in {city} - lesser-known local spots perfect for families with toddlers (ages 0-5).

Focus on UNIQUE, LOCAL, and LESSER-KNOWN venues that aren't the obvious big attractions:

INCLUDE:
- Local bakeries with kid-friendly spaces
- Specialty toy stores or children's shops
- Independent bookstores with story times
- Community gardens or urban farms
- Art studios offering toddler classes
- Local cafes with play areas
- Unique indoor play cafes
- Specialty shops (candle making, pottery, etc.)
- Neighborhood libraries (not main branch)
- Local farms or petting zoos
- Family-owned ice cream shops
- Community centers with unique programs

DO NOT include: Major chains, big museums already covered, McDonald's playplaces

Requirements:
- Real venues that exist with full proper names
- Brief description emphasizing what makes them special/hidden
- Note if they're year-round or seasonal
- Include address if known
- Mark as toddler-friendly with any special amenities

Return as JSON array with same structure as seasonal searches.
`;
```

### 2. Add Hidden Gems Research Call

In `researchPlaces()` function, add AFTER the seasonal loop:

```typescript
// Research all seasons using Claude
for (const season of ['winter', 'spring', 'summer', 'fall'] as Season[]) {
  // ... existing code ...
}

// ADDITION: Research hidden gems (year-round unique spots)
logger.info(`Researching hidden gems and local favorites...`);

try {
  const prompt = HIDDEN_GEMS_PROMPT.replace('{city}', `${city.name}, ${city.state}`);

  const response = await anthropic.messages.create({
    model: config.claudeModel,
    max_tokens: 4096,
    temperature: 0.8, // Higher temperature for more creative/varied suggestions
    system: "You are a local expert who knows the hidden gems and unique family spots that locals love but tourists might miss. Always return only valid JSON.",
    messages: [{ role: "user", content: prompt }]
  });

  const rawResponse = response.content[0].type === 'text' ? response.content[0].text : '';
  
  // Parse and add to allPlaces with year-round season tag
  const claudePlaces = parseClaudeResponse(rawResponse, 'spring'); // Use spring as default
  const places = claudePlacesToPlaces(claudePlaces, city).map(p => ({
    ...p,
    bestSeason: ['winter', 'spring', 'summer', 'fall'] as Season[], // Year-round
    tags: [...p.tags, 'hidden-gem', 'local-favorite']
  }));

  allPlaces.push(...places);
  logger.info(`Found ${places.length} hidden gems`);

} catch (error) {
  logger.warn(`Hidden gems research failed: ${error}`);
}

logger.info(`Research complete: ${allPlaces.length} total places found`);
```

### 3. Update Expected Total

Change the warning threshold:

```typescript
if (allPlaces.length < 65) {
  logger.warn(`Only found ${allPlaces.length} places, expected ~72. Results may be limited for this city.`);
}
```

## Benefits

1. **More Variety:** 70-72 total places vs 60
2. **Local Character:** Unique venues add authentic local flavor
3. **Reduced Generic Fallbacks:** More real places = fewer "Local splash pad" generics
4. **Better Themes:** Hidden gems often have unique themes (bakeries, art studios, specialty shops)
5. **Year-Round Options:** Hidden gems tagged as year-round increase flexibility

## Expected Results

**Current:** 60 places → 46 used, 6 generic fallbacks  
**After:** 70-72 places → 52+ used, 0-3 generic fallbacks

**Hidden Gem Examples for Des Moines:**
- Jeni's Splendid Ice Creams
- Fong's Pizza (unique local spot)
- Raygun (quirky local shop)
- Confluence Brewing (family-friendly)
- Local art studios, play cafes, specialty shops

## Files to Modify

1. `src/agents/A2-researcher.ts` - Add HIDDEN_GEMS_PROMPT and research call

## Testing

Generate Des Moines edition and verify:
- ~70-72 total places researched
- Hidden gems appear in output (bakeries, cafes, studios)
- Reduced generic fallbacks
- More unique local character

