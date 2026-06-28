import React, { useState } from 'react';
import {
  Shield, RefreshCw, FileText, Download, Plus, CheckCircle2, AlertTriangle,
  CreditCard, Phone, MessageCircle, Mail, X, Calendar
} from 'lucide-react';
import { Policy, Claim } from '../types';
import { T, S, StateKey, policyStatusState, claimStatusState, categoryConfig, fmtUGX } from './dashboardTokens';

interface DashboardProps {
  policies: Policy[];
  claims: Claim[];
  onAddClaim: (newClaim: Claim) => void;
  onRemovePolicy?: (id: string) => void;
  onBuyInsurance?: () => void;
  onLogout?: () => void;
  userName?: string;
}

/* ════════════════ Primitives ════════════════ */

function Pill({ state, children }: { state: StateKey; children: React.ReactNode }) {
  const c = S[state];
  return (
    <span style={{ fontFamily: T.mono, color: c.fg, background: c.bg, borderColor: c.bd }}
      className="text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wide inline-flex items-center gap-1">
      {children}
    </span>
  );
}

function Widget({ title, accent = T.teal, action, children, className = '' }: {
  title: string; accent?: string; action?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={`bg-white rounded-2xl border border-[#eef0f1] overflow-hidden ${className}`}>
      <header className="flex items-center gap-2 px-5 py-4 border-b border-[#f1f4f5]">
        <span className="w-1 h-5 rounded" style={{ background: accent }} />
        <h3 className="text-[15px] font-bold text-[#16242b]">{title}</h3>
        <div className="ml-auto">{action}</div>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({ label, value, alignRight = false }: { label: string; value: React.ReactNode; alignRight?: boolean }) {
  return (
    <div className={alignRight ? 'text-right' : ''}>
      <div style={{ fontFamily: T.mono }} className="text-[11px] text-[#9aa6ad] uppercase tracking-wide">{label}</div>
      <div className="text-sm font-bold text-[#16242b] mt-1">{value}</div>
    </div>
  );
}

/* Claim status timeline */
function ClaimTimeline({ status }: { status: Claim['status'] }) {
  const steps = ['Submitted', 'In review', 'Approved', 'Paid out'];
  const reached =
    status === 'Declined' ? 1 :
    status === 'Approved' ? 3 :
    status === 'Processing' ? 1 : 1;
  const declined = status === 'Declined';
  return (
    <div className="flex items-center mt-3">
      {steps.map((s, i) => {
        const done = i <= reached;
        const isLast = i === steps.length - 1;
        const color = declined && i >= 1 ? S.danger.fg : done ? T.teal : '#dde3e6';
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span className="text-[9px] mt-1 whitespace-nowrap" style={{ color: done ? T.sub : T.muted, fontFamily: T.mono }}>
                {declined && i === 1 ? 'Declined' : s}
              </span>
            </div>
            {!isLast && <div className="h-0.5 flex-1 mx-1 mb-4 rounded" style={{ background: i < reached ? T.teal : '#eef0f1' }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ════════════════ Main ════════════════ */

export default function Dashboard({
  policies, claims, onAddClaim, onBuyInsurance, onLogout, userName = 'Jane Doe',
}: DashboardProps) {
  // Fall back to demo policies if none yet
  const list: Policy[] = policies.length ? policies : [
    { id: 'p1', category: 'Motor', title: 'Britam Motor Insurance', insuredItemName: 'Toyota RAV4 2022', premium: 485000, renewalDate: '2026-05-31', status: 'Active', coverageAmount: 165000000, code: 'MAAS-MTR-0042' },
    { id: 'p2', category: 'Health', title: 'AAR Health Prime', insuredItemName: 'Self + 3 dependents', premium: 1200000, renewalDate: '2026-08-12', status: 'Active', coverageAmount: 50000000, code: 'MAAS-HLT-0119' },
    { id: 'p3', category: 'Life', title: 'Prudential Life Cover', insuredItemName: '15-year term', premium: 800000, renewalDate: '2026-07-02', status: 'Renewal', coverageAmount: 200000000, code: 'MAAS-LIF-0203' },
  ];

  const [activeId, setActiveId] = useState(list[0].id);
  const [filter, setFilter] = useState<'Overview' | 'Policy' | 'Claims' | 'Payments' | 'Documents'>('Overview');
  const [toast, setToast] = useState<string | null>(null);
  const [showClaim, setShowClaim] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [autopay, setAutopay] = useState(true);

  const pol = list.find(p => p.id === activeId) || list[0];
  const cfg = categoryConfig[pol.category];
  const polClaims = claims.filter(c => c.policyId === pol.id);

  const renewalsCount = list.filter(p => p.status === 'Renewal' || p.status === 'Expired').length;
  const dueDate = new Date(pol.renewalDate);
  const daysToDue = Math.ceil((dueDate.getTime() - new Date('2026-06-28').getTime()) / 86400000);
  const dueSoon = daysToDue <= 30;

  // Demo payment history (success / failed-reversed states)
  const payHistory = [
    { date: '15 May 2026', acct: '1234567890', amount: 485000, ok: true },
    { date: '19 Apr 2026', acct: '0987654321', amount: 485000, ok: false },
    { date: '15 Apr 2026', acct: '5566778899', amount: 40400, ok: true },
  ];

  const fire = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const show = (c: string) => filter === 'Overview' || filter === c;
  const pills = (['Overview', 'Policy', cfg.showClaims ? 'Claims' : null, 'Payments', 'Documents'].filter(Boolean) as typeof filter[]);

  return (
    <div className="min-h-screen" style={{ background: T.bg, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-6">
        {/* ───── HERO ───── */}
        <div className="rounded-[22px] overflow-hidden relative mb-5" style={{ background: 'linear-gradient(110deg,#023448,#005b82 60%,#1c6fa0)', padding: '30px 34px' }}>
          <div className="absolute -top-10 -right-5 w-52 h-52 rounded-full" style={{ background: 'rgba(190,214,0,.12)' }} />
          <div className="relative flex justify-between items-start flex-wrap gap-4">
            <div>
              <div style={{ fontFamily: T.mono }} className="text-[12px] text-white/60 tracking-widest font-medium">WELCOME BACK</div>
              <div className="text-3xl font-extrabold text-white mt-1.5">{userName}</div>
              <div className="text-sm text-white/70 mt-1">Your protection, all in one place.</div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-full">
              <Shield className="w-4 h-4 text-[#BED600]" />
              <span className="text-[13px] text-white font-semibold">Verified · Ecobank</span>
            </div>
          </div>
        </div>

        {/* ───── KPI BAR ───── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <Kpi label="ACTIVE POLICIES" value={String(list.filter(p => p.status === 'Active').length)} icon={<Shield className="w-5 h-5" />} state="ok" />
          <Kpi label="PENDING RENEWALS" value={String(renewalsCount)} icon={<RefreshCw className="w-5 h-5" />} state="danger" />
          <Kpi label="OPEN CLAIMS" value={String(claims.filter(c => c.status === 'Processing').length)} icon={<FileText className="w-5 h-5" />} state="info" />
          <Kpi label="NEXT PREMIUM DUE" value={dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} small icon={<Calendar className="w-5 h-5" />} state="neutral" />
        </div>

        {/* ───── BODY ───── */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-5 items-start">
          {/* SIDEBAR */}
          <aside className="flex flex-col gap-3">
            {list.map(p => {
              const st = policyStatusState[p.status] || 'neutral';
              const active = p.id === activeId;
              return (
                <button key={p.id} onClick={() => setActiveId(p.id)}
                  className="text-left rounded-2xl p-4 transition-all bg-white"
                  style={{ border: `2px solid ${active ? T.navy : T.line}`, boxShadow: active ? '0 6px 18px -10px rgba(2,52,72,.3)' : 'none' }}>
                  <div className="flex justify-between items-start">
                    <span style={{ fontFamily: T.mono }} className="text-[13px] font-bold">{p.code}</span>
                    <Pill state={st}>{p.status.toUpperCase()}</Pill>
                  </div>
                  <div className="text-[13px] text-[#3e4a52] mt-2 font-medium">{p.title}</div>
                  <div className="flex justify-between items-center mt-2.5">
                    <span style={{ fontFamily: T.mono }} className="text-[10px] text-[#92670e] bg-[#fef3c7] px-2 py-1 rounded">Due {new Date(p.renewalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    <span className="font-bold text-[#00a878] text-[13px]">UGX {fmtUGX(p.premium)}</span>
                  </div>
                </button>
              );
            })}
            <button onClick={onBuyInsurance} className="w-full border-2 border-dashed border-[#cdd9e1] bg-white text-[#023448] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:border-[#023448] transition">
              <Plus className="w-4 h-4" /> Add new policy
            </button>
          </aside>

          {/* MAIN — single widget panel (card): header + pill filters + 3-column grid */}
          <div className="min-w-0">
            <div className="bg-white rounded-2xl border border-[#eef0f1] p-5 lg:p-6">
              {/* panel header */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-[#16242b]">{pol.title}</h2>
                    <Pill state={policyStatusState[pol.status] || 'neutral'}>{pol.status.toUpperCase()}</Pill>
                  </div>
                  <div style={{ fontFamily: T.mono }} className="text-xs text-[#9aa6ad] mt-0.5">{pol.category} · {pol.code}</div>
                </div>
                <button onClick={() => fire('Certificate downloaded')} className="bg-[#023448] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-95">
                  <Download className="w-4 h-4" /> Proof of cover
                </button>
              </div>

              {/* pill filters */}
              <div className="flex gap-2 flex-wrap border-b border-[#f1f4f5] pb-4 mb-5">
                {pills.map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className="text-[13px] font-semibold px-4 py-2 rounded-full transition"
                    style={filter === f ? { background: '#ecf2f6', color: T.navy } : { color: T.sub, border: `1px solid ${T.line}` }}>
                    {f}
                  </button>
                ))}
              </div>

              {dueSoon && <div className="mb-4"><RenewalBanner days={daysToDue} amount={pol.premium} onPay={() => setShowPay(true)} /></div>}

              {/* ═══ 3-COLUMN WIDGET GRID ═══ */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">

                {/* ─── COLUMN 1 — Policy & cover ─── */}
                <div className="flex flex-col gap-4">
                {show('Policy') && (
                <Widget title="Policy overview" accent={T.teal} action={<Pill state={policyStatusState[pol.status] || 'neutral'}>{pol.status.toUpperCase()}</Pill>}>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Policy no." value={pol.code} />
                    <Field label="Premium / yr" value={`UGX ${fmtUGX(pol.premium)}`} alignRight />
                    <Field label={cfg.assetLabel} value={pol.insuredItemName} />
                    <Field label="Sum insured" value={`UGX ${(pol.coverageAmount / 1_000_000).toFixed(0)}M`} alignRight />
                    <Field label="Cover start" value="01 Jun 2025" />
                    <Field label="Renews on" value={dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} alignRight />
                  </div>
                  <button onClick={() => fire('Certificate downloaded')} className="w-full mt-4 border border-[#e0e5e8] py-2.5 rounded-xl text-xs font-bold text-[#16242b] hover:bg-slate-50 transition">Download certificate</button>
                </Widget>
                )}

                {show('Policy') && cfg.showCoverage && (
                  <Widget title="Coverage highlights" accent={T.teal}>
                    <div className="space-y-3">
                      {[{ n: 'Third Party Liability', p: 100 }, { n: 'Own Damage', p: 85 }, { n: 'Theft Protection', p: 90 }, { n: 'Roadside Assist', p: 60 }].map(x => (
                        <div key={x.n}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-semibold">{x.n}</span>
                            <span style={{ fontFamily: T.mono }} className="text-xs font-bold text-[#00a878]">{x.p}%</span>
                          </div>
                          <div className="h-1.5 bg-[#f1f4f5] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${x.p}%`, background: 'linear-gradient(90deg,#00C58F,#0ea5a4)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Widget>
                )}

                {show('Policy') && cfg.showBeneficiary && (
                  <Widget title="Beneficiaries" accent={T.navy} action={<button onClick={() => fire('Beneficiary form opened')} className="text-xs font-bold text-[#023448]">Update</button>}>
                    <div className="space-y-2">
                      {[{ n: 'John Doe', r: 'Spouse', s: '60%' }, { n: 'Mary Doe', r: 'Child', s: '40%' }].map(b => (
                        <div key={b.n} className="flex items-center justify-between border border-[#eef0f1] rounded-xl px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#ecf2f6] text-[#023448] flex items-center justify-center font-bold text-sm">{b.n.charAt(0)}</div>
                            <div><div className="text-sm font-bold">{b.n}</div><div style={{ fontFamily: T.mono }} className="text-xs text-[#9aa6ad]">{b.r}</div></div>
                          </div>
                          <span className="font-bold text-[#023448]">{b.s}</span>
                        </div>
                      ))}
                    </div>
                  </Widget>
                )}

                {show('Documents') && (
                  <Widget title="Documents" accent={T.navy}>
                    <p className="text-sm text-[#6b7780] leading-relaxed">Certificates, claim receipts and statements — all digitally signed.</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Certificate', 'Claim receipt', 'Tax statement'].map(d => (
                        <span key={d} style={{ fontFamily: T.mono }} className="text-[11px] font-semibold bg-[#f8fafb] border border-[#eef0f1] px-3 py-1.5 rounded-full">{d}</span>
                      ))}
                    </div>
                    <button onClick={() => fire('Statement downloaded')} className="w-full mt-4 bg-[#023448] text-white py-2.5 rounded-xl text-xs font-bold">Get statement</button>
                  </Widget>
                )}
              </div>

              {/* ─── COLUMN 2 — Payments ─── */}
              <div className="flex flex-col gap-4">
                {show('Payments') && (
                <Widget title="Payment & mandate" accent={T.lime} action={<Pill state={autopay ? 'ok' : 'danger'}>{autopay ? 'AUTO-PAY ON' : 'AUTO-PAY OFF'}</Pill>}>
                  <div className="flex justify-between items-start">
                    <Field label="Next premium" value={`UGX ${fmtUGX(pol.premium)}`} />
                    <Field label="Due" value={dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} alignRight />
                  </div>
                  <div className="flex items-center gap-3 border border-[#eef0f1] rounded-xl p-3 mt-4">
                    <div className="w-9 h-9 rounded-lg bg-[#ecf2f6] text-[#023448] flex items-center justify-center shrink-0"><CreditCard className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold">Ecobank ****4292</div>
                      <div style={{ fontFamily: T.mono }} className="text-[11px] text-[#9aa6ad]">{autopay ? 'Direct debit active' : 'Direct debit inactive'}</div>
                    </div>
                    <button onClick={() => { setAutopay(a => !a); fire(autopay ? 'Auto-pay turned off' : 'Auto-pay turned on'); }}
                      className="w-11 h-6 rounded-full transition relative shrink-0" style={{ background: autopay ? T.teal : '#cdd5d9' }}>
                      <span className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all" style={{ left: autopay ? '24px' : '4px' }} />
                    </button>
                  </div>
                  <button onClick={() => setShowPay(true)} className="w-full mt-3 bg-[#023448] text-white py-2.5 rounded-xl text-xs font-bold">Pay UGX {fmtUGX(pol.premium)}</button>
                </Widget>
                )}

                {show('Payments') && (
                <Widget title="Can't pay in full?" accent={T.lime}>
                  <p className="text-sm text-[#3e4a52] leading-relaxed">Spread your premium with <b>Ecobank Premium Financing</b> — keep your cover active even in a tight month.</p>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {[{ m: 3, v: Math.round(pol.premium / 3) }, { m: 6, v: Math.round(pol.premium / 6) }, { m: 12, v: Math.round(pol.premium / 12) }].map(o => (
                      <button key={o.m} onClick={() => fire(`Installment plan: ${o.m} × UGX ${fmtUGX(o.v)}`)} className="border border-[#e0e5e8] rounded-xl px-3 py-2.5 text-left hover:border-[#023448] transition">
                        <div className="text-[10px] text-[#9aa6ad]" style={{ fontFamily: T.mono }}>{o.m} MONTHS</div>
                        <div className="text-[13px] font-bold text-[#023448] mt-0.5">UGX {fmtUGX(o.v)}</div>
                      </button>
                    ))}
                  </div>
                </Widget>
                )}

                {show('Payments') && (
                <Widget title="Payment history" accent={T.navy}>
                  <div className="space-y-2.5">
                    {payHistory.map((h, i) => (
                      <div key={i} className="flex items-center justify-between border border-[#eef0f1] rounded-xl px-4 py-3">
                        <div>
                          <div className="text-sm font-bold">{h.date}</div>
                          <div style={{ fontFamily: T.mono }} className="text-xs text-[#9aa6ad] mt-0.5 flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-sm bg-[#ED1C24] inline-block" /> {h.acct}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {h.ok
                            ? <span className="font-bold text-[#00a878]">UGX {fmtUGX(h.amount)}</span>
                            : <span className="font-bold text-[#c4452f] line-through">UGX {fmtUGX(h.amount)}</span>}
                          <button onClick={() => fire(h.ok ? 'Receipt downloaded' : 'Payment failed — no receipt')} className="text-[#9aa6ad] hover:text-[#023448]"><Download className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Widget>
                )}
              </div>

              {/* ─── COLUMN 3 — Claims & service ─── */}
              <div className="flex flex-col gap-4">
                {show('Claims') && cfg.showClaims && (
                  <Widget title="Claims" accent={T.navy} action={
                    <button onClick={() => setShowClaim(true)} className="bg-[#023448] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-3 h-3" />File</button>}>
                    {polClaims.length ? (
                      <div className="space-y-3">
                        {polClaims.slice(0, 3).map(c => (
                          <div key={c.id} className="border border-[#eef0f1] rounded-xl p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-[13px] font-bold">{c.description?.slice(0, 24) || 'Claim'}</div>
                                <div style={{ fontFamily: T.mono }} className="text-[11px] text-[#9aa6ad] mt-0.5">{c.dateSubmitted}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-[#00a878]">UGX {fmtUGX(c.estimatedPayout)}</div>
                                <Pill state={claimStatusState[c.status] || 'neutral'}>{c.status.toUpperCase()}</Pill>
                              </div>
                            </div>
                            <ClaimTimeline status={c.status} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState icon={<FileText className="w-5 h-5" />} text={`No claims yet. Report ${cfg.claimNoun} and track it here.`} />
                    )}
                  </Widget>
                )}

                {filter === 'Overview' && (
                <Widget title="Need help?" accent={T.teal}>
                  <div className="grid grid-cols-1 gap-2.5">
                    <SupportCard icon={<MessageCircle className="w-5 h-5" />} title="Live chat" sub="Avg. reply < 2 min" onClick={() => fire('Opening live chat…')} />
                    <SupportCard icon={<Phone className="w-5 h-5" />} title="Call us" sub="0800 100 200 · 24/7" onClick={() => fire('Calling 0800 100 200…')} />
                    <SupportCard icon={<Mail className="w-5 h-5" />} title="Email" sub="care@ecobank.com" onClick={() => fire('Opening email…')} />
                  </div>
                </Widget>
                )}
              </div>

            </div>
            </div>
          </div>
        </div>
      </div>

      {/* ───── MODALS ───── */}
      {showClaim && <FileClaimModal policy={pol} onClose={() => setShowClaim(false)} onSubmit={(c) => { onAddClaim(c); setShowClaim(false); fire('Claim submitted — track it under Claims'); }} />}
      {showPay && <PayModal policy={pol} onClose={() => setShowPay(false)} onPaid={() => { setShowPay(false); fire('Payment successful'); }} />}

      {/* ───── TOAST ───── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#16242b] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#BED600]" /> <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
}

/* ════════════════ Sub-components ════════════════ */

function Kpi({ label, value, icon, state, small }: { label: string; value: string; icon: React.ReactNode; state: StateKey; small?: boolean }) {
  const c = S[state];
  return (
    <div className="bg-white rounded-xl p-4 border border-[#eef0f1] flex items-center justify-between">
      <div>
        <div style={{ fontFamily: T.mono }} className="text-[11px] text-[#9aa6ad] uppercase tracking-wide">{label}</div>
        <div className={`font-extrabold mt-1 ${small ? 'text-lg' : 'text-3xl'}`} style={{ color: small ? T.ink : c.fg }}>{value}</div>
      </div>
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: c.bg, color: c.fg }}>{icon}</div>
    </div>
  );
}

function RenewalBanner({ days, amount, onPay }: { days: number; amount: number; onPay: () => void }) {
  const overdue = days < 0;
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3 flex-wrap" style={{ background: overdue ? S.danger.bg : S.warn.bg, border: `1px solid ${overdue ? S.danger.bd : S.warn.bd}` }}>
      <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: overdue ? S.danger.fg : S.warn.fg }} />
      <div className="flex-1 min-w-[180px]">
        <div className="text-sm font-bold" style={{ color: overdue ? S.danger.fg : S.warn.fg }}>
          {overdue ? `Premium overdue by ${Math.abs(days)} days` : `Renewal due in ${days} days`}
        </div>
        <div className="text-xs text-[#6b7780] mt-0.5">Pay UGX {fmtUGX(amount)} to keep your cover active and avoid a lapse.</div>
      </div>
      <button onClick={onPay} className="bg-[#023448] text-white px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap">Pay now</button>
    </div>
  );
}

function ClaimRow({ claim }: { claim: Claim }) {
  return (
    <div className="border border-[#eef0f1] rounded-xl p-3 flex justify-between items-start mb-2 last:mb-0">
      <div>
        <div className="text-xs font-bold">{claim.dateSubmitted}</div>
        <div style={{ fontFamily: T.mono }} className="text-[10px] text-[#9aa6ad] mt-0.5">{claim.description?.slice(0, 28) || claim.policyTitle}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-[#00a878]">UGX {fmtUGX(claim.estimatedPayout)}</div>
        <Pill state={claimStatusState[claim.status] || 'neutral'}>{claim.status.toUpperCase()}</Pill>
      </div>
    </div>
  );
}

function Action({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 border border-[#eef0f1] rounded-xl px-3 py-3 hover:border-[#023448] hover:bg-[#f8fafb] transition text-left">
      <span className="w-8 h-8 rounded-lg bg-[#ecf2f6] text-[#023448] flex items-center justify-center shrink-0">{icon}</span>
      <span className="text-sm font-semibold text-[#16242b]">{label}</span>
    </button>
  );
}

function SupportCard({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 border border-[#eef0f1] rounded-xl p-4 hover:border-[#023448] hover:bg-[#f8fafb] transition text-left">
      <span className="w-11 h-11 rounded-lg bg-[#ecf2f6] text-[#023448] flex items-center justify-center shrink-0">{icon}</span>
      <div><div className="text-sm font-bold text-[#16242b]">{title}</div><div style={{ fontFamily: T.mono }} className="text-xs text-[#9aa6ad] mt-0.5">{sub}</div></div>
    </button>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center text-center py-6 px-4">
      <div className="w-12 h-12 rounded-full bg-[#f1f4f5] text-[#9aa6ad] flex items-center justify-center mb-3">{icon}</div>
      <p className="text-sm text-[#6b7780] max-w-xs">{text}</p>
    </div>
  );
}

/* ─── Modals ─── */

function FileClaimModal({ policy, onClose, onSubmit }: { policy: Policy; onClose: () => void; onSubmit: (c: Claim) => void }) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  return (
    <Overlay onClose={onClose} title="File a claim">
      <div className="space-y-4">
        <div style={{ fontFamily: T.mono }} className="text-xs text-[#9aa6ad]">{policy.title} · {policy.code}</div>
        <Labeled label="What happened?">
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Describe the incident…" className="w-full border border-[#e0e5e8] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#023448]" />
        </Labeled>
        <Labeled label="Estimated amount (UGX)">
          <input value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full border border-[#e0e5e8] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#023448]" />
        </Labeled>
        <div className="border-2 border-dashed border-[#cdd9e1] rounded-xl py-6 text-center text-sm text-[#9aa6ad]">
          <Download className="w-5 h-5 mx-auto mb-1.5 rotate-180" /> Drag photos & documents here
        </div>
        <button
          disabled={!desc}
          onClick={() => onSubmit({
            id: `clm-${Date.now()}`, policyId: policy.id, category: policy.category, policyTitle: policy.title,
            description: desc, dateSubmitted: new Date('2026-06-28').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: 'Processing', estimatedPayout: parseInt(amount) || 0,
          })}
          className="w-full bg-[#BED600] text-[#023448] py-3 rounded-xl font-bold text-sm disabled:opacity-50">Submit claim</button>
      </div>
    </Overlay>
  );
}

function PayModal({ policy, onClose, onPaid }: { policy: Policy; onClose: () => void; onPaid: () => void }) {
  const [paying, setPaying] = useState(false);
  return (
    <Overlay onClose={onClose} title="Confirm payment">
      <div className="space-y-4">
        <div className="bg-[#f8fafb] rounded-xl p-4 border border-[#eef0f1]">
          <div className="flex justify-between"><span className="text-sm text-[#6b7780]">{policy.title}</span><span className="text-sm font-bold">UGX {fmtUGX(policy.premium)}</span></div>
          <div className="flex justify-between mt-2"><span className="text-sm text-[#6b7780]">Pay from</span><span className="text-sm font-bold">Ecobank ****4292</span></div>
        </div>
        <button disabled={paying} onClick={() => { setPaying(true); setTimeout(onPaid, 1200); }} className="w-full bg-[#023448] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
          {paying ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</> : <>Pay UGX {fmtUGX(policy.premium)}</>}
        </button>
      </div>
    </Overlay>
  );
}

function Overlay({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(2,36,51,.45)' }} onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-extrabold text-[#16242b]">{title}</h3>
          <button onClick={onClose} className="text-[#9aa6ad] hover:text-[#16242b]"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#16242b] block mb-1.5">{label}</label>
      {children}
    </div>
  );
}
