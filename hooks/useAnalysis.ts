// /hooks/useAnalysis.ts

import { useCallback, useMemo } from 'react';
import { useProgressionStore, ProgressionState } from '@/lib/store/progression';
import { ProgressionPattern } from '@/lib/theory/types';

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
