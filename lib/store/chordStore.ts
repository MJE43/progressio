import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChordDefinition } from '@/lib/theory/types';
import { ChordParser } from '@/lib/theory/parser';

interface ChordState {
    chords: ChordDefinition[];
    selectedChordIndex: number | null;
    
    // Actions
    addChord: (notation: string) => void;
    removeChord: (index: number) => void;
    updateChord: (index: number, notation: string) => void;
    moveChord: (fromIndex: number, toIndex: number) => void;
    selectChord: (index: number | null) => void;
}

export const useChordStore = create<ChordState>()(
    devtools(
        persist(
            (set) => ({
                chords: [],
                selectedChordIndex: null,

                addChord: (notation: string) => {
                    try {
                        const chord = ChordParser.parse(notation);
                        set((state) => ({
                            chords: [...state.chords, chord]
                        }));
                    } catch (error) {
                        console.error('Failed to parse chord:', error);
                    }
                },

                removeChord: (index: number) => set((state) => ({
                    chords: state.chords.filter((_, i) => i !== index),
                    selectedChordIndex: null
                })),

                updateChord: (index: number, notation: string) => {
                    try {
                        const chord = ChordParser.parse(notation);
                        set((state) => ({
                            chords: state.chords.map((c, i) => 
                                i === index ? chord : c
                            )
                        }));
                    } catch (error) {
                        console.error('Failed to parse chord:', error);
                    }
                },

                moveChord: (fromIndex: number, toIndex: number) => set((state) => {
                    const newChords = [...state.chords];
                    const [movedChord] = newChords.splice(fromIndex, 1);
                    newChords.splice(toIndex, 0, movedChord);
                    return { chords: newChords };
                }),

                selectChord: (index: number | null) => set({
                    selectedChordIndex: index
                })
            }),
            {
                name: 'chord-storage'
            }
        )
    )
);
