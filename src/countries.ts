// Ecobank's pan-African footprint — markets the marketplace serves.
export interface Market { code: string; name: string; currency: string; flag: string }

export const MARKETS: Market[] = [
  { code: 'NG', name: 'Nigeria',        currency: 'NGN', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana',          currency: 'GHS', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya',          currency: 'KES', flag: '🇰🇪' },
  { code: 'UG', name: 'Uganda',         currency: 'UGX', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania',       currency: 'TZS', flag: '🇹🇿' },
  { code: 'RW', name: 'Rwanda',         currency: 'RWF', flag: '🇷🇼' },
  { code: 'CI', name: "Côte d'Ivoire",  currency: 'XOF', flag: '🇨🇮' },
  { code: 'SN', name: 'Senegal',        currency: 'XOF', flag: '🇸🇳' },
  { code: 'CM', name: 'Cameroon',       currency: 'XAF', flag: '🇨🇲' },
  { code: 'CD', name: 'DR Congo',       currency: 'CDF', flag: '🇨🇩' },
  { code: 'ZM', name: 'Zambia',         currency: 'ZMW', flag: '🇿🇲' },
  { code: 'ML', name: 'Mali',           currency: 'XOF', flag: '🇲🇱' },
  { code: 'BJ', name: 'Benin',          currency: 'XOF', flag: '🇧🇯' },
  { code: 'TG', name: 'Togo',           currency: 'XOF', flag: '🇹🇬' },
];

const KEY = 'maas-market';

export function getMarket(): Market {
  try {
    const code = localStorage.getItem(KEY);
    return MARKETS.find(m => m.code === code) || MARKETS[3]; // default Uganda
  } catch { return MARKETS[3]; }
}

export function setMarket(code: string) {
  const m = MARKETS.find(x => x.code === code);
  if (!m) return;
  try { localStorage.setItem(KEY, code); } catch { /* ignore */ }
  // Broadcast to every embedded flow iframe so currency updates live
  document.querySelectorAll('iframe').forEach(f => {
    f.contentWindow?.postMessage({ source: 'maas-config', currency: m.currency, country: m.code }, '*');
  });
}
