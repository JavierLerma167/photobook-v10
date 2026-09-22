import { Project } from '@/src/types';

export interface HistoryState {
  past: Project[];
  present: Project;
  future: Project[];
}

export function pushHistory(state: HistoryState, next: Project): HistoryState {
  return {
    past: [...state.past.slice(-49), state.present],
    present: next,
    future: []
  };
}

export function undo(state: HistoryState): HistoryState {
  if (state.past.length === 0) return state;
  const previous = state.past[state.past.length - 1];
  return {
    past: state.past.slice(0, -1),
    present: previous,
    future: [state.present, ...state.future]
  };
}

export function redo(state: HistoryState): HistoryState {
  if (state.future.length === 0) return state;
  const next = state.future[0];
  return {
    past: [...state.past, state.present],
    present: next,
    future: state.future.slice(1)
  };
}
