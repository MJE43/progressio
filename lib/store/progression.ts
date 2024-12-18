// /lib/store/progression.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChordDefinition, ProgressionPattern, Key, HarmonicFunction } from '@/lib/theory/types';
import { ChordParser } from '@/lib/theory/parser';
import { ChordAnalyzer } from '@/lib/theory/analyzer';
import { PatternDetector } from '@/lib/theory/patterns';

export interface ProgressionState {
    // Core state
    chords: ChordDefinition[];
    currentKey: Key;
    selectedChordIndex: number | null;

    // Analysis results
    harmonicFunctions: HarmonicFunction[];
    detectedPatterns: ProgressionPattern[];
    keyConfidence: number;

    // History management
    history: {
        past: ChordDefinition[][];
        future: ChordDefinition[][];
    };

    // Actions
    addChord: (notation: string) => void;
    removeChord: (index: number) => void;
    updateChord: (index: number, notation: string) => void;
    moveChord: (fromIndex: number, toIndex: number) => void;
    selectChord: (index: number | null) => void;
    
    // History actions
    undo: () => void;
    redo: () => void;
    
    // Analysis actions
    reanalyze: () => void;
    detectKey: () => void;
}

export const useProgressionStore = create<ProgressionState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                chords: [],
                currentKey: { root: 'C', mode: 'major' },
                selectedChordIndex: null,
                harmonicFunctions: [],
                detectedPatterns: [],
                keyConfidence: 0,
                history: {
                    past: [],
                    future: []
                },

                // Core actions
                addChord: (notation: string) => {
                    try {
                        const chord = ChordParser.parse(notation);
                        set((state: ProgressionState) => {
                            // Save current state to history
                            const newPast = [...state.history.past, state.chords];
                            
                            // Add new chord
                            const newChords = [...state.chords, chord];
                            
                            // Perform analysis
                            const analysis = performAnalysis(state);
                            
                            return {
                                chords: newChords,
                                history: {
                                    past: newPast,
                                    future: [] // Clear redo stack
                                },
                                ...analysis
                            };
                        });
                    } catch (error) {
                        console.error('Failed to parse chord:', error);
                        // Add error handling when we implement the toast system
                    }
                },

                removeChord: (index: number) => set((state: ProgressionState) => {
                    // Save current state to history
                    const newPast = [...state.history.past, state.chords];
                    
                    // Remove chord
                    const newChords = state.chords.filter((_, i) => i !== index);
                    
                    // Perform analysis
                    const analysis = performAnalysis(state);
                    
                    return {
                        chords: newChords,
                        selectedChordIndex: null,
                        history: {
                            past: newPast,
                            future: [] // Clear redo stack
                        },
                        ...analysis
                    };
                }),

                updateChord: (index: number, notation: string) => {
                    try {
                        const chord = ChordParser.parse(notation);
                        set((state: ProgressionState) => {
                            // Save current state to history
                            const newPast = [...state.history.past, state.chords];
                            
                            // Update chord
                            const newChords = [...state.chords];
                            newChords[index] = chord;
                            
                            // Perform analysis
                            const analysis = performAnalysis(state);
                            
                            return {
                                chords: newChords,
                                history: {
                                    past: newPast,
                                    future: [] // Clear redo stack
                                },
                                ...analysis
                            };
                        });
                    } catch (error) {
                        console.error('Failed to parse chord:', error);
                    }
                },

                moveChord: (fromIndex: number, toIndex: number) => set((state: ProgressionState) => {
                    // Save current state to history
                    const newPast = [...state.history.past, state.chords];
                    
                    // Move chord
                    const newChords = [...state.chords];
                    const [movedChord] = newChords.splice(fromIndex, 1);
                    newChords.splice(toIndex, 0, movedChord);
                    
                    // Perform analysis
                    const analysis = performAnalysis(state);
                    
                    return {
                        chords: newChords,
                        selectedChordIndex: toIndex,
                        history: {
                            past: newPast,
                            future: [] // Clear redo stack
                        },
                        ...analysis
                    };
                }),

                selectChord: (index: number | null) => set((state: ProgressionState) => ({
                    selectedChordIndex: index
                })),

                // History actions
                undo: () => set((state: ProgressionState) => {
                    const { past, future } = state.history;
                    if (past.length === 0) return state;

                    const newPast = [...past];
                    const previousChords = newPast.pop()!;
                    
                    // Perform analysis
                    const analysis = performAnalysis(state);
                    
                    return {
                        chords: previousChords,
                        history: {
                            past: newPast,
                            future: [state.chords, ...future]
                        },
                        selectedChordIndex: null,
                        ...analysis
                    };
                }),

                redo: () => set((state: ProgressionState) => {
                    const { past, future } = state.history;
                    if (future.length === 0) return state;

                    const newFuture = [...future];
                    const nextChords = newFuture.shift()!;
                    
                    // Perform analysis
                    const analysis = performAnalysis(state);
                    
                    return {
                        chords: nextChords,
                        history: {
                            past: [...past, state.chords],
                            future: newFuture
                        },
                        selectedChordIndex: null,
                        ...analysis
                    };
                }),

                // Analysis actions
                reanalyze: () => set((state: ProgressionState) => {
                    const analysis = performAnalysis(state);
                    return {
                        ...analysis
                    };
                }),

                detectKey: () => set((state: ProgressionState) => {
                    const { key, confidence } = PatternDetector.detectKey(state.chords);
                    
                    // Perform analysis with new key
                    const analysis = performAnalysis(state);
                    
                    return {
                        currentKey: key,
                        keyConfidence: confidence,
                        ...analysis
                    };
                })
            }),
            {
                name: 'progression-storage'
            }
        )
    )
);

// Helper function to perform all analysis
function performAnalysis(state: ProgressionState) {
    if (state.chords.length === 0) {
        return {
            harmonicFunctions: [],
            detectedPatterns: []
        };
    }

    const harmonicFunctions = state.chords.map(chord => 
        ChordAnalyzer.analyzeFunction(chord, state.currentKey)
    );

    const detectedPatterns = PatternDetector.detectPatterns(state.chords, state.currentKey);

    return {
        harmonicFunctions,
        detectedPatterns
    };
}

// Selectors
export const selectChordAt = (index: number) => 
    (state: ProgressionState) => state.chords[index];

export const selectHarmonicFunctionAt = (index: number) =>
    (state: ProgressionState) => state.harmonicFunctions[index];

export const selectPatternsContainingIndex = (index: number) =>
    (state: ProgressionState) => state.detectedPatterns.filter(pattern =>
        index >= pattern.startIndex && 
        index < pattern.startIndex + pattern.length
    );

export const selectCanUndo = (state: ProgressionState) =>
    state.history.past.length > 0;

export const selectCanRedo = (state: ProgressionState) =>
    state.history.future.length > 0;
