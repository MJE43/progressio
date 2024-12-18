import { useHistoryStore } from "@/lib/store/historyStore";

export function useHistory() {
    const {
        past,
        future,
        undo,
        redo
    } = useHistoryStore();

    return {
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        undo,
        redo
    };
}
