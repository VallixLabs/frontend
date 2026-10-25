export function mountTree(o: { section: HTMLElement; canvas: HTMLCanvasElement; overlay: HTMLElement }): {
  seek(u: number): void;
  unfreeze(): void;
  destroy(): void;
};
