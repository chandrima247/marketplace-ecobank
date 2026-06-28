// ─────────────────────────────────────────────────────────────
// Dashboard Design System — modelled on the IHK widget language
// (clean, flat cards: 12px radius, 0.8px slate border, whisper
// shadow, Inter type, 4px accent bars, 8px-radius buttons).
// Colours are Ecobank-branded and shift per product via accentFor().
// ─────────────────────────────────────────────────────────────

export const T = {
  // Type
  font: "'Inter', ui-sans-serif, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",

  // Ink (slate scale — IHK)
  ink: '#0F172A',
  sub: '#475569',
  muted: '#94A3B8',

  // Surfaces & lines (IHK)
  bg: '#F8FAFC',
  card: '#ffffff',
  soft: '#F1F5F9',
  line: '#E2E8F0',
  lineSoft: '#EFF2F6',

  // Brand fallbacks
  navy: '#023448',
  teal: '#00C58F',
  lime: '#BED600',

  // Card chrome
  cardBorder: '0.8px solid #E2E8F0',
  cardShadow: '0 1px 2px rgba(0,0,0,0.05)',
  radius: 12,
} as const;

// Semantic states — fg (text/icon), bg (chip), bd (border)
export const S = {
  ok:     { fg: '#0E8A6A', bg: '#E7F7F0', bd: '#C3EBDC' },
  warn:   { fg: '#B45309', bg: '#FEF3C7', bd: '#FDE68A' },
  danger: { fg: '#DC2626', bg: '#FEECEC', bd: '#FBD5D5' },
  info:   { fg: '#02518B', bg: '#E7F0F8', bd: '#CBE0F1' },
  neutral:{ fg: '#475569', bg: '#F1F5F9', bd: '#E2E8F0' },
} as const;

export type StateKey = keyof typeof S;

export const policyStatusState: Record<string, StateKey> = {
  Active: 'ok', Renewal: 'warn', Pending: 'info', Expired: 'danger',
};

export const claimStatusState: Record<string, StateKey> = {
  Processing: 'warn', Approved: 'ok', Declined: 'danger',
};

// hex -> rgba string
export function tint(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// Per-product accent: drives accent bars, primary buttons, tinted
// inner cards, the hero gradient, and the policy KPI icon.
export const accent: Record<string, { main: string; deep: string; grad: string }> = {
  Motor:    { main: '#02518B', deep: '#013a66', grad: 'linear-gradient(115deg,#013a66,#02518B 58%,#1c6fa0)' },
  Health:   { main: '#0E8A6A', deep: '#0a5f49', grad: 'linear-gradient(115deg,#0a5f49,#0E8A6A 58%,#13b387)' },
  Life:     { main: '#6D28D9', deep: '#4c1d95', grad: 'linear-gradient(115deg,#4c1d95,#6D28D9 58%,#7c3aed)' },
  Device:   { main: '#0369A1', deep: '#075985', grad: 'linear-gradient(115deg,#075985,#0369A1 58%,#0ea5e9)' },
  Travel:   { main: '#0D9488', deep: '#0f766e', grad: 'linear-gradient(115deg,#0f766e,#0D9488 58%,#14b8a6)' },
  Agric:    { main: '#4D7C0F', deep: '#3f6212', grad: 'linear-gradient(115deg,#3f6212,#4D7C0F 58%,#65a30d)' },
  Forex:    { main: '#0891B2', deep: '#0e7490', grad: 'linear-gradient(115deg,#0e7490,#0891B2 58%,#06b6d4)' },
  Business: { main: '#9A3412', deep: '#7c2d12', grad: 'linear-gradient(115deg,#7c2d12,#9A3412 58%,#c2410c)' },
};

export function accentFor(cat: string) {
  return accent[cat] || accent.Motor;
}

export const categoryConfig: Record<string, {
  assetLabel: string; showCoverage: boolean; showClaims: boolean; showBeneficiary: boolean; claimNoun: string;
}> = {
  Motor:    { assetLabel: 'Vehicle',    showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'accident or damage' },
  Health:   { assetLabel: 'Members',    showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'a medical claim' },
  Life:     { assetLabel: 'Life cover', showCoverage: false, showClaims: false, showBeneficiary: true,  claimNoun: 'a claim' },
  Device:   { assetLabel: 'Device',     showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'damage or theft' },
  Travel:   { assetLabel: 'Trip',       showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'a travel claim' },
  Agric:    { assetLabel: 'Farm',       showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'a crop or livestock loss' },
  Forex:    { assetLabel: 'Cover',      showCoverage: false, showClaims: false, showBeneficiary: false, claimNoun: 'a claim' },
  Business: { assetLabel: 'Business',   showCoverage: true,  showClaims: true,  showBeneficiary: false, claimNoun: 'a business claim' },
};

export function fmtUGX(n: number): string {
  return n.toLocaleString('en-US');
}
