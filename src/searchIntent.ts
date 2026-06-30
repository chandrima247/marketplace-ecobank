import { InsuranceCategory } from './types';

// ── Smart search: keyword → category intent mapping (African market aware) ──
const INTENT: Record<InsuranceCategory, string[]> = {
  Motor:   ['car', 'vehicle', 'motor', 'auto', 'automobile', 'truck', 'lorry', 'van', 'bike', 'motorbike', 'boda', 'matatu', 'taxi', 'drive', 'driving', 'accident', 'comprehensive', 'third party', 'number plate', 'tuk'],
  Health:  ['health', 'medical', 'hospital', 'clinic', 'doctor', 'child', 'children', 'kid', 'baby', 'family', 'maternity', 'pregnan', 'sick', 'illness', 'opd', 'inpatient', 'outpatient', 'dental', 'optical', 'nhif', 'cover my family'],
  Life:    ['life', 'death', 'funeral', 'burial', 'legacy', 'beneficiary', 'term life', 'whole life', 'last expense', 'breadwinner', 'dependants', 'dependents'],
  Device:  ['phone', 'smartphone', 'iphone', 'laptop', 'computer', 'device', 'gadget', 'screen', 'tablet', 'ipad', 'electronics', 'tv', 'television', 'theft of phone', 'cracked'],
  Travel:  ['travel', 'trip', 'flight', 'visa', 'abroad', 'journey', 'holiday', 'vacation', 'schengen', 'overseas', 'airport', 'luggage'],
  Agric:   ['farm', 'farming', 'crop', 'crops', 'harvest', 'livestock', 'cattle', 'cow', 'goat', 'poultry', 'chicken', 'maize', 'coffee', 'agric', 'agriculture', 'drought', 'weather index', 'tractor', 'plantation'],
  Business:['business', 'shop', 'sme', 'stock', 'inventory', 'office', 'enterprise', 'goods', 'premises', 'fire', 'burglary', 'liability', 'employees', 'workmen', 'warehouse', 'store', 'company'],
  Property:['property', 'home', 'house', 'building', 'apartment', 'flat', 'rent', 'rental', 'landlord', 'tenant', 'contents', 'household', 'mortgage', 'real estate', 'fire', 'burglary', 'flood'],
};

export interface Match { id: InsuranceCategory; score: number }

export function matchCategories(query: string, all: { id: InsuranceCategory }[]): InsuranceCategory[] {
  const q = query.toLowerCase().trim();
  if (!q) return all.map(c => c.id);
  const scored: Match[] = all.map(({ id }) => {
    let score = 0;
    // direct category name hit is strongest
    if (q.includes(id.toLowerCase())) score += 6;
    for (const kw of (INTENT[id] || [])) {
      if (q.includes(kw)) score += kw.includes(' ') ? 4 : 3; // multi-word phrases weigh more
    }
    return { id, score };
  }).filter(m => m.score > 0).sort((a, b) => b.score - a.score);
  return scored.map(m => m.id);
}

// Rotating typewriter prompts shown in the search bar
export const SEARCH_PROMPTS = [
  'I want health insurance for my child',
  'Insure my car against accidents',
  'Cover my phone against theft & screen damage',
  'Protect my shop, stock and premises',
  'Life cover for my family',
  'Insure my maize harvest against drought',
  'Travel insurance for my trip to Lagos',
  'Medical cover for me and my parents',
];
