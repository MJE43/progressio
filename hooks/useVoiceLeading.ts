// /lib/hooks/useVoiceLeading.ts

import { ProgressionState, useProgressionStore } from '@/lib/store/progression';
import { ChordAnalyzer } from '@/lib/theory/analyzer';
import { VoiceLeadingConnection } from '@/lib/theory/types';
import { useMemo, useCallback } from 'react';

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
