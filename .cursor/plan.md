# Add Hidden Gems Research Enhancement

## Goal
Add a 5th Claude research call to discover unique, lesser-known local spots that families with toddlers would love, increasing variety and reducing generic fallbacks.

## Implementation

### 1. Add Hidden Gems Prompt

Add to `src/agents/A2-researcher.ts` after SEASONAL_PROMPTS:

```typescript
const HIDDEN_GEMS_PROMPT = `Generate 12 HIDDEN GEM family-friendly places in {city} - lesser-known local spots perfect for families with toddlers (ages 0-5).

Focus on UNIQUE, LOCAL, and LESSER-KNOWN venues:
- Local bakeries with kid-friendly spaces
- Independent bookstores with story times  
- Art studios offering toddler classes
- Play cafes with indoor play areas
- Specialty shops (candle making, pottery, etc.)
- Community gardens or small urban farms
- Family-owned ice cream or treat shops
- Unique local toy stores
- Neighborhood libraries (not main branch)
- Coffee shops with play spaces
- Local parks that are neighborhood favorites

DO NOT include: Chain stores, major museums, obvious tourist spots

Return same JSON format as seasonal prompts.`;
```

### 2. Add Hidden Gems Research Call

In `researchPlaces()` function after the seasonal loop but before final logging:

```typescript
// Research hidden gems (year-round unique spots)
logger.info(`Researching hidden gems and local favorites...`);

try {
  const prompt = HIDDEN_GEMS_PROMPT.replace('{city}', `${city.name}, ${city.state}`);
  
  const response = await anthropic.messages.create({
    model: config.claudeModel,
    max_tokens: 4096,
    temperature: 0.8, // Higher for more creative suggestions
    system: "You are a local expert who knows hidden gems and unique spots that locals love. Always return only valid JSON.",
    messages: [{ role: "user", content: prompt }]
  });

  const rawResponse = response.content[0].type === 'text' ? response.content[0].text : '';
  const claudePlaces = parseClaudeResponse(rawResponse, 'spring');
  
  // Tag as year-round and hidden gems
  const places = claudePlacesToPlaces(claudePlaces, city).map(p => ({
    ...p,
    bestSeason: ['winter', 'spring', 'summer', 'fall'] as Season[],
    tags: [...p.tags, 'hidden-gem', 'local-favorite']
  }));

  allPlaces.push(...places);
  logger.info(`Found ${places.length} hidden gems`);

} catch (error) {
  logger.warn(`Hidden gems research failed: ${error}`);
}
```

### 3. Update Expected Total

Change line ~236:
```typescript
if (allPlaces.length < 65) {
  logger.warn(`Only found ${allPlaces.length} places, expected ~72.`);
}
```

## Expected Results

**Before:** 60 places → 46 used, 6 generic fallbacks
**After:** ~72 places → 52 used, 0-3 generic fallbacks

**Benefits:**
- More authentic local character
- Variety beyond parks/museums  
- Fewer generic "Local splash pad" fallbacks
- Matches Omaha/Lincoln's use of unique spots

## Files to Modify

1. `src/agents/A2-researcher.ts` - Add prompt and research call

## Testing

Test with Des Moines and verify hidden gems appear (bakeries, cafes, studios, specialty shops).

