// /lib/hooks/useProgression.ts

import { useCallback, useMemo } from 'react';
import { useProgressionStore, type ProgressionState } from '@/lib/store/progression';
import { ChordDefinition, HarmonicFunction, ProgressionPattern } from '@/lib/theory/types';
import { ChordParser } from '@/lib/theory/parser';

export function useProgression() {
    const {
        chords,
        selectedChordIndex,
        addChord,
        removeChord,
        updateChord,
        moveChord,
        selectChord
    } = useProgressionStore(
        (state: ProgressionState) => ({
            chords: state.chords,
            selectedChordIndex: state.selectedChordIndex,
            addChord: state.addChord,
            removeChord: state.removeChord,
            updateChord: state.updateChord,
            moveChord: state.moveChord,
            selectChord: state.selectChord
        })
    );

    const currentChord = useMemo(() => 
        selectedChordIndex !== null ? chords[selectedChordIndex] : null,
        [chords, selectedChordIndex]
    );

    const handleAddChord = useCallback((notation: string) => {
        try {
            // Validate chord before adding
            ChordParser.parse(notation);
            addChord(notation);
            return true;
        } catch (error) {
            console.error('Invalid chord notation:', error);
            return false;
        }
    }, [addChord]);

    const handleUpdateChord = useCallback((index: number, notation: string) => {
        try {
            // Validate chord before updating
            ChordParser.parse(notation);
            updateChord(index, notation);
            return true;
        } catch (error) {
            console.error('Invalid chord notation:', error);
            return false;
        }
    }, [updateChord]);

    return {
        chords,
        currentChord,
        selectedChordIndex,
        addChord: handleAddChord,
        removeChord,
        updateChord: handleUpdateChord,
        moveChord,
        selectChord
    };
}


