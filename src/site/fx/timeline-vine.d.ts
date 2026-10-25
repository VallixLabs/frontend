export type Milestone = {
  p: 'main' | 'tvarit' | 'left'; x: number; y: number; date: string; text: string;
  kind: string; host: string; href: string; img: string;
  d: [number, number, 'c' | 'l' | 'r']; t: [number, number, 'c' | 'l' | 'r']; w: number;
};
export function mountTimeline(o: {
  svg: SVGSVGElement; stage: HTMLElement; track: HTMLElement; now: HTMLElement | null; hint: HTMLElement | null;
  milestones: Milestone[]; onNodeOff?: (i: number) => void;
}): () => void;
