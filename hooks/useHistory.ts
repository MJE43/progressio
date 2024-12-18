import { useProgressionStore, ProgressionState } from "@/lib/store/progression";

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
