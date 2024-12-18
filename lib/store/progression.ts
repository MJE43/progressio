// /lib/store/progression.ts
// This file is deprecated and will be removed.
// Please use the following stores instead:
// - chordStore.ts: For managing chord data and selection
// - analysisStore.ts: For managing analysis state and key detection
// - historyStore.ts: For managing undo/redo functionality

import { useChordStore } from './chordStore';
import { useAnalysisStore } from './analysisStore';
import { useHistoryStore } from './historyStore';

// Re-export the stores for backward compatibility
export { useChordStore, useAnalysisStore, useHistoryStore };

// Types re-exported for convenience
export type { 
    ChordDefinition,
    ProgressionPattern,
    Key,
    HarmonicFunction
} from '@/lib/theory/types';
