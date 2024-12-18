export type Note = 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B';
export type NoteLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Accidental = '' | '#' | 'b' | '##' | 'bb';

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented' | 'half-diminished' | 'suspended-2' | 'suspended-4';
export type ChordExtension = '7' | 'maj7' | 'm7' | 'dim7' | '9' | 'maj9' | 'm9' | '11' | '13' | '6' | 'm6' | 'add9';
export type ChordAlteration = 'b5' | '#5' | 'b9' | '#9' | '#11' | 'b13';

export interface ChordDefinition {
    root: Note;
    quality: ChordQuality;
    extensions?: ChordExtension[];
    alterations?: ChordAlteration[];
    bass?: Note; // For inversions/slash chords
    originalNotation: string; // The original string used to create this chord
}

export type Scale = Note[];
export type ScaleType = 'major' | 'minor' | 'melodic-minor' | 'harmonic-minor' | 'diminished' | 'whole-tone' | 'pentatonic-major' | 'pentatonic-minor';

export type Key = {
    root: Note;
    mode: 'major' | 'minor';
};

export type HarmonicFunction = {
    primary: 'tonic' | 'subdominant' | 'dominant';
    secondary?: 'predominant' | 'passing' | 'cadential';
    relativeScale: number; // Scale degree in roman numerals (1-7)
    tonicization?: Note; // If this chord is tonicizing a different key
};

export interface VoiceLeadingConnection {
    from: Note[];
    to: Note[];
    smoothness: number; // 0-1 score of how smooth the voice leading is
    parallelMotion?: {
        type: 'parallel-fifths' | 'parallel-octaves';
        voices: [number, number]; // Indices of the voices moving in parallel
    }[];
}

export type { ProgressionPattern } from './patterns';

// /lib/theory/constants.ts
export const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const ENHARMONIC_EQUIVALENTS: Record<Note, Note[]> = {
    'C': ['C'],
    'C#': ['C#', 'Db'],
    'Db': ['C#', 'Db'],
    'D': ['D'],
    'D#': ['D#', 'Eb'],
    'Eb': ['D#', 'Eb'],
    'E': ['E'],
    'F': ['F'],
    'F#': ['F#', 'Gb'],
    'Gb': ['F#', 'Gb'],
    'G': ['G'],
    'G#': ['G#', 'Ab'],
    'Ab': ['G#', 'Ab'],
    'A': ['A'],
    'A#': ['A#', 'Bb'],
    'Bb': ['A#', 'Bb'],
    'B': ['B']
};

export const SCALE_PATTERNS: Record<ScaleType, number[]> = {
    'major': [0, 2, 4, 5, 7, 9, 11],
    'minor': [0, 2, 3, 5, 7, 8, 10],
    'melodic-minor': [0, 2, 3, 5, 7, 9, 11],
    'harmonic-minor': [0, 2, 3, 5, 7, 8, 11],
    'diminished': [0, 2, 3, 5, 6, 8, 9, 11],
    'whole-tone': [0, 2, 4, 6, 8, 10],
    'pentatonic-major': [0, 2, 4, 7, 9],
    'pentatonic-minor': [0, 3, 5, 7, 10]
};

export const CHORD_QUALITIES: Record<ChordQuality, number[]> = {
    'major': [0, 4, 7],
    'minor': [0, 3, 7],
    'diminished': [0, 3, 6],
    'augmented': [0, 4, 8],
    'half-diminished': [0, 3, 6, 10],
    'suspended-2': [0, 2, 7],
    'suspended-4': [0, 5, 7]
};

export const CHORD_EXTENSIONS: Record<ChordExtension, number[]> = {
    '7': [10],
    'maj7': [11],
    'm7': [10],
    'dim7': [9],
    '9': [10, 14],
    'maj9': [11, 14],
    'm9': [10, 14],
    '11': [10, 14, 17],
    '13': [10, 14, 17, 21],
    '6': [9],
    'm6': [9],
    'add9': [14]
};

export const CHORD_ALTERATIONS: Record<ChordAlteration, number[]> = {
    'b5': [6],
    '#5': [8],
    'b9': [13],
    '#9': [15],
    '#11': [18],
    'b13': [20]
};
