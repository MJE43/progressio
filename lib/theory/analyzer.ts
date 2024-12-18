// /lib/theory/analyzer.ts

import { 
  ChordDefinition, Note, HarmonicFunction, Key, Scale, VoiceLeadingConnection,
  NOTES, SCALE_PATTERNS, CHORD_QUALITIES, CHORD_EXTENSIONS, ENHARMONIC_EQUIVALENTS
} from './types';

export class ChordAnalyzer {
  /**
   * Analyze the harmonic function of a chord within a given key
   * @param chord - The chord to analyze
   * @param key - The key context
   * @returns The harmonic function of the chord
   */
  static analyzeFunction(chord: ChordDefinition, key: Key): HarmonicFunction {
      // Get scale degrees for the key
      const scale = this.generateScale(key.root, key.mode);
      
      // Find root position in scale
      const rootIndex = this.findScaleDegree(chord.root, scale);
      
      // Determine primary function
      const primary = this.determinePrimaryFunction(rootIndex, chord.quality, key.mode);
      
      // Determine secondary characteristics
      const secondary = this.determineSecondaryFunction(rootIndex, chord.quality, key.mode);
      
      return {
          primary,
          secondary,
          relativeScale: rootIndex + 1, // Convert to 1-based scale degree
          tonicization: this.detectTonicization(chord, key)
      };
  }

  /**
   * Generate notes for a given chord including extensions
   * @param chord - The chord definition
   * @returns Array of notes in the chord
   */
  static generateChordNotes(chord: ChordDefinition): Note[] {
      const rootIndex = NOTES.indexOf(chord.root);
      const notes: Note[] = [];

      // Add basic triad notes
      const triadIntervals = CHORD_QUALITIES[chord.quality];
      notes.push(...triadIntervals.map(interval => {
          const noteIndex = (rootIndex + interval) % 12;
          return NOTES[noteIndex];
      }));

      // Add extension notes
      if (chord.extensions) {
          chord.extensions.forEach(extension => {
              const extensionIntervals = CHORD_EXTENSIONS[extension];
              extensionIntervals.forEach(interval => {
                  const noteIndex = (rootIndex + interval) % 12;
                  notes.push(NOTES[noteIndex]);
              });
          });
      }

      // Add alterations
      if (chord.alterations) {
          chord.alterations.forEach(alteration => {
              const alterationNote = this.calculateAlteration(chord.root, alteration);
              if (alterationNote) notes.push(alterationNote);
          });
      }

      // Handle slash chords
      if (chord.bass && chord.bass !== chord.root) {
          notes.unshift(chord.bass);
      }

      // Remove duplicates while preserving order
      return Array.from(new Set(notes));
  }

  /**
   * Analyze voice leading between two chords
   * @param fromChord - The first chord
   * @param toChord - The second chord
   * @returns Voice leading analysis
   */
  static analyzeVoiceLeading(fromChord: ChordDefinition, toChord: ChordDefinition): VoiceLeadingConnection {
      const fromNotes = this.generateChordNotes(fromChord);
      const toNotes = this.generateChordNotes(toChord);

      // Calculate voice leading smoothness
      const smoothness = this.calculateVoiceLeadingSmoothness(fromNotes, toNotes);

      // Detect parallel motion issues
      const parallelMotion = this.detectParallelMotion(fromNotes, toNotes);

      return {
          from: fromNotes,
          to: toNotes,
          smoothness,
          parallelMotion: parallelMotion && parallelMotion.length > 0 ? parallelMotion : undefined
      };
  }

  /**
   * Generate a scale from a root note and mode
   * @param root - The root note of the scale
   * @param mode - The mode (major or minor)
   * @returns Array of notes in the scale
   */
  static generateScale(root: Note, mode: 'major' | 'minor'): Note[] {
      const pattern = SCALE_PATTERNS[mode];
      const rootIndex = NOTES.indexOf(root);
      
      return pattern.map(interval => {
          const noteIndex = (rootIndex + interval) % 12;
          return NOTES[noteIndex];
      });
  }

  /**
   * Find the scale degree of a note within a scale
   * @param note - The note to find
   * @param scale - The scale to search in
   * @returns The scale degree (0-based)
   */
  private static findScaleDegree(note: Note, scale: Note[]): number {
      const index = scale.findIndex(scaleNote => 
          ENHARMONIC_EQUIVALENTS[scaleNote].includes(note) ||
          ENHARMONIC_EQUIVALENTS[note].includes(scaleNote)
      );
      return index === -1 ? 0 : index; // Default to tonic if not found
  }

  /**
   * Determine the primary harmonic function of a chord
   */
  private static determinePrimaryFunction(
      scaleDegree: number,
      quality: ChordDefinition['quality'],
      mode: Key['mode']
  ): HarmonicFunction['primary'] {
      if (mode === 'major') {
          switch (scaleDegree) {
              case 0: // I
              case 5: // VI
                  return 'tonic';
              case 3: // IV
              case 1: // II
                  return 'subdominant';
              case 4: // V
              case 6: // VII
                  return 'dominant';
              default:
                  return 'tonic';
          }
      } else { // minor
          switch (scaleDegree) {
              case 0: // i
              case 5: // vi
                  return 'tonic';
              case 3: // iv
              case 1: // ii
                  return 'subdominant';
              case 4: // V
              case 6: // vii
                  return 'dominant';
              default:
                  return 'tonic';
          }
      }
  }

  /**
   * Determine any secondary function characteristics
   */
  private static determineSecondaryFunction(
      scaleDegree: number,
      quality: ChordDefinition['quality'],
      mode: Key['mode']
  ): HarmonicFunction['secondary'] | undefined {
      // Predominant chords
      if ((scaleDegree === 1 || scaleDegree === 3) && 
          (quality === 'minor' || quality === 'half-diminished')) {
          return 'predominant';
      }

      // Cadential chords
      if (scaleDegree === 4 && quality === 'major') {
          return 'cadential';
      }

      // Passing chords
      if (quality === 'diminished' || quality === 'augmented') {
          return 'passing';
      }

      return undefined;
  }

  /**
   * Detect if a chord is tonicizing a different key
   */
  private static detectTonicization(chord: ChordDefinition, currentKey: Key): Note | undefined {
      // Check for secondary dominants
      if (chord.quality === 'major' && chord.extensions?.includes('7')) {
          const potentialTonicization = this.calculateFifthBelow(chord.root);
          if (potentialTonicization !== currentKey.root) {
              return potentialTonicization;
          }
      }
      return undefined;
  }

  /**
   * Calculate voice leading smoothness between two sets of notes
   * Returns a value between 0 (rough) and 1 (smooth)
   */
  private static calculateVoiceLeadingSmoothness(fromNotes: Note[], toNotes: Note[]): number {
      let totalDistance = 0;
      const maxDistance = 12; // Maximum semitone distance we consider
      const comparisons = Math.min(fromNotes.length, toNotes.length);

      for (let i = 0; i < comparisons; i++) {
          const fromIndex = NOTES.indexOf(fromNotes[i]);
          const toIndex = NOTES.indexOf(toNotes[i]);
          const distance = Math.min(
              Math.abs(fromIndex - toIndex),
              12 - Math.abs(fromIndex - toIndex)
          );
          totalDistance += distance;
      }

      // Calculate smoothness where 0 is the maximum possible distance
      // and 1 is when all notes move by step or less
      const maxPossibleDistance = comparisons * maxDistance;
      return 1 - (totalDistance / maxPossibleDistance);
  }

  /**
   * Detect parallel fifths and octaves between two chords
   */
  private static detectParallelMotion(fromNotes: Note[], toNotes: Note[]): VoiceLeadingConnection['parallelMotion'] {
      const parallelMotions: { type: 'parallel-fifths' | 'parallel-octaves'; voices: [number, number]; }[] = [];

      // Check all pairs of voices for parallel motion
      for (let i = 0; i < fromNotes.length - 1; i++) {
          for (let j = i + 1; j < fromNotes.length; j++) {
              const interval1 = this.calculateInterval(fromNotes[i], fromNotes[j]);
              const interval2 = this.calculateInterval(toNotes[i], toNotes[j]);

              if (interval1 === interval2) {
                  if (interval1 === 7) { // Perfect fifth
                      parallelMotions.push({
                          type: 'parallel-fifths',
                          voices: [i, j] as [number, number]
                      });
                  } else if (interval1 === 12) { // Octave
                      parallelMotions.push({
                          type: 'parallel-octaves',
                          voices: [i, j] as [number, number]
                      });
                  }
              }
          }
      }

      return parallelMotions;
  }

  /**
   * Calculate the interval between two notes in semitones
   */
  private static calculateInterval(note1: Note, note2: Note): number {
      const index1 = NOTES.indexOf(note1);
      const index2 = NOTES.indexOf(note2);
      return Math.abs((index2 - index1 + 12) % 12);
  }

  /**
   * Calculate a note alteration given a root note and alteration type
   */
  private static calculateAlteration(root: Note, alteration: string): Note | undefined {
      const rootIndex = NOTES.indexOf(root);
      let interval: number;

      switch (alteration) {
          case 'b5':
              interval = 6;
              break;
          case '#5':
              interval = 8;
              break;
          case 'b9':
              interval = 13;
              break;
          case '#9':
              interval = 15;
              break;
          case '#11':
              interval = 18;
              break;
          case 'b13':
              interval = 20;
              break;
          default:
              return undefined;
      }

      const noteIndex = (rootIndex + interval) % 12;
      return NOTES[noteIndex];
  }

  /**
   * Calculate the perfect fifth below a given note
   */
  private static calculateFifthBelow(note: Note): Note {
      const noteIndex = NOTES.indexOf(note);
      return NOTES[(noteIndex - 7 + 12) % 12];
  }
}
