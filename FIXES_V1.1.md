# WilderSeasons Generator - Fixes Applied (v1.1)

## Issues Identified in Des Moines Generation (v1.0)

### 🔴 Critical Issues Fixed

#### 1. Place Names Were Article Titles (FIXED ✅)
**Problem**: Getting "45 Places for Family Fun this Winter - Des Moines Parent" instead of "Des Moines Children's Museum"

**Root Cause**: Firecrawl returns search result titles, not actual place names

**Solution Implemented**:
- Added `extractPlaceName()` function with 16 skip patterns for generic articles
- Added `extractPlaceFromDescription()` to find actual place names in content
- Added `isGenericName()` validation to reject bad extractions
- Improved title cleaning to remove site names (Yelp, Facebook, Instagram, etc.)
- Now properly extracts real place names like "Living History Farms" or "Greater Des Moines Botanical Garden"

**Code Changes**: `src/agents/A2-researcher.ts` lines 146-241

---

#### 2. Massive Place Repetition (FIXED ✅)
**Problem**: Des Moines Children's Museum appeared 7+ times across weeks 40-46

**Root Cause**: Place assignment wasn't enforcing uniqueness

**Solution Implemented**:
- `usedPlaces` Set now properly prevents any place from being assigned twice
- Added `recentTypes` Map to track place types per week
- Modified `selectNextBestPlace()` to avoid same place type in last 3 weeks
- Ensures maximum variety across 52 weeks

**Code Changes**: `src/agents/A4-theme-mapper.ts` lines 5-77

---

#### 3. Seasonal Misalignment (FIXED ✅)
**Problem**: Apple orchards in summer (weeks 31-32), splash pads in winter

**Root Cause**: Generic season inference wasn't considering activity-specific seasonality

**Solution Implemented**:
- Added strong seasonal indicators:
  - Apple orchards/pumpkin patches = fall ONLY
  - Splash pads/water parks = summer ONLY
  - Ice skating/holiday lights = winter ONLY
- Parks/trails = spring/summer/fall (not winter)
- Indoor venues = year-round
- Better season tagging based on place name AND description

**Code Changes**: `src/agents/A2-researcher.ts` lines 286-318

---

#### 4. Song/Book Theme Mismatches (FIXED ✅)
**Problem**: 
- Week 7 "Kindness & Hearts" had "The Story of Snow" (should be love-themed)
- Week 52 "New Year's" had "The Roll-Away Pumpkin" (fall book)

**Root Cause**: Completely random selection from seasonal pools

**Solution Implemented**:
- Added `findThemedSong()` with 12 keyword-based matches
  - "love/heart/kindness" → "L-O-V-E"
  - "halloween/spooky" → "Monster Mash"
  - "christmas" → "The Christmas Song"
  - "new year/celebration" → "Celebration"
- Added `findThemedBook()` with 23 keyword-based matches
  - "love/heart/kindness" → "Guess How Much I Love You"
  - "snow" → "The Story of Snow"
  - "pumpkin" → "The Roll-Away Pumpkin"
  - "gratitude/thankful" → "We Are Grateful"
- Week title now passed to selection functions for intelligent matching
- Falls back to random if no theme match found

**Code Changes**: `src/constants/content-library.ts` lines 128-235

---

#### 5. Recipe Ingredient Missing Quantities (FIXED ✅)
**Problem**: Ingredients listed without quantities:
```
milk
cocoa powder
honey
```

**Root Cause**: Claude prompt didn't emphasize quantities strongly enough

**Solution Implemented**:
- Updated prompt with "CRITICAL: Include specific quantities for ALL ingredients!"
- Added explicit example showing proper format:
  ```
  2 cups milk
  1 tbsp honey
  ½ tsp cinnamon
  ```
- Added reminder in JSON output example
- Second emphasis: "REMEMBER: Ingredients MUST include specific quantities!"

**Code Changes**: `src/agents/A5-writer.ts` lines 161-206

---

#### 6. Better Search Queries (IMPROVED ✅)
**Problem**: Too generic, resulting in article lists instead of specific places

**Solution Implemented**:
- Replaced generic queries like "{city} indoor activities toddlers winter"
- With specific queries like "{city} children's museum", "{city} public library branches"
- Now searches for:
  - **Winter**: "children's museum", "science center", "art museum kids", "indoor pool recreation center"
  - **Spring**: "botanical garden", "arboretum", "nature center", "petting farm", "duck pond"
  - **Summer**: "splash pad locations", "zoo", "water park", "lake beach"
  - **Fall**: "pumpkin patch", "apple orchard", "corn maze", "hayride farm"
- 40 total queries (10 per season) focused on specific place types

**Code Changes**: `src/agents/A2-researcher.ts` lines 7-54

---

## Summary of Changes

### Files Modified:
1. `src/agents/A2-researcher.ts` - Place extraction, seasonal tagging, search queries
2. `src/agents/A4-theme-mapper.ts` - Uniqueness enforcement, type variety
3. `src/agents/A5-writer.ts` - Recipe ingredient prompting, song/book title passing
4. `src/constants/content-library.ts` - Theme-based song/book matching

### Expected Improvements in Next Generation:
✅ **Real place names**: "Living History Farms" not article titles  
✅ **No repetition**: Each of 52 places unique  
✅ **Seasonal accuracy**: Apple orchards only in fall weeks 40-52  
✅ **Better matches**: Valentine week gets love songs/books  
✅ **Proper recipes**: All ingredients with quantities (2 cups, 1 tbsp, etc.)  
✅ **Place variety**: Museums, parks, farms, libraries distributed evenly  

### Testing Recommendation:
Generate a new edition and compare:
```bash
npm run generate -- --city="Madison, Wisconsin"
```

Look for:
- Actual place names in week titles
- Zero duplicate places
- Apple orchards in fall (weeks 40-52 only)
- Themed song/book matches
- Recipe ingredients with quantities

---

**Version**: 1.1  
**Date**: October 19, 2025  
**Status**: Ready for testing

