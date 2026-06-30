// ─────────────────────────────────────────────────────────────
// Dashboard Design System — single source of truth for the
// policy dashboard. Import T for colors/typography, S for the
// semantic state palette (ok / warn / danger / info).
// ─────────────────────────────────────────────────────────────

export const T = {
  // Brand
  navy: '#023448',
  navyDeep: '#012433',
  teal: '#00C58F',
  lime: '#BED600',

  // Ink / text
  ink: '#16242b',
  sub: '#5b6578',
  muted: '#9aa6ad',

  // Surfaces & lines
  bg: '#f3f5f6',
  card: '#ffffff',
  soft: '#f8fafb',
  line: '#eef0f1',
  lineStrong: '#e0e5e8',

  mono: "'Space Grotesk', monospace",
} as const;

// Semantic states — each has fg (text/icon), bg (chip background), and bd (border)
export const S = {
  ok:     { fg: '#00a878', bg: '#d6f5e8', bd: '#b6e8d4' },
  warn:   { fg: '#b45309', bg: '#fef3c7', bd: '#fde68a' },
  danger: { fg: '#c4452f', bg: '#fdecea', bd: '#f7c9c1' },
  info:   { fg: '#005b82', bg: '#e7eef5', bd: '#cdddea' },
  neutral:{ fg: '#5b6578', bg: '#f1f4f5', bd: '#e0e5e8' },
} as const;

export type StateKey = keyof typeof S;

// Map a policy status -> semantic state
export const policyStatusState: Record<string, StateKey> = {
  Active: 'ok',
  Renewal: 'warn',
  Pending: 'info',
  Expired: 'danger',
};

// Map a claim status -> semantic state
export const claimStatusState: Record<string, StateKey> = {
  Processing: 'warn',
  Approved: 'ok',
  Declined: 'danger',
};

// Per-category dashboard configuration: which the asset is called,
// the accent emphasis, and category-specific copy.
export const categoryConfig: Record<string, {
  assetLabel: string;       // what the insured thing is called
  showCoverage: boolean;    // coverage-highlights widget relevant?
  showClaims: boolean;      // claims a frequent job?
  showBeneficiary: boolean; // life-style beneficiary block?
  claimNoun: string;
}> = {
  Motor:    { assetLabel: 'Vehicle',     showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'accident or damage' },
  Health:   { assetLabel: 'Members',     showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'medical claim' },
  Life:     { assetLabel: 'Life cover',  showCoverage: false, showClaims: false, showBeneficiary: true,  claimNoun: 'claim' },
  Device:   { assetLabel: 'Device',      showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'damage or theft' },
  Travel:   { assetLabel: 'Trip',        showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'travel claim' },
  Agric:    { assetLabel: 'Farm',        showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'crop or livestock loss' },
  Property: { assetLabel: 'Property',    showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'damage, fire or burglary' },
  Business: { assetLabel: 'Business',    showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'business claim' },
};

export function fmtUGX(n: number): string {
  return n.toLocaleString('en-US');
}
