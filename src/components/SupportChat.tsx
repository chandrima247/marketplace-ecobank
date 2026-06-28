import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Headphones, ChevronDown } from 'lucide-react';

interface Msg { from: 'bot' | 'user'; text: string }

const NAVY = '#023448';
const LIME = '#BED600';
const TEAL = '#00C58F';

const QUICK_REPLIES = [
  'File a claim',
  'When is my premium due?',
  'Update my direct debit',
  'Talk to an agent',
];

// Lightweight canned-response bot
function botReply(input: string): string {
  const t = input.toLowerCase();
  if (/claim/.test(t)) return "To file a claim, open your policy → Claims → New claim. You'll add a few photos and documents, and most claims are reviewed within 48 hours. Want me to start one for you?";
  if (/premium|due|renew/.test(t)) return 'Your next premium date is shown on your dashboard under "Next premium due". You can pay it instantly or set up auto-pay so your cover never lapses. Shall I take you there?';
  if (/direct debit|mandate|auto.?pay/.test(t)) return 'You can manage your direct-debit mandate under Payments → Direct debit mandate. Toggle auto-pay on or off there anytime.';
  if (/agent|human|person|representative/.test(t)) return "I'll connect you to a live agent. Average wait time is under 2 minutes. You can also call us 24/7 on 0800 100 200.";
  if (/cancel|refund/.test(t)) return 'All policies come with a 14-day free cancellation. Let me know which policy and I can guide you through it.';
  if (/hi|hello|hey/.test(t)) return 'Hi there! 👋 How can I help you with your insurance today?';
  if (/thank/.test(t)) return "You're welcome! Is there anything else I can help with?";
  return "Thanks for that — a support specialist will follow up shortly. In the meantime, you can reach us 24/7 on 0800 100 200 or care@ecobank.com.";
}

export default function SupportChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'bot', text: 'Hi, I’m Ecobank Assist 👋 How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing, open]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMsgs(m => [...m, { from: 'user', text: clean }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { from: 'bot', text: botReply(clean) }]);
      setTyping(false);
    }, 800);
  };

  return (
    <>
      {/* ── Chat panel ── */}
      {open && (
        <div
          className="fixed z-[80] flex flex-col bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-200"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 92px)',
            right: 24,
            width: 'min(370px, calc(100vw - 32px))',
            height: 'min(540px, calc(100vh - 140px))',
            borderRadius: 20,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
          id="support-chat-panel"
        >
          {/* header */}
          <div style={{ background: NAVY }} className="px-4 py-3.5 flex items-center gap-3 text-white">
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,.12)' }}>
                <Headphones className="w-5 h-5" style={{ color: LIME }} />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#023448]" style={{ background: TEAL }} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold leading-tight">Ecobank Assist</div>
              <div className="text-[11px] text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: TEAL }} /> Online · replies in ~1 min
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Minimise chat" className="p-1.5 rounded-full hover:bg-white/10 transition">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: '#f8fafc' }}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[80%] text-[13.5px] leading-relaxed px-3.5 py-2.5"
                  style={m.from === 'user'
                    ? { background: NAVY, color: '#fff', borderRadius: '14px 14px 4px 14px' }
                    : { background: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '14px 14px 14px 4px' }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white border border-[#e2e8f0] rounded-2xl px-4 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {/* quick replies — only before the user has said anything */}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-[12.5px] font-semibold px-3 py-2 rounded-full bg-white transition hover:bg-slate-50"
                    style={{ border: `1px solid ${NAVY}`, color: NAVY }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* input */}
          <div className="border-t border-[#e2e8f0] p-3 flex items-center gap-2 bg-white">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') send(input); }}
              placeholder="Type your message…"
              className="flex-1 text-sm outline-none px-3 py-2.5 rounded-xl"
              style={{ background: '#f1f5f9' }}
            />
            <button onClick={() => send(input)} aria-label="Send"
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition hover:brightness-110 disabled:opacity-40"
              style={{ background: NAVY }} disabled={!input.trim()}>
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="text-center text-[10px] text-slate-400 pb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Powered by nxtpe · Secured by Ecobank</div>
        </div>
      )}

      {/* ── Floating launcher ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close support chat' : 'Need help? Open support chat'}
        className="fixed z-[80] flex items-center gap-2.5 shadow-xl transition-all hover:scale-105 active:scale-95"
        style={{
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
          right: 24,
          background: NAVY,
          color: '#fff',
          borderRadius: 999,
          padding: open ? 16 : '14px 20px 14px 16px',
        }}
        id="support-chat-launcher"
      >
        {open
          ? <X className="w-6 h-6" />
          : <>
              <span className="relative flex items-center justify-center w-7 h-7 rounded-full" style={{ background: 'rgba(255,255,255,.14)' }}>
                <MessageCircle className="w-4 h-4" style={{ color: LIME }} />
              </span>
              <span className="text-sm font-bold pr-1">Need help?</span>
            </>}
      </button>
    </>
  );
}
