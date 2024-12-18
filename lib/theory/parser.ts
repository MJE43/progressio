import {
  Note, ChordDefinition, ChordQuality, ChordExtension,
  ChordAlteration, NOTES, ENHARMONIC_EQUIVALENTS
} from './types';

export class ChordParser {
  private static CHORD_REGEX = /^([A-G][b#]?)(?:(maj|min|m|dim|aug|sus[24])?(\d+)?(?:add\d+)?(?:[b#][59]|[b#]11)?)?(?:\/([A-G][b#]?))?$/;

  /**
   * Parse a chord notation string into a ChordDefinition
   * @param notation - The chord notation to parse (e.g., "Cmaj7", "Dm/F")
   * @returns ChordDefinition object representing the chord
   * @throws Error if the chord notation is invalid
   */
  static parse(notation: string): ChordDefinition {
      const match = notation.match(this.CHORD_REGEX);
      if (!match) {
          throw new Error(`Invalid chord notation: ${notation}`);
      }

      const [_, rootNote, qualityStr, extensionStr, bassNote] = match;

      // Validate and normalize root note
      const root = this.normalizeNote(rootNote);
      if (!root) {
          throw new Error(`Invalid root note: ${rootNote}`);
      }

      // Parse quality
      const quality = this.parseQuality(qualityStr);

      // Parse extensions
      const extensions = this.parseExtensions(extensionStr);

      // Parse alterations (if any)
      const alterations = this.parseAlterations(notation);

      // Parse bass note for slash chords
      const bass = bassNote ? this.normalizeNote(bassNote) : undefined;

      return {
          root,
          quality,
          extensions: extensions.length > 0 ? extensions : undefined,
          alterations: alterations.length > 0 ? alterations : undefined,
          bass,
          originalNotation: notation
      };
  }

  /**
   * Convert a chord definition back to its string notation
   * @param chord - The ChordDefinition to convert
   * @returns String representation of the chord
   */
  static toString(chord: ChordDefinition): string {
      let result = chord.root;

      // Add quality
      switch (chord.quality) {
          case 'minor':
              result += 'm';
              break;
          case 'diminished':
              result += 'dim';
              break;
          case 'augmented':
              result += 'aug';
              break;
          case 'suspended-2':
              result += 'sus2';
              break;
          case 'suspended-4':
              result += 'sus4';
              break;
          case 'half-diminished':
              result += 'ø';
              break;
          // major is implicit
      }

      // Add extensions
      if (chord.extensions) {
          chord.extensions.forEach(ext => {
              result += ext;
          });
      }

      // Add alterations
      if (chord.alterations) {
          chord.alterations.forEach(alt => {
              result += alt;
          });
      }

      // Add bass note for slash chords
      if (chord.bass) {
          result += '/' + chord.bass;
      }

      return result;
  }

  private static normalizeNote(note: string): Note {
      // Handle enharmonic equivalents
      const normalized = note as Note;
      if (NOTES.includes(normalized) || Object.keys(ENHARMONIC_EQUIVALENTS).includes(normalized)) {
          return normalized;
      }
      throw new Error(`Invalid note: ${note}`);
  }

  private static parseQuality(quality: string | undefined): ChordQuality {
      if (!quality) return 'major';
      
      switch (quality.toLowerCase()) {
          case 'm':
          case 'min':
              return 'minor';
          case 'dim':
              return 'diminished';
          case 'aug':
              return 'augmented';
          case 'sus2':
              return 'suspended-2';
          case 'sus4':
              return 'suspended-4';
          default:
              return 'major';
      }
  }

  private static parseExtensions(extension: string | undefined): ChordExtension[] {
      if (!extension) return [];
      
      const extensions: ChordExtension[] = [];
      
      // Handle basic extensions
      if (extension.match(/^(7|9|11|13)$/)) {
          extensions.push(extension as ChordExtension);
      }
      
      // Handle major 7
      if (extension === 'maj7') {
          extensions.push('maj7');
      }
      
      return extensions;
  }

  private static parseAlterations(notation: string): ChordAlteration[] {
      const alterations: ChordAlteration[] = [];
      
      // Check for flat 5
      if (notation.includes('b5')) alterations.push('b5');
      
      // Check for sharp 5
      if (notation.includes('#5')) alterations.push('#5');
      
      // Check for flat 9
      if (notation.includes('b9')) alterations.push('b9');
      
      // Check for sharp 9
      if (notation.includes('#9')) alterations.push('#9');
      
      // Check for sharp 11
      if (notation.includes('#11')) alterations.push('#11');
      
      // Check for flat 13
      if (notation.includes('b13')) alterations.push('b13');
      
      return alterations;
  }
}
