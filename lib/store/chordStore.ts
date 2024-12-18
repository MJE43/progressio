import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChordDefinition } from './../theory/types';
import { ChordParser } from './../theory/parser';

interface ChordState {
    chords: string[];
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
                    set((state) => ({
                        chords: [...state.chords, notation]
                    }));
                },

                removeChord: (index: number) => set((state) => ({
                    chords: state.chords.filter((_, i) => i !== index),
                    selectedChordIndex: null
                })),

                updateChord: (index: number, notation: string) => {
                    set((state) => ({
                        chords: state.chords.map((c, i) => 
                            i === index ? notation : c
                        )
                    }));
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
