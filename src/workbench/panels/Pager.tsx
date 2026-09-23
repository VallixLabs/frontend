import { mono, wb } from '../theme';

const Btn = ({ on, label, glyph }: { on: (() => void) | null; label: string; glyph: string }) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    disabled={!on}
    onClick={() => on?.()}
    style={{
      all: 'unset', cursor: on ? 'pointer' : 'default',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 26, height: 24, fontFamily: mono, fontSize: 13,
      color: on ? wb.muted : wb.ghost,
      background: on ? 'rgba(255,255,255,0.05)' : 'transparent',
    }}
  >
    {glyph}
  </button>
);

/** The shared footer control for both paged tables. */
export function Pager({
  from, to, total, pageNo, pages, canPrev, canNext, first, prev, next, last, loading, children,
}: {
  from: number; to: number; total: number; pageNo: number; pages: number;
  canPrev: boolean; canNext: boolean;
  first: () => void; prev: () => void; next: () => void; last: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderTop: `1px solid ${wb.line}` }}>
      <span style={{ fontFamily: mono, fontSize: 11, color: wb.faint, whiteSpace: 'nowrap' }}>
        {loading ? 'loading…' : total === 0 ? 'no rows' : `${from}–${to} of ${total}`}
      </span>
      <span style={{ flex: 1 }} />
      {children}
      <span style={{ fontFamily: mono, fontSize: 11, color: wb.dim, whiteSpace: 'nowrap' }}>
        {pageNo} / {pages}
      </span>
      <div style={{ display: 'flex', gap: 2 }}>
        <Btn on={canPrev ? first : null} label="First page" glyph="«" />
        <Btn on={canPrev ? prev : null} label="Previous page" glyph="‹" />
        <Btn on={canNext ? next : null} label="Next page" glyph="›" />
        <Btn on={canNext ? last : null} label="Last page" glyph="»" />
      </div>
    </div>
  );
}
