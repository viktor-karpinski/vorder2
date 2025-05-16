import {
  rectSortingStrategy,
  defaultAnimateLayoutChanges,
  MeasuringStrategy,
} from "@dnd-kit/sortable";

/**
 * Wraps the default strategy but allows larger dragged items to push
 * other items by their full height
 */
export function variableHeightSortingStrategy(args) {
  return rectSortingStrategy({
    ...args,
    animateLayoutChanges: defaultAnimateLayoutChanges,
    layoutMeasuring: {
      strategy: MeasuringStrategy.Always,
    },
  });
}
