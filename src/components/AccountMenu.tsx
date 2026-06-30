import { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, ShieldCheck, FileText, Settings } from 'lucide-react';
import { User as UserType } from '../types';

interface Props {
  user: UserType;
  onLogout: () => void;
  onNavigate: (view: 'explore' | 'policies' | 'claims') => void;
}

export default function AccountMenu({ user, onLogout, onNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (user.name || 'U').charAt(0).toUpperCase();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const go = (v: 'explore' | 'policies' | 'claims') => { onNavigate(v); setOpen(false); };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-colors"
        id="header-user-badge"
      >
        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
          {initial}
        </span>
        <span className="hidden sm:block text-xs font-bold text-gray-800 max-w-[120px] truncate">{user.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] overflow-hidden" id="header-account-menu">
          {/* identity */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50">
            <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">{initial}</span>
            <div className="min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">{user.name}</div>
              <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
            </div>
          </div>

          {/* menu */}
          <div className="p-1.5">
            <button onClick={() => go('policies')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <ShieldCheck className="w-4 h-4 text-primary" /> My policies
            </button>
            <button onClick={() => go('claims')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4 text-primary" /> Claims
            </button>
            <button onClick={() => setOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4 text-primary" /> Account settings
            </button>
          </div>

          <div className="p-1.5 border-t border-gray-50">
            <button onClick={() => { onLogout(); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors" id="header-logout-btn">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
