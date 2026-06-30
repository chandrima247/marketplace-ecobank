import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { MARKETS, getMarket, setMarket } from '../countries';

export default function CountrySelector() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(() => getMarket().code);
  const ref = useRef<HTMLDivElement>(null);
  const market = MARKETS.find(m => m.code === code) || MARKETS[3];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const choose = (c: string) => { setCode(c); setMarket(c); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-full border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-colors"
        id="country-selector-btn"
        title="Select your country"
      >
        <span className="text-base leading-none">{market.flag}</span>
        <span className="hidden sm:block text-xs font-bold text-gray-700">{market.code}</span>
        <span className="hidden md:block text-[10px] font-semibold text-gray-400 font-mono">{market.currency}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl p-1.5 z-[60] max-h-[340px] overflow-y-auto" id="country-selector-menu">
          <div className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
            <Globe className="w-3.5 h-3.5" /> Select market
          </div>
          {MARKETS.map(m => (
            <button
              key={m.code}
              onClick={() => choose(m.code)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${m.code === code ? 'bg-primary/5' : 'hover:bg-gray-50'}`}
            >
              <span className="text-lg leading-none">{m.flag}</span>
              <span className="flex-1 text-sm font-semibold text-gray-800">{m.name}</span>
              <span className="text-[10px] font-bold text-gray-400 font-mono">{m.currency}</span>
              {m.code === code && <Check className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
