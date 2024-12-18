import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChordDefinition } from '@/lib/theory/types';
import { useChordStore } from './chordStore';

interface HistoryState {
    past: ChordDefinition[][];
    future: ChordDefinition[][];

    // Actions
    pushState: () => void;
    undo: () => void;
    redo: () => void;
}

export const useHistoryStore = create<HistoryState>()(
    devtools(
        (set, get) => ({
            past: [],
            future: [],

            pushState: () => {
                const currentChords = useChordStore.getState().chords;
                set((state) => ({
                    past: [...state.past, currentChords],
                    future: [] // Clear redo stack
                }));
            },

            undo: () => {
                const { past, future } = get();
                if (past.length === 0) return;

                const currentChords = useChordStore.getState().chords;
                const newPast = [...past];
                const previousState = newPast.pop()!;

                set({
                    past: newPast,
                    future: [currentChords, ...future]
                });

                useChordStore.setState({ chords: previousState });
            },

            redo: () => {
                const { past, future } = get();
                if (future.length === 0) return;

                const currentChords = useChordStore.getState().chords;
                const newFuture = [...future];
                const nextState = newFuture.shift()!;

                set({
                    past: [...past, currentChords],
                    future: newFuture
                });

                useChordStore.setState({ chords: nextState });
            }
        })
    )
);
