/**
 * The team, as displayed on /team.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  EVERY ENTRY BELOW IS A PLACEHOLDER. Replace the names, roles and bios with
 *  the real ones before this page is published — inventing a biography for a
 *  real person is not something to leave to a default.
 *
 *  `photo` takes a path under `public/` (e.g. '/team/asha.jpg'). Leave it out
 *  and the card falls back to an initials monogram in the brand palette, which
 *  is a deliberate placeholder rather than a stock portrait.
 * ────────────────────────────────────────────────────────────────────────────
 */

export type Member = {
  name: string;
  role: string;
  group: 'Founders' | 'Research' | 'Advisors';
  bio: string;
  photo?: string;
  links?: { label: string; href?: string }[];
};

export const TEAM: Member[] = [
  {
    name: 'Founder name',
    role: 'Co-founder · Research',
    group: 'Founders',
    bio: 'Placeholder. Two or three sentences on what this person works on, what they built before, and why this problem. Keep it concrete — what they have actually done reads better than what they are interested in.',
    links: [{ label: 'Scholar' }, { label: 'LinkedIn' }],
  },
  {
    name: 'Co-founder name',
    role: 'Co-founder · Engineering',
    group: 'Founders',
    bio: 'Placeholder. Same shape as above. If the person has a paper, a system or a shipped product that matters to this work, name it rather than describing it in the abstract.',
    links: [{ label: 'GitHub' }, { label: 'LinkedIn' }],
  },
  {
    name: 'Researcher name',
    role: 'Research scientist',
    group: 'Research',
    bio: 'Placeholder. What part of the prior, the grammar or the evaluation this person owns.',
    links: [{ label: 'Scholar' }],
  },
  {
    name: 'Advisor name',
    role: 'Faculty advisor',
    group: 'Advisors',
    bio: 'Placeholder. Department and institution, and the connection to the work.',
    links: [{ label: 'Faculty page' }],
  },
];

export const GROUPS: Member['group'][] = ['Founders', 'Research', 'Advisors'];
