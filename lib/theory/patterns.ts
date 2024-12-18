// /lib/theory/patterns.ts

import { 
  ChordDefinition, Note, Key, HarmonicFunction,
  NOTES, SCALE_PATTERNS, CHORD_QUALITIES
} from './types';
import { ChordAnalyzer } from './analyzer';

export interface ProgressionPattern {
  type: PatternType;
  startIndex: number;
  length: number;
  confidence: number;  // 0-1 score of how strongly this matches the pattern
  description: string;
}

export type PatternType = 
  | 'ii-V-I'
  | 'I-V-vi-IV'
  | 'I-IV-V'
  | 'circle-of-fifths'
  | 'descending-fifths'
  | 'modal-mixture'
  | 'chromatic-mediant'
  | 'deceptive-cadence'
  | 'plagal-cadence'
  | 'perfect-cadence';

interface PatternDefinition {
  romanNumerals: string[];
  qualities?: ChordDefinition['quality'][];
  description: string;
}

const COMMON_PATTERNS: Record<PatternType, PatternDefinition> = {
  'ii-V-I': {
      romanNumerals: ['ii', 'V', 'I'],
      qualities: ['minor', 'major', 'major'],
      description: 'Common jazz progression resolving to tonic'
  },
  'I-V-vi-IV': {
      romanNumerals: ['I', 'V', 'vi', 'IV'],
      qualities: ['major', 'major', 'minor', 'major'],
      description: 'Popular progression in contemporary music'
  },
  'I-IV-V': {
      romanNumerals: ['I', 'IV', 'V'],
      qualities: ['major', 'major', 'major'],
      description: 'Basic progression fundamental to Western harmony'
  },
  'circle-of-fifths': {
      romanNumerals: ['vi', 'ii', 'V', 'I'],
      qualities: ['minor', 'minor', 'major', 'major'],
      description: 'Progression following the circle of fifths'
  },
  'descending-fifths': {
      romanNumerals: ['V', 'IV', 'iii', 'ii', 'I'],
      description: 'Sequential progression by descending fifths'
  },
  'modal-mixture': {
      romanNumerals: ['I', 'bVI', 'bVII', 'I'],
      description: 'Progression using chords from parallel minor'
  },
  'chromatic-mediant': {
      romanNumerals: ['I', 'bIII', 'I'],
      description: 'Progression using chromatic mediant relationships'
  },
  'deceptive-cadence': {
      romanNumerals: ['V', 'vi'],
      qualities: ['major', 'minor'],
      description: 'Dominant to submediant deceptive cadence'
  },
  'plagal-cadence': {
      romanNumerals: ['IV', 'I'],
      qualities: ['major', 'major'],
      description: 'Subdominant to tonic cadence'
  },
  'perfect-cadence': {
      romanNumerals: ['V', 'I'],
      qualities: ['major', 'major'],
      description: 'Dominant to tonic authentic cadence'
  }
};

export class PatternDetector {
  /**
   * Detect common patterns within a chord progression
   * @param chords - Array of chord definitions to analyze
   * @param key - The key context
   * @returns Array of detected patterns
   */
  static detectPatterns(chords: ChordDefinition[], key: Key): ProgressionPattern[] {
      const patterns: ProgressionPattern[] = [];
      
      // Try each pattern at each possible starting position
      for (let i = 0; i < chords.length; i++) {
          for (const [patternType, definition] of Object.entries(COMMON_PATTERNS)) {
              const match = this.matchPattern(
                  chords.slice(i),
                  patternType as PatternType,
                  definition,
                  key
              );
              
              if (match) {
                  patterns.push({
                      type: patternType as PatternType,
                      startIndex: i,
                      length: definition.romanNumerals.length,
                      confidence: match,
                      description: definition.description
                  });
              }
          }
      }

      // Sort by confidence and filter overlapping patterns
      return this.filterOverlappingPatterns(
          patterns.sort((a, b) => b.confidence - a.confidence)
      );
  }

  /**
   * Detect the most likely key of a chord progression
   * @param chords - Array of chord definitions to analyze
   * @returns Most likely key and confidence score
   */
  static detectKey(chords: ChordDefinition[]): { key: Key; confidence: number } {
      const scores = new Map<string, number>();
      
      // Try each possible key
      for (const root of NOTES) {
          for (const mode of ['major', 'minor'] as const) {
              const key: Key = { root, mode };
              let score = 0;
              
              // Analyze each chord's function in this key
              chords.forEach((chord, index) => {
                  score += this.scoreChordInKey(chord, key, index, chords.length);
              });
              
              scores.set(`${root}-${mode}`, score);
          }
      }
      
      // Find highest scoring key
      let maxScore = 0;
      let bestKey: Key = { root: 'C', mode: 'major' }; // Default
      
      scores.forEach((score, keyString) => {
          if (score > maxScore) {
              maxScore = score;
              const [root, mode] = keyString.split('-');
              bestKey = { 
                  root: root as Note, 
                  mode: mode as 'major' | 'minor' 
              };
          }
      });
      
      // Calculate confidence (normalize score)
      const confidence = maxScore / (chords.length * 2); // 2 is max score per chord
      
      return { key: bestKey, confidence };
  }

  /**
   * Match a specific pattern at a given position in the progression
   */
  private static matchPattern(
      chords: ChordDefinition[],
      patternType: PatternType,
      definition: PatternDefinition,
      key: Key
  ): number | null {
      if (chords.length < definition.romanNumerals.length) return null;
      
      let matchScore = 0;
      const patternChords = chords.slice(0, definition.romanNumerals.length);
      
      // Check each chord against the pattern
      for (let i = 0; i < definition.romanNumerals.length; i++) {
          const chord = patternChords[i];
          const expectedRomanNumeral = definition.romanNumerals[i];
          const expectedQuality = definition.qualities?.[i];
          
          // Check scale degree
          const function_ = ChordAnalyzer.analyzeFunction(chord, key);
          if (this.romanNumeralMatches(function_.relativeScale, expectedRomanNumeral)) {
              matchScore += 0.5;
          }
          
          // Check quality if specified
          if (expectedQuality && chord.quality === expectedQuality) {
              matchScore += 0.5;
          }
      }
      
      // Calculate final confidence score
      const maxScore = definition.romanNumerals.length * 
          (definition.qualities ? 1 : 0.5);
      const confidence = matchScore / maxScore;
      
      return confidence > 0.7 ? confidence : null;
  }

  /**
   * Score how well a chord fits in a potential key
   */
  private static scoreChordInKey(
      chord: ChordDefinition,
      key: Key,
      position: number,
      totalChords: number
  ): number {
      let score = 0;
      const function_ = ChordAnalyzer.analyzeFunction(chord, key);
      
      // Score based on harmonic function
      if (function_.primary === 'tonic') {
          score += position === totalChords - 1 ? 2 : 1; // Extra weight for final tonic
      } else if (function_.primary === 'dominant') {
          score += position === totalChords - 2 ? 1.5 : 1; // Extra weight for pre-final dominant
      } else {
          score += 0.5;
      }
      
      // Score based on chord quality matching scale degree
      if (this.chordQualityMatchesScaleDegree(chord.quality, function_.relativeScale, key.mode)) {
          score += 0.5;
      }
      
      return score;
  }

  /**
   * Check if a chord quality matches what we expect for a scale degree
   */
  private static chordQualityMatchesScaleDegree(
      quality: ChordDefinition['quality'],
      scaleDegree: number,
      mode: Key['mode']
  ): boolean {
      if (mode === 'major') {
          switch (scaleDegree) {
              case 1:
              case 4:
              case 5:
                  return quality === 'major';
              case 2:
              case 3:
              case 6:
                  return quality === 'minor';
              case 7:
                  return quality === 'diminished';
          }
      } else { // minor
          switch (scaleDegree) {
              case 1:
                  return quality === 'minor';
              case 3:
              case 6:
              case 7:
                  return quality === 'major';
              case 2:
              case 4:
                  return quality === 'minor';
              case 5:
                  return quality === 'diminished';
          }
      }
      return false;
  }

  /**
   * Check if a scale degree matches a roman numeral
   */
  private static romanNumeralMatches(
      scaleDegree: number,
      romanNumeral: string
  ): boolean {
      const degreeMap: Record<string, number> = {
          'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7,
          'i': 1, 'ii': 2, 'iii': 3, 'iv': 4, 'v': 5, 'vi': 6, 'vii': 7,
          'bII': 2, 'bIII': 3, 'bVI': 6, 'bVII': 7
      };
      
      return degreeMap[romanNumeral] === scaleDegree;
  }

  /**
   * Filter out overlapping patterns, keeping the highest confidence ones
   */
  private static filterOverlappingPatterns(
      patterns: ProgressionPattern[]
  ): ProgressionPattern[] {
      const filtered: ProgressionPattern[] = [];
      const usedIndices = new Set<number>();
      
      for (const pattern of patterns) {
          const indices = new Set(
              Array.from(
                  { length: pattern.length },
                  (_, i) => i + pattern.startIndex
              )
          );
          
          // Check if this pattern overlaps with any existing patterns
          const hasOverlap = Array.from(indices).some(i => usedIndices.has(i));
          
          if (!hasOverlap) {
              filtered.push(pattern);
              indices.forEach(i => usedIndices.add(i));
          }
      }
      
      return filtered;
  }
}
