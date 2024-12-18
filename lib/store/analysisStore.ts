import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChordDefinition, ProgressionPattern, Key, HarmonicFunction } from '@/lib/theory/types';
import { ChordAnalyzer } from '@/lib/theory/analyzer';
import { PatternDetector } from '@/lib/theory/patterns';
import { useChordStore } from './chordStore';

interface AnalysisState {
    currentKey: Key;
    harmonicFunctions: HarmonicFunction[];
    detectedPatterns: ProgressionPattern[];
    keyConfidence: number;

    // Actions
    reanalyze: () => void;
    detectKey: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
    devtools(
        (set) => ({
            currentKey: { root: 'C', mode: 'major' },
            harmonicFunctions: [],
            detectedPatterns: [],
            keyConfidence: 0,

            reanalyze: () => {
                const chords = useChordStore.getState().chords;
                const analyzer = new ChordAnalyzer();
                const detector = new PatternDetector();

                set((state) => {
                    const harmonicFunctions = analyzer.analyze(chords, state.currentKey);
                    const detectedPatterns = detector.findPatterns(chords);
                    return {
                        harmonicFunctions,
                        detectedPatterns
                    };
                });
            },

            detectKey: () => {
                const chords = useChordStore.getState().chords;
                const analyzer = new ChordAnalyzer();
                const { key, confidence } = analyzer.detectKey(chords);
                
                set({
                    currentKey: key,
                    keyConfidence: confidence
                });
            }
        })
    )
);
