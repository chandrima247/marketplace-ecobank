import React, { useState } from 'react';
import {
  Shield, RefreshCw, FileText, Download, Plus, CheckCircle2, AlertTriangle,
  CreditCard, Repeat, ChevronRight, Phone, MessageCircle, Mail, X, Calendar, Check
} from 'lucide-react';
import { Policy, Claim } from '../types';
import { T, S, StateKey, policyStatusState, claimStatusState, categoryConfig, accentFor, tint, fmtUGX } from './dashboardTokens';

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
    <span style={{ color: c.fg, background: c.bg, borderColor: c.bd }}
      className="text-[10.5px] font-bold px-2.5 py-1 rounded-md border tracking-wide inline-flex items-center gap-1 uppercase">
      {children}
    </span>
  );
}

function Widget({ title, accent, action, children, className = '' }: {
  title: string; accent: string; action?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={className} style={{ background: T.card, border: T.cardBorder, boxShadow: T.cardShadow, borderRadius: T.radius }}>
      <header className="flex items-center gap-2.5 px-5 pt-5 pb-3">
        <span style={{ width: 4, height: 20, borderRadius: 2, background: accent }} />
        <h3 className="text-[15px] font-bold" style={{ color: T.ink }}>{title}</h3>
        <div className="ml-auto">{action}</div>
      </header>
      <div className="px-5 pb-5">{children}</div>
    </section>
  );
}

function Micro({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-[11px] font-semibold uppercase tracking-wider ${className}`} style={{ color: T.muted }}>{children}</div>;
}

function Field({ label, value, alignRight = false }: { label: string; value: React.ReactNode; alignRight?: boolean }) {
  return (
    <div className={alignRight ? 'text-right' : ''}>
      <Micro>{label}</Micro>
      <div className="text-sm font-bold mt-1" style={{ color: T.ink }}>{value}</div>
    </div>
  );
}

function PrimaryBtn({ accent, children, onClick, className = '', disabled }: { accent: string; children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`text-white text-sm font-bold rounded-lg px-4 py-3 transition hover:brightness-110 disabled:opacity-50 ${className}`}
      style={{ background: accent, letterSpacing: '-0.07px' }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`text-sm font-bold rounded-lg px-4 py-3 transition hover:bg-slate-50 ${className}`}
      style={{ color: T.ink, border: `1px solid ${T.line}` }}>
      {children}
    </button>
  );
}

function ClaimTimeline({ status, accent }: { status: Claim['status']; accent: string }) {
  const steps = ['Submitted', 'In review', 'Approved', 'Paid out'];
  const reached = status === 'Approved' ? 3 : 1;
  const declined = status === 'Declined';
  return (
    <div className="flex items-center mt-4">
      {steps.map((s, i) => {
        const done = i <= reached && !declined || i === 0;
        const color = declined && i >= 1 ? S.danger.fg : (i <= reached ? accent : '#dde3e6');
        const isLast = i === steps.length - 1;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center" style={{ flex: '0 0 auto' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
              <span className="text-[9.5px] mt-1 whitespace-nowrap font-medium" style={{ color: i <= reached ? T.sub : T.muted }}>
                {declined && i === 1 ? 'Declined' : s}
              </span>
            </div>
            {!isLast && <div className="h-[2px] flex-1 mx-1 mb-4 rounded" style={{ background: i < reached && !declined ? accent : T.line }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ════════════════ Main ════════════════ */

export default function Dashboard({ policies, claims, onAddClaim, onBuyInsurance, userName = 'Jane Doe' }: DashboardProps) {
  const list: Policy[] = policies.length ? policies : [
    { id: 'p1', category: 'Motor', title: 'Britam Motor Insurance', insuredItemName: 'Toyota RAV4 2022', premium: 485000, renewalDate: '2026-05-31', status: 'Active', coverageAmount: 165000000, code: 'MAAS-MTR-0042' },
    { id: 'p2', category: 'Health', title: 'AAR Health Prime', insuredItemName: 'Self + 3 dependents', premium: 1200000, renewalDate: '2026-08-12', status: 'Active', coverageAmount: 50000000, code: 'MAAS-HLT-0119' },
    { id: 'p3', category: 'Life', title: 'Prudential Life Cover', insuredItemName: '15-year term', premium: 800000, renewalDate: '2026-07-02', status: 'Renewal', coverageAmount: 200000000, code: 'MAAS-LIF-0203' },
  ];

  const [activeId, setActiveId] = useState(list[0].id);
  const [tab, setTab] = useState<'Overview' | 'Policy' | 'Claims' | 'Payments' | 'Support'>('Overview');
  const [toast, setToast] = useState<string | null>(null);
  const [showClaim, setShowClaim] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [autopay, setAutopay] = useState(true);

  const pol = list.find(p => p.id === activeId) || list[0];
  const cfg = categoryConfig[pol.category];
  const acc = accentFor(pol.category);
  const polClaims = claims.filter(c => c.policyId === pol.id);

  const renewalsCount = list.filter(p => p.status === 'Renewal' || p.status === 'Expired').length;
  const dueDate = new Date(pol.renewalDate);
  const daysToDue = Math.ceil((dueDate.getTime() - new Date('2026-06-28').getTime()) / 86400000);
  const dueSoon = daysToDue <= 30;

  // Bill model (IHK pattern): when due, show a partially-paid bill to settle.
  const total = pol.premium;
  const paid = dueSoon ? Math.round(total * 0.37) : total;
  const balance = total - paid;
  const pct = Math.round((paid / total) * 100);

  const payHistory = [
    { date: '15 May 2026', acct: '1234567890', amount: 100000, ok: true },
    { date: '19 May 2026', acct: '0987654321', amount: 169900, ok: false },
    { date: '19 May 2026', acct: '5566778899', amount: 10000, ok: false },
  ];

  const fire = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const tabs = (['Overview', 'Policy', cfg.showClaims ? 'Claims' : null, 'Payments', 'Support'].filter(Boolean) as typeof tab[]);
  const dueStr = dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen" style={{ background: T.bg, fontFamily: T.font }}>
      <div className="max-w-[1480px] mx-auto px-5 lg:px-8 py-6">
        {/* ───── HERO ───── */}
        <div className="rounded-2xl overflow-hidden relative mb-5" style={{ background: acc.grad, padding: '28px 32px' }}>
          <div className="absolute -top-12 -right-8 w-56 h-56 rounded-full" style={{ background: 'rgba(255,255,255,.08)' }} />
          <div className="relative flex justify-between items-center flex-wrap gap-4">
            <div>
              <Micro className="!text-white/55">Welcome back</Micro>
              <div className="text-[28px] font-extrabold text-white mt-1 leading-tight">{userName}</div>
              <div className="text-sm text-white/70 mt-1">{list.length} {list.length === 1 ? 'policy' : 'policies'} · all in one place</div>
            </div>
            <div className="flex items-center gap-2 bg-white/12 px-3.5 py-2 rounded-full backdrop-blur-sm">
              <Shield className="w-4 h-4 text-white" />
              <span className="text-[13px] text-white font-semibold">Verified · Ecobank</span>
            </div>
          </div>
        </div>

        {/* ───── KPI BAR ───── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <Kpi label="Active policies" value={String(list.filter(p => p.status === 'Active').length)} icon={<Shield className="w-[18px] h-[18px]" />} state="ok" />
          <Kpi label="Pending renewals" value={String(renewalsCount)} icon={<RefreshCw className="w-[18px] h-[18px]" />} state={renewalsCount ? 'danger' : 'neutral'} />
          <Kpi label="Open claims" value={String(claims.filter(c => c.status === 'Processing').length)} icon={<FileText className="w-[18px] h-[18px]" />} state="info" />
          <Kpi label="Next premium due" value={dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} small icon={<Calendar className="w-[18px] h-[18px]" />} state="neutral" />
        </div>

        {/* ───── BODY ───── */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-5 items-start">
          {/* SIDEBAR */}
          <aside className="flex flex-col gap-3">
            <Micro className="px-1">Your policies</Micro>
            {list.map(p => {
              const st = policyStatusState[p.status] || 'neutral';
              const a = accentFor(p.category);
              const active = p.id === activeId;
              return (
                <button key={p.id} onClick={() => { setActiveId(p.id); setTab('Overview'); }}
                  className="text-left rounded-xl p-4 transition-all bg-white"
                  style={{ border: active ? `1.5px solid ${a.main}` : T.cardBorder, boxShadow: active ? `0 4px 14px -8px ${tint(a.main, .5)}` : T.cardShadow }}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span style={{ width: 3, height: 16, borderRadius: 2, background: a.main }} />
                      <span className="text-[12.5px] font-bold" style={{ color: T.ink }}>{p.code}</span>
                    </div>
                    <Pill state={st}>{p.status}</Pill>
                  </div>
                  <div className="text-[13px] mt-2 font-medium" style={{ color: T.sub }}>{p.title}</div>
                  <div className="flex justify-between items-center mt-2.5">
                    <Micro>{p.category} · due {new Date(p.renewalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</Micro>
                    <span className="font-bold text-[13px]" style={{ color: a.main }}>UGX {fmtUGX(p.premium)}</span>
                  </div>
                </button>
              );
            })}
            <button onClick={onBuyInsurance} className="w-full bg-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition hover:bg-slate-50"
              style={{ border: `1.5px dashed ${T.line}`, color: T.ink }}>
              <Plus className="w-4 h-4" /> Add new policy
            </button>
          </aside>

          {/* MAIN PANEL */}
          <div className="min-w-0">
            {/* policy heading + tabs */}
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span style={{ width: 5, height: 30, borderRadius: 3, background: acc.main }} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-extrabold" style={{ color: T.ink }}>{pol.title}</h2>
                    <Pill state={policyStatusState[pol.status] || 'neutral'}>{pol.status}</Pill>
                  </div>
                  <Micro className="mt-0.5">{pol.category} · {pol.code}</Micro>
                </div>
              </div>
              <PrimaryBtn accent={acc.main} onClick={() => fire('Certificate downloaded')} className="!py-2.5 flex items-center gap-2">
                <Download className="w-4 h-4" /> Proof of cover
              </PrimaryBtn>
            </div>

            <div className="flex gap-1.5 mb-5 flex-wrap">
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="text-[13.5px] font-semibold px-4 py-2 rounded-lg transition"
                  style={tab === t ? { background: acc.main, color: '#fff' } : { color: T.sub, background: T.card, border: T.cardBorder }}>
                  {t}
                </button>
              ))}
            </div>

            {/* ─── OVERVIEW ─── */}
            {tab === 'Overview' && (
              <div className="space-y-4">
                {dueSoon && <RenewalBanner days={daysToDue} amount={balance} accent={acc.main} onPay={() => setTab('Payments')} />}
                <div className="grid md:grid-cols-2 gap-4">
                  <Widget title="Policy snapshot" accent={acc.main}>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Policy no." value={pol.code} />
                      <Field label="Premium / yr" value={`UGX ${fmtUGX(pol.premium)}`} alignRight />
                      <Field label={cfg.assetLabel} value={pol.insuredItemName} />
                      <Field label="Sum insured" value={`UGX ${(pol.coverageAmount / 1_000_000).toFixed(0)}M`} alignRight />
                    </div>
                    <GhostBtn onClick={() => setTab('Policy')} className="w-full mt-4 !py-2.5">View full details</GhostBtn>
                  </Widget>

                  <Widget title="Payment & mandate" accent={acc.main} action={<Pill state={autopay ? 'ok' : 'danger'}>{autopay ? 'Auto-pay on' : 'Auto-pay off'}</Pill>}>
                    <div className="rounded-xl p-4" style={{ background: tint(acc.main, .05), border: `1px solid ${tint(acc.main, .12)}` }}>
                      <div className="flex justify-between items-start">
                        <div><Micro>{balance > 0 ? 'Balance due' : 'Next premium'}</Micro><div className="text-2xl font-extrabold mt-1" style={{ color: acc.main }}>UGX {fmtUGX(balance > 0 ? balance : total)}</div></div>
                        <div className="text-right"><Micro>Due</Micro><div className="text-sm font-bold mt-1" style={{ color: T.ink }}>{dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: autopay ? S.ok.fg : S.danger.fg }} />
                      <span className="text-xs font-semibold" style={{ color: autopay ? S.ok.fg : S.danger.fg }}>{autopay ? 'Direct debit active · Ecobank ****4292' : 'Direct debit inactive'}</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <PrimaryBtn accent={acc.main} onClick={() => setShowPay(true)} className="flex-1">Pay now</PrimaryBtn>
                      <GhostBtn onClick={() => setTab('Payments')} className="flex-1">Manage</GhostBtn>
                    </div>
                  </Widget>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {cfg.showClaims && (
                    <Widget title="Claims" accent={acc.main} action={<PrimaryBtn accent={acc.main} onClick={() => { setTab('Claims'); setShowClaim(true); }} className="!px-3 !py-1.5 !text-xs flex items-center gap-1"><Plus className="w-3 h-3" />File</PrimaryBtn>}>
                      {polClaims.length ? polClaims.slice(0, 2).map(c => <ClaimRow key={c.id} claim={c} accent={acc.main} />)
                        : <EmptyState icon={<FileText className="w-5 h-5" />} text={`No claims on this policy. Report ${cfg.claimNoun} anytime.`} />}
                    </Widget>
                  )}
                  <Widget title="Quick actions" accent={acc.main}>
                    <div className="grid grid-cols-2 gap-2.5">
                      <Action accent={acc.main} icon={<Download className="w-4 h-4" />} label="Proof of cover" onClick={() => fire('Certificate downloaded')} />
                      <Action accent={acc.main} icon={<RefreshCw className="w-4 h-4" />} label="Renew policy" onClick={() => setTab('Payments')} />
                      {cfg.showClaims && <Action accent={acc.main} icon={<FileText className="w-4 h-4" />} label="File a claim" onClick={() => { setTab('Claims'); setShowClaim(true); }} />}
                      <Action accent={acc.main} icon={<MessageCircle className="w-4 h-4" />} label="Get support" onClick={() => setTab('Support')} />
                    </div>
                  </Widget>
                </div>
              </div>
            )}

            {/* ─── POLICY ─── */}
            {tab === 'Policy' && (
              <div className="space-y-4">
                <Widget title="Policy details" accent={acc.main} action={<button onClick={() => fire('Certificate downloaded')} className="text-xs font-bold flex items-center gap-1" style={{ color: acc.main }}><Download className="w-3.5 h-3.5" />Certificate</button>}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4">
                    <Field label="Policy no." value={pol.code} />
                    <Field label="Underwriter" value={pol.title.split(' ')[0]} />
                    <Field label="Status" value={pol.status} />
                    <Field label={cfg.assetLabel} value={pol.insuredItemName} />
                    <Field label="Sum insured" value={`UGX ${(pol.coverageAmount / 1_000_000).toFixed(0)}M`} />
                    <Field label="Premium / yr" value={`UGX ${fmtUGX(pol.premium)}`} />
                    <Field label="Cover start" value="01 Jun 2025" />
                    <Field label="Renews on" value={dueStr} />
                    <Field label="Auto-renewal" value={autopay ? 'On' : 'Off'} />
                  </div>
                </Widget>

                {cfg.showCoverage && (
                  <Widget title="Coverage highlights" accent={acc.main}>
                    <div className="space-y-3.5">
                      {[{ n: 'Third Party Liability', p: 100 }, { n: 'Own Damage', p: 85 }, { n: 'Theft Protection', p: 90 }, { n: 'Roadside Assist', p: 60 }].map(x => (
                        <div key={x.n}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-sm font-semibold" style={{ color: T.ink }}>{x.n}</span>
                            <span className="text-xs font-bold" style={{ color: acc.main }}>{x.p}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: T.soft }}>
                            <div className="h-full rounded-full" style={{ width: `${x.p}%`, background: acc.main }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Widget>
                )}

                {cfg.showBeneficiary && (
                  <Widget title="Beneficiaries" accent={acc.main} action={<button onClick={() => fire('Beneficiary form opened')} className="text-xs font-bold" style={{ color: acc.main }}>Update</button>}>
                    <div className="space-y-2.5">
                      {[{ n: 'John Doe', r: 'Spouse', s: '60%' }, { n: 'Mary Doe', r: 'Child', s: '40%' }].map(b => (
                        <div key={b.n} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ border: T.cardBorder }}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: tint(acc.main, .1), color: acc.main }}>{b.n.charAt(0)}</div>
                            <div><div className="text-sm font-bold" style={{ color: T.ink }}>{b.n}</div><Micro>{b.r}</Micro></div>
                          </div>
                          <span className="font-extrabold" style={{ color: acc.main }}>{b.s}</span>
                        </div>
                      ))}
                    </div>
                  </Widget>
                )}
              </div>
            )}

            {/* ─── CLAIMS ─── */}
            {tab === 'Claims' && (
              <div className="space-y-4">
                <Widget title="File a claim" accent={acc.main}>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-sm max-w-md" style={{ color: T.sub }}>Report {cfg.claimNoun} with photos and documents. Most {pol.category} claims are reviewed within 48 hours.</p>
                    <PrimaryBtn accent={acc.main} onClick={() => setShowClaim(true)} className="flex items-center gap-2 whitespace-nowrap"><Plus className="w-4 h-4" />New claim</PrimaryBtn>
                  </div>
                </Widget>
                <Widget title="Your claims" accent={acc.main}>
                  {polClaims.length ? (
                    <div className="space-y-3">
                      {polClaims.map(c => (
                        <div key={c.id} className="rounded-xl p-4" style={{ border: T.cardBorder }}>
                          <div className="flex justify-between items-start">
                            <div><div className="text-sm font-bold" style={{ color: T.ink }}>{c.description || 'Claim'}</div><Micro className="mt-0.5">{c.dateSubmitted} · {c.policyTitle}</Micro></div>
                            <div className="text-right"><div className="font-bold" style={{ color: acc.main }}>UGX {fmtUGX(c.estimatedPayout)}</div><div className="mt-1"><Pill state={claimStatusState[c.status] || 'neutral'}>{c.status}</Pill></div></div>
                          </div>
                          <ClaimTimeline status={c.status} accent={acc.main} />
                        </div>
                      ))}
                    </div>
                  ) : <EmptyState icon={<FileText className="w-6 h-6" />} text="No claims yet. When you file one, you'll track its full status here." />}
                </Widget>
              </div>
            )}

            {/* ─── PAYMENTS ─── */}
            {tab === 'Payments' && (
              <div className="space-y-4">
                {dueSoon && <RenewalBanner days={daysToDue} amount={balance} accent={acc.main} onPay={() => setShowPay(true)} />}

                <div className="grid md:grid-cols-2 gap-4 items-start">
                  {/* IHK Pay-Bill widget */}
                  <Widget title="Pay premium" accent={acc.main} action={<Pill state={balance > 0 ? 'warn' : 'ok'}>{balance > 0 ? 'Partially paid' : 'Paid in full'}</Pill>}>
                    {balance > 0 ? (
                      <>
                        <div className="rounded-xl p-4" style={{ background: tint(acc.main, .05), border: `1px solid ${tint(acc.main, .12)}` }}>
                          <div className="flex justify-between text-[13px]"><span style={{ color: T.sub }}>Total amount</span><span className="font-bold" style={{ color: T.ink }}>UGX {fmtUGX(total)}</span></div>
                          <div className="flex justify-between text-[13px] mt-1.5"><span style={{ color: T.sub }}>Amount paid</span><span className="font-bold" style={{ color: S.ok.fg }}>− UGX {fmtUGX(paid)}</span></div>
                          <div className="border-t my-3" style={{ borderColor: tint(acc.main, .12) }} />
                          <Micro>Balance due</Micro>
                          <div className="text-2xl font-extrabold mt-0.5" style={{ color: acc.main }}>UGX {fmtUGX(balance)}</div>
                          <div className="h-2 rounded-full overflow-hidden mt-3" style={{ background: tint(acc.main, .12) }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: acc.main }} />
                          </div>
                          <div className="text-[11px] font-semibold mt-1.5" style={{ color: T.sub }}>{pct}% paid</div>
                        </div>
                        <Micro className="mt-4 mb-1.5">Amount to pay</Micro>
                        <div className="flex gap-2">
                          <div className="flex flex-1 rounded-lg overflow-hidden" style={{ border: `1px solid ${T.line}` }}>
                            <span className="px-3 py-2.5 text-xs font-bold" style={{ background: T.soft, color: acc.main }}>UGX</span>
                            <input defaultValue={fmtUGX(balance)} className="flex-1 px-3 py-2.5 text-sm outline-none min-w-0" style={{ color: T.ink }} />
                          </div>
                        </div>
                        <PrimaryBtn accent={acc.main} onClick={() => setShowPay(true)} className="w-full mt-3">Pay UGX {fmtUGX(balance)}</PrimaryBtn>
                      </>
                    ) : (
                      <div className="rounded-xl p-5 text-center" style={{ background: tint(acc.main, .05), border: `1px solid ${tint(acc.main, .12)}` }}>
                        <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ background: S.ok.bg, color: S.ok.fg }}><Check className="w-6 h-6" /></div>
                        <div className="text-sm font-bold mt-3" style={{ color: T.ink }}>Premium paid in full</div>
                        <div className="text-2xl font-extrabold mt-1" style={{ color: acc.main }}>UGX {fmtUGX(total)}</div>
                        <div className="flex justify-center gap-6 mt-3">
                          <div><Micro>Reference</Micro><div className="text-xs font-bold mt-0.5" style={{ color: T.ink }}>{pol.code}</div></div>
                          <div><Micro>Paid on</Micro><div className="text-xs font-bold mt-0.5" style={{ color: T.ink }}>31 May 2026</div></div>
                        </div>
                        <GhostBtn onClick={() => fire('Invoice downloaded')} className="mt-4 !py-2.5">View invoice</GhostBtn>
                      </div>
                    )}
                  </Widget>

                  {/* Mandate */}
                  <Widget title="Direct debit mandate" accent={acc.main} action={<Pill state={autopay ? 'ok' : 'danger'}>{autopay ? 'Active' : 'Inactive'}</Pill>}>
                    <div className="flex items-center gap-3 rounded-xl p-4" style={{ border: T.cardBorder }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: tint(acc.main, .08), color: acc.main }}><CreditCard className="w-5 h-5" /></div>
                      <div className="flex-1"><div className="text-sm font-bold" style={{ color: T.ink }}>Ecobank ****4292</div><Micro className="!normal-case !tracking-normal mt-0.5">{autopay ? `Charges UGX ${fmtUGX(total)} yearly` : 'No active mandate'}</Micro></div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-semibold" style={{ color: T.ink }}>Auto-pay renewals</span>
                      <button onClick={() => { setAutopay(a => !a); fire(autopay ? 'Auto-pay turned off' : 'Auto-pay turned on'); }} className="w-12 h-7 rounded-full transition relative" style={{ background: autopay ? acc.main : '#cbd5e1' }}>
                        <span className="absolute top-1 w-5 h-5 bg-white rounded-full transition-all" style={{ left: autopay ? '26px' : '4px' }} />
                      </button>
                    </div>
                    <p className="text-xs mt-3 leading-relaxed" style={{ color: T.sub }}>We'll settle your renewal automatically so your cover never lapses by accident.</p>
                  </Widget>
                </div>

                {/* Installments */}
                <Widget title="Can't pay in full?" accent={acc.main}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: S.warn.bg, color: S.warn.fg }}><Repeat className="w-5 h-5" /></div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed" style={{ color: T.sub }}>Spread your premium with <b style={{ color: T.ink }}>Ecobank Premium Financing</b> — keep your cover active even in a tight month.</p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {[3, 6, 12].map(m => (
                          <button key={m} onClick={() => fire(`Installment plan: ${m} × UGX ${fmtUGX(Math.round(total / m))}`)} className="rounded-lg px-4 py-2.5 text-left transition hover:bg-slate-50" style={{ border: T.cardBorder }}>
                            <Micro>{m} months</Micro>
                            <div className="text-sm font-bold mt-0.5" style={{ color: acc.main }}>UGX {fmtUGX(Math.round(total / m))}<span className="text-xs font-medium" style={{ color: T.muted }}>/mo</span></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Widget>

                {/* Payment history */}
                <Widget title="Payment history" accent={acc.main}>
                  <div className="space-y-2.5">
                    {payHistory.map((h, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ border: T.cardBorder }}>
                        <div>
                          <div className="text-sm font-bold" style={{ color: T.ink }}>{h.date}</div>
                          <div className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: T.muted }}><span className="w-3.5 h-3.5 rounded-[3px] bg-[#ED1C24] inline-block" />{h.acct}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {h.ok ? <span className="font-bold" style={{ color: S.ok.fg }}>UGX {fmtUGX(h.amount)}</span>
                            : <span className="font-bold line-through" style={{ color: S.danger.fg }}>UGX {fmtUGX(h.amount)}</span>}
                          <button onClick={() => fire(h.ok ? 'Receipt downloaded' : 'Payment failed — no receipt')} style={{ color: T.muted }} className="hover:opacity-70"><Download className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Widget>
              </div>
            )}

            {/* ─── SUPPORT ─── */}
            {tab === 'Support' && (
              <div className="space-y-4">
                <Widget title="Contact support" accent={acc.main}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <SupportCard accent={acc.main} icon={<MessageCircle className="w-5 h-5" />} title="Live chat" sub="Avg. reply < 2 min" onClick={() => fire('Opening live chat…')} />
                    <SupportCard accent={acc.main} icon={<Phone className="w-5 h-5" />} title="Call us" sub="0800 100 200 · 24/7" onClick={() => fire('Calling 0800 100 200…')} />
                    <SupportCard accent={acc.main} icon={<MessageCircle className="w-5 h-5" />} title="WhatsApp" sub="+256 700 000 000" onClick={() => fire('Opening WhatsApp…')} />
                    <SupportCard accent={acc.main} icon={<Mail className="w-5 h-5" />} title="Email" sub="care@ecobank.com" onClick={() => fire('Opening email…')} />
                  </div>
                </Widget>
                <Widget title="Common questions" accent={acc.main}>
                  <div>
                    {['How do I file a claim?', 'When is my premium due?', 'How do I update my direct debit?', 'How do I download my certificate?'].map((q, i, arr) => (
                      <button key={q} onClick={() => fire('Opening help article…')} className="w-full flex items-center justify-between py-3.5 text-left" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${T.lineSoft}` : 'none' }}>
                        <span className="text-sm font-medium" style={{ color: T.sub }}>{q}</span>
                        <ChevronRight className="w-4 h-4" style={{ color: T.muted }} />
                      </button>
                    ))}
                  </div>
                </Widget>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {showClaim && <FileClaimModal policy={pol} accent={acc.main} onClose={() => setShowClaim(false)} onSubmit={(c) => { onAddClaim(c); setShowClaim(false); fire('Claim submitted — track it under Claims'); }} />}
      {showPay && <PayModal policy={pol} amount={balance > 0 ? balance : total} accent={acc.main} onClose={() => setShowPay(false)} onPaid={() => { setShowPay(false); fire('Payment successful'); }} />}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5" style={{ background: T.ink }}>
          <CheckCircle2 className="w-4 h-4" style={{ color: T.teal }} /> <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
}

/* ════════════════ Sub-components ════════════════ */

function Kpi({ label, value, icon, state, small }: { label: string; value: string; icon: React.ReactNode; state: StateKey; small?: boolean }) {
  const c = S[state];
  return (
    <div className="flex items-center justify-between p-4" style={{ background: T.card, border: T.cardBorder, boxShadow: T.cardShadow, borderRadius: T.radius }}>
      <div>
        <Micro>{label}</Micro>
        <div className={`font-extrabold mt-1 ${small ? 'text-lg' : 'text-[28px] leading-none'}`} style={{ color: small ? T.ink : c.fg }}>{value}</div>
      </div>
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: c.bg, color: c.fg }}>{icon}</div>
    </div>
  );
}

function RenewalBanner({ days, amount, accent, onPay }: { days: number; amount: number; accent: string; onPay: () => void }) {
  const overdue = days < 0;
  const c = overdue ? S.danger : S.warn;
  return (
    <div className="rounded-xl p-4 flex items-center gap-3 flex-wrap" style={{ background: c.bg, border: `1px solid ${c.bd}` }}>
      <AlertTriangle className="w-5 h-5 shrink-0" style={{ color: c.fg }} />
      <div className="flex-1 min-w-[180px]">
        <div className="text-sm font-bold" style={{ color: c.fg }}>{overdue ? `Premium overdue by ${Math.abs(days)} days` : `Renewal due in ${days} days`}</div>
        <div className="text-xs mt-0.5" style={{ color: T.sub }}>Pay UGX {fmtUGX(amount)} to keep your cover active and avoid a lapse.</div>
      </div>
      <PrimaryBtn accent={accent} onClick={onPay} className="!py-2.5 whitespace-nowrap">Pay now</PrimaryBtn>
    </div>
  );
}

function ClaimRow({ claim, accent }: { claim: Claim; accent: string }) {
  return (
    <div className="rounded-xl p-3 flex justify-between items-start mb-2 last:mb-0" style={{ border: T.cardBorder }}>
      <div><div className="text-xs font-bold" style={{ color: T.ink }}>{claim.dateSubmitted}</div><Micro className="mt-0.5">{(claim.description || claim.policyTitle).slice(0, 26)}</Micro></div>
      <div className="text-right"><div className="text-sm font-bold" style={{ color: accent }}>UGX {fmtUGX(claim.estimatedPayout)}</div><div className="mt-1"><Pill state={claimStatusState[claim.status] || 'neutral'}>{claim.status}</Pill></div></div>
    </div>
  );
}

function Action({ icon, label, accent, onClick }: { icon: React.ReactNode; label: string; accent: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 rounded-xl px-3 py-3 transition hover:bg-slate-50 text-left" style={{ border: T.cardBorder }}>
      <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: tint(accent, .08), color: accent }}>{icon}</span>
      <span className="text-sm font-semibold" style={{ color: T.ink }}>{label}</span>
    </button>
  );
}

function SupportCard({ icon, title, sub, accent, onClick }: { icon: React.ReactNode; title: string; sub: string; accent: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 rounded-xl p-4 transition hover:bg-slate-50 text-left" style={{ border: T.cardBorder }}>
      <span className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ background: tint(accent, .08), color: accent }}>{icon}</span>
      <div><div className="text-sm font-bold" style={{ color: T.ink }}>{title}</div><Micro className="!normal-case !tracking-normal mt-0.5">{sub}</Micro></div>
    </button>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center text-center py-6 px-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: T.soft, color: T.muted }}>{icon}</div>
      <p className="text-sm max-w-xs" style={{ color: T.sub }}>{text}</p>
    </div>
  );
}

/* Modals */

function FileClaimModal({ policy, accent, onClose, onSubmit }: { policy: Policy; accent: string; onClose: () => void; onSubmit: (c: Claim) => void }) {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  return (
    <Overlay onClose={onClose} title="File a claim">
      <div className="space-y-4">
        <Micro>{policy.title} · {policy.code}</Micro>
        <Labeled label="What happened?">
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Describe the incident…" className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={{ border: `1px solid ${T.line}` }} />
        </Labeled>
        <Labeled label="Estimated amount (UGX)">
          <input value={amount} onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" style={{ border: `1px solid ${T.line}` }} />
        </Labeled>
        <div className="rounded-lg py-6 text-center text-sm" style={{ border: `1.5px dashed ${T.line}`, color: T.muted }}>
          <Download className="w-5 h-5 mx-auto mb-1.5 rotate-180" /> Drag photos & documents here
        </div>
        <PrimaryBtn accent={accent} disabled={!desc} className="w-full"
          onClick={() => onSubmit({ id: `clm-${Date.now()}`, policyId: policy.id, category: policy.category, policyTitle: policy.title, description: desc, dateSubmitted: new Date('2026-06-28').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), status: 'Processing', estimatedPayout: parseInt(amount) || 0 })}>
          Submit claim
        </PrimaryBtn>
      </div>
    </Overlay>
  );
}

function PayModal({ policy, amount, accent, onClose, onPaid }: { policy: Policy; amount: number; accent: string; onClose: () => void; onPaid: () => void }) {
  const [paying, setPaying] = useState(false);
  return (
    <Overlay onClose={onClose} title="Confirm payment">
      <div className="space-y-4">
        <div className="rounded-xl p-4" style={{ background: T.bg, border: T.cardBorder }}>
          <div className="flex justify-between"><span className="text-sm" style={{ color: T.sub }}>{policy.title}</span><span className="text-sm font-bold" style={{ color: T.ink }}>UGX {fmtUGX(amount)}</span></div>
          <div className="flex justify-between mt-2"><span className="text-sm" style={{ color: T.sub }}>Pay from</span><span className="text-sm font-bold" style={{ color: T.ink }}>Ecobank ****4292</span></div>
        </div>
        <PrimaryBtn accent={accent} disabled={paying} className="w-full flex items-center justify-center gap-2" onClick={() => { setPaying(true); setTimeout(onPaid, 1200); }}>
          {paying ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</> : <>Pay UGX {fmtUGX(amount)}</>}
        </PrimaryBtn>
      </div>
    </Overlay>
  );
}

function Overlay({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,.45)', fontFamily: T.font }} onClick={onClose}>
      <div className="bg-white w-full max-w-md p-6" style={{ borderRadius: 16 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-extrabold" style={{ color: T.ink }}>{title}</h3>
          <button onClick={onClose} style={{ color: T.muted }}><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold block mb-1.5" style={{ color: T.ink }}>{label}</label>
      {children}
    </div>
  );
}
