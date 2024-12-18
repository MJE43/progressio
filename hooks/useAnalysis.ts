// /hooks/useAnalysis.ts

import { useCallback, useMemo } from 'react';
import { useAnalysisStore } from '@/lib/store/analysisStore';
import { useChordStore } from '@/lib/store/chordStore';
import { ProgressionPattern } from '@/lib/theory/types';

export function useAnalysis() {
    const {
        currentKey,
        harmonicFunctions,
        detectedPatterns,
        keyConfidence,
        detectKey,
        reanalyze
    } = useAnalysisStore();

    const selectedChordIndex = useChordStore((state) => state.selectedChordIndex);

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
