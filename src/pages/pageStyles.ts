import { color } from '../theme';

/** The panel used throughout the standalone pages. */
export const panel: React.CSSProperties = {
  border: `1px solid ${color.rule}`,
  background: color.inkRaised,
  padding: 26,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};
