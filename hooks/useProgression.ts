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

// /lib/hooks/useAnalysis.ts

export function useAnalysis() {
    const {
        currentKey,
        harmonicFunctions,
        detectedPatterns,
        keyConfidence,
        detectKey,
        reanalyze,
        selectedChordIndex
    } = useProgressionStore((state: ProgressionState) => ({
        currentKey: state.currentKey,
        harmonicFunctions: state.harmonicFunctions,
        detectedPatterns: state.detectedPatterns,
        keyConfidence: state.keyConfidence,
        detectKey: state.detectKey,
        reanalyze: state.reanalyze,
        selectedChordIndex: state.selectedChordIndex
    }));

    const analysisForChord = useCallback((index: number) => {
        return {
            harmonicFunction: harmonicFunctions[index],
            patterns: detectedPatterns.filter(pattern => {
                const endIndex = pattern.startIndex + pattern.length - 1;
                return index >= pattern.startIndex && index <= endIndex;
            })
        };
    }, [harmonicFunctions, detectedPatterns]);

    const matchingPatterns = useMemo(() => {
        if (selectedChordIndex === null) return [];
        return detectedPatterns.filter((pattern: ProgressionPattern) => {
            const endIndex = pattern.startIndex + pattern.length - 1;
            return selectedChordIndex >= pattern.startIndex && selectedChordIndex <= endIndex;
        });
    }, [detectedPatterns, selectedChordIndex]);

    return {
        currentKey,
        keyConfidence,
        harmonicFunctions,
        detectedPatterns,
        analysisForChord,
        matchingPatterns,
        detectKey,
        reanalyze
    };
}

// /lib/hooks/useHistory.ts

export function useHistory() {
    const {
        canUndo,
        canRedo,
        undo,
        redo
    } = useProgressionStore(
        (state: ProgressionState) => ({
            canUndo: state.history.past.length > 0,
            canRedo: state.history.future.length > 0,
            undo: state.undo,
            redo: state.redo
        })
    );

    return {
        canUndo,
        canRedo,
        undo,
        redo
    };
}

// /lib/hooks/useVoiceLeading.ts

import { ChordAnalyzer } from '@/lib/theory/analyzer';
import { VoiceLeadingConnection } from '@/lib/theory/types';

export function useVoiceLeading() {
    const chords = useProgressionStore((state: ProgressionState) => state.chords);

    const connections = useMemo(() => {
        const result: VoiceLeadingConnection[] = [];
        
        for (let i = 0; i < chords.length - 1; i++) {
            result.push(
                ChordAnalyzer.analyzeVoiceLeading(chords[i], chords[i + 1])
            );
        }
        
        return result;
    }, [chords]);

    const getConnection = useCallback((fromIndex: number) => {
        if (fromIndex < 0 || fromIndex >= connections.length) return null;
        return connections[fromIndex];
    }, [connections]);

    const getSmoothnessScore = useCallback((fromIndex: number) => {
        const connection = getConnection(fromIndex);
        return connection ? connection.smoothness : null;
    }, [getConnection]);

    const getParallelMotions = useCallback((fromIndex: number) => {
        const connection = getConnection(fromIndex);
        return connection?.parallelMotion || [];
    }, [getConnection]);

    return {
        connections,
        getConnection,
        getSmoothnessScore,
        getParallelMotions
    };
}
