import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Bell,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  Download,
  FileCheck2,
  FileText,
  Headset,
  History,
  LogOut,
  MessageCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  Trophy,
  UploadCloud,
  Users,
} from 'lucide-react';
import { User } from '../types';

interface AgentDashboardProps {
  user: User | null;
  onLogout: () => void;
  onStartCustomerQuote: () => void;
}

type PolicyStatus = 'ACTIVE' | 'RENEWAL' | 'EXCEPTION' | 'LAPSE_RISK';
type PipelineStage = 'Lead' | 'Quoted' | 'Application' | 'Bound';

const clients = [
  {
    name: 'Sarah Namukasa',
    segment: 'Personal banking',
    country: 'Uganda',
    kyc: 'Verified',
    nextAction: 'Confirm vehicle use and send renewal quote',
    recommended: 'Motor comprehensive renewal',
    policies: 2,
    claims: 2,
    premiums: 'UGX 505,000',
    lastContact: '19 Jun 2026',
  },
  {
    name: 'Kintu Logistics Ltd',
    segment: 'SME fleet',
    country: 'Uganda',
    kyc: 'Needs director consent',
    nextAction: 'Resolve IPF mandate and marine declaration',
    recommended: 'Marine open cover + liability top-up',
    policies: 3,
    claims: 3,
    premiums: 'UGX 890,000',
    lastContact: '17 Jun 2026',
  },
  {
    name: 'Nile Engineering Ltd',
    segment: 'Commercial',
    country: 'Uganda',
    kyc: 'Progressive profile',
    nextAction: 'Upload wage return and project values',
    recommended: 'Engineering all-risk renewal',
    policies: 2,
    claims: 2,
    premiums: 'UGX 910,000',
    lastContact: '15 Jun 2026',
  },
  {
    name: 'Pearl Aviation Services',
    segment: 'Specialty',
    country: 'Uganda',
    kyc: 'Exception review',
    nextAction: 'Collect pilot licence renewals',
    recommended: 'Aviation hull and liability renewal',
    policies: 1,
    claims: 1,
    premiums: 'UGX 625,000',
    lastContact: '12 Jun 2026',
  },
];

const policies = [
  { id: 'POL-110023', client: 'Sarah Namukasa', product: 'Motor Insurance', premium: 'UGX 320,000', due: '24 Jun 2026', status: 'RENEWAL' as PolicyStatus, channel: 'RM assisted', insurer: 'Britam', commissionRate: 12 },
  { id: 'POL-110041', client: 'Sarah Namukasa', product: 'Personal Accident', premium: 'UGX 185,000', due: '20 Jul 2026', status: 'ACTIVE' as PolicyStatus, channel: 'Mobile app', insurer: 'Old Mutual', commissionRate: 15 },
  { id: 'POL-110055', client: 'Kintu Logistics Ltd', product: 'Marine Insurance', premium: 'UGX 250,000', due: '28 Jun 2026', status: 'LAPSE_RISK' as PolicyStatus, channel: 'Agent network', insurer: 'UAP', commissionRate: 10 },
  { id: 'POL-110039', client: 'Kintu Logistics Ltd', product: 'Liability Insurance', premium: 'UGX 430,000', due: '03 Jul 2026', status: 'ACTIVE' as PolicyStatus, channel: 'Branch', insurer: 'Britam', commissionRate: 12 },
  { id: 'POL-110088', client: 'Nile Engineering Ltd', product: 'Engineering Insurance', premium: 'UGX 440,000', due: '30 Jun 2026', status: 'EXCEPTION' as PolicyStatus, channel: 'RM assisted', insurer: 'Sanlam', commissionRate: 8 },
  { id: 'POL-109988', client: 'Nile Engineering Ltd', product: 'Workers Compensation', premium: 'UGX 470,000', due: '08 Jul 2026', status: 'RENEWAL' as PolicyStatus, channel: 'Internet banking', insurer: 'Britam', commissionRate: 10 },
  { id: 'POL-110130', client: 'Pearl Aviation Services', product: 'Aviation Insurance', premium: 'UGX 625,000', due: '30 Jun 2026', status: 'EXCEPTION' as PolicyStatus, channel: 'RM assisted', insurer: 'Specialty pool', commissionRate: 7 },
];

const claims = [
  { id: 'CLM-4421', client: 'Sarah Namukasa', policy: 'POL-110023', product: 'Motor Insurance', value: 'UGX 4,800,000', status: 'Pending', evidence: 'Police abstract, photos, repair estimate' },
  { id: 'CLM-4310', client: 'Grace Atwine', policy: 'POL-110078', product: 'Fire Insurance', value: 'UGX 12,500,000', status: 'Under Review', evidence: 'Inventory, survey report, photos' },
  { id: 'CLM-4210', client: 'Nile Engineering Ltd', policy: 'POL-110088', product: 'Engineering Insurance', value: 'UGX 14,300,000', status: 'Pending', evidence: 'Incident report, site photos, repair quote' },
];

const queue = [
  { label: 'KYC prefill', value: '42', detail: 'applications ready from bank profile', tone: 'good' },
  { label: 'Underwriting exceptions', value: '9', detail: 'market/product rules need review', tone: 'warn' },
  { label: 'Payment retries', value: '17', detail: 'standing order or card retry pending', tone: 'warn' },
  { label: 'Commission checks', value: 'UGX 8.4M', detail: 'awaiting source validation', tone: 'good' },
];

const pipelineLeads: { name: string; product: string; stage: PipelineStage; value: string }[] = [
  { name: 'David Okello', product: 'Motor Comprehensive', stage: 'Lead', value: 'UGX 380,000' },
  { name: 'Faith Akello', product: 'Home Insurance', stage: 'Quoted', value: 'UGX 520,000' },
  { name: 'Mukasa Trading Co.', product: 'Fire & Burglary', stage: 'Application', value: 'UGX 750,000' },
  { name: 'Lake Victoria Ferries', product: 'Marine Hull', stage: 'Bound', value: 'UGX 1,200,000' },
  { name: 'Amina Nassali', product: 'Personal Accident', stage: 'Quoted', value: 'UGX 185,000' },
  { name: 'Kampala Traders Ltd', product: 'Goods in Transit', stage: 'Lead', value: 'UGX 410,000' },
  { name: 'Green Farms Uganda', product: 'Crop Insurance', stage: 'Application', value: 'UGX 620,000' },
];

const pipelineStages: PipelineStage[] = ['Lead', 'Quoted', 'Application', 'Bound'];

const stageColors: Record<PipelineStage, string> = {
  Lead: 'bg-slate-100 text-slate-700 border-slate-200',
  Quoted: 'bg-sky-50 text-sky-700 border-sky-200',
  Application: 'bg-amber-50 text-amber-700 border-amber-200',
  Bound: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function parsePremium(str: string): number {
  return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
}

function formatUGX(amount: number): string {
  return 'UGX ' + amount.toLocaleString('en-UG');
}

function statusClass(status: string) {
  if (status === 'ACTIVE' || status === 'Verified') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'RENEWAL' || status === 'Pending') return 'bg-sky-50 text-sky-700 border-sky-200';
  if (status === 'LAPSE_RISK' || status === 'Under Review') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
}

function Panel({ title, eyebrow, action, children, className = '' }: {
  title: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white border border-slate-200 rounded-xl ${className}`}>
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100">
        <div>
          {eyebrow ? <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p> : null}
          <h2 className="text-base font-extrabold text-slate-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function AgentDashboard({ user, onLogout, onStartCustomerQuote }: AgentDashboardProps) {
  const [activeClient, setActiveClient] = useState(clients[0].name);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activePolicy, setActivePolicy] = useState(policies[0].id);

  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(client =>
      client.name.toLowerCase().includes(q) ||
      client.segment.toLowerCase().includes(q) ||
      client.recommended.toLowerCase().includes(q)
    );
  }, [query]);

  const selectedClient = clients.find(client => client.name === activeClient) || clients[0];
  const clientPolicies = policies.filter(policy => policy.client === selectedClient.name);
  const selectedPolicy = policies.find(policy => policy.id === activePolicy) || clientPolicies[0] || policies[0];
  const selectedClaims = claims.filter(claim => claim.policy === selectedPolicy.id || claim.client === selectedClient.name);
  const roleLabel = user?.role === 'admin' ? 'Admin' : user?.role === 'ops' ? 'Operations' : 'RM / Agent';

  const totalCommission = policies.reduce((sum, p) => {
    const premium = parsePremium(p.premium);
    return sum + Math.round(premium * p.commissionRate / 100);
  }, 0);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#004260] text-white flex items-center justify-center">
              <Headset className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-slate-400">{roleLabel} workspace</p>
              <h1 className="text-xl font-black text-[#004260]">Assisted Bancassurance Cockpit</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onStartCustomerQuote}
              className="h-10 px-4 rounded-lg bg-[#004260] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#003350] transition-colors"
            >
              Start assisted quote <ArrowRight className="w-4 h-4" />
            </button>
            <button className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 flex items-center gap-2 hover:border-[#004260]/40 transition-colors">
              <Bell className="w-4 h-4" /> Escalations
            </button>
            <div className="h-10 px-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#004260]/10 text-[#004260] flex items-center justify-center font-black text-xs">{user?.name?.charAt(0) || 'J'}</span>
              <div className="hidden sm:block leading-tight">
                <p className="text-xs font-bold">{user?.name || 'Jane Doe'}</p>
                <p className="text-[10px] text-slate-500">{user?.email || 'jane.doe@ecobank.com'}</p>
              </div>
            </div>
            <button onClick={onLogout} className="h-10 w-10 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-200 flex items-center justify-center transition-colors" title="Log out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Performance Summary */}
        <Panel title="Agent Performance" eyebrow="Monthly summary">
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-[#004260]">
                <FileCheck2 className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Policies sold this month</span>
              </div>
              <p className="text-2xl font-black mt-2">7</p>
              <p className="text-xs text-slate-500 mt-1">across 4 clients</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-[#00C58F]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Conversion rate</span>
              </div>
              <p className="text-2xl font-black mt-2">57%</p>
              <p className="text-xs text-slate-500 mt-1">4 of 7 leads converted</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-amber-600">
                <Trophy className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Rank among agents</span>
              </div>
              <p className="text-2xl font-black mt-2">#3</p>
              <p className="text-xs text-slate-500 mt-1">of 18 active agents</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-[#004260]">
                <Banknote className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Total commission</span>
              </div>
              <p className="text-2xl font-black mt-2">{formatUGX(totalCommission)}</p>
              <p className="text-xs text-slate-500 mt-1">from {policies.length} active policies</p>
            </div>
          </div>
        </Panel>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {queue.map(item => (
            <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
                {item.tone === 'good' ? <CheckCircle2 className="w-4 h-4 text-[#00C58F]" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
              </div>
              <p className="text-2xl font-black mt-2">{item.value}</p>
              <p className="text-xs text-slate-500 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)_360px] gap-5 items-start">
          {/* Client Queue with drill-down */}
          <Panel title="Client Queue" eyebrow="Lead management" className="xl:sticky xl:top-24">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search clients or products"
                  className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-[#004260] focus:ring-2 focus:ring-[#004260]/10"
                />
              </div>
            </div>
            <div className="max-h-[620px] overflow-y-auto">
              {filteredClients.map(client => {
                const isExpanded = expandedClient === client.name;
                const clientPols = policies.filter(p => p.client === client.name);
                const clientClaims = claims.filter(c => c.client === client.name);

                return (
                  <div key={client.name} className={`border-b border-slate-100 ${activeClient === client.name ? 'bg-[#004260]/5' : ''}`}>
                    <button
                      onClick={() => {
                        setActiveClient(client.name);
                        setExpandedClient(isExpanded ? null : client.name);
                        const firstPolicy = policies.find(policy => policy.client === client.name);
                        if (firstPolicy) setActivePolicy(firstPolicy.id);
                      }}
                      className="w-full text-left px-4 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          {isExpanded
                            ? <ChevronDown className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            : <ChevronRight className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          }
                          <div>
                            <p className="font-extrabold text-sm text-slate-900">{client.name}</p>
                            <p className="text-xs text-slate-500">{client.segment} · {client.country}</p>
                          </div>
                        </div>
                        <span className={`shrink-0 border rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(client.kyc)}`}>{client.kyc}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-600 ml-6">{client.nextAction}</p>
                      <div className="mt-3 ml-6 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{client.policies} policies</span>
                        <span>{client.claims} claims</span>
                        <span>{client.premiums}</span>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 ml-6 space-y-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Last contact: {client.lastContact}</div>

                        {clientPols.length > 0 && (
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Policies</p>
                            {clientPols.map(p => (
                              <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
                                <div>
                                  <span className="font-bold text-slate-800">{p.product}</span>
                                  <span className="text-slate-400 ml-1">({p.id})</span>
                                </div>
                                <span className={`border rounded-full px-2 py-0.5 text-[9px] font-bold ${statusClass(p.status)}`}>{p.status.replace('_', ' ')}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {clientClaims.length > 0 && (
                          <div>
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Claims</p>
                            {clientClaims.map(c => (
                              <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-slate-50 text-xs">
                                <div>
                                  <span className="font-bold text-slate-800">{c.product}</span>
                                  <span className="text-slate-400 ml-1">{c.value}</span>
                                </div>
                                <span className={`border rounded-full px-2 py-0.5 text-[9px] font-bold ${statusClass(c.status)}`}>{c.status}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {clientClaims.length === 0 && (
                          <p className="text-xs text-slate-400 italic">No open claims</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>

          <div className="space-y-5">
            {/* Pipeline Stages */}
            <Panel title="Sales Pipeline" eyebrow="Lead to bound tracking">
              <div className="p-5">
                {/* Stage header bar */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {pipelineStages.map(stage => {
                    const count = pipelineLeads.filter(l => l.stage === stage).length;
                    return (
                      <div key={stage} className={`rounded-lg border px-3 py-2 text-center ${stageColors[stage]}`}>
                        <p className="text-xs font-black">{stage}</p>
                        <p className="text-lg font-black">{count}</p>
                      </div>
                    );
                  })}
                </div>
                {/* Stage flow arrow */}
                <div className="flex items-center justify-center gap-1 mb-4 text-slate-300">
                  {pipelineStages.map((stage, i) => (
                    <React.Fragment key={stage}>
                      <span className="text-[10px] font-bold text-slate-400">{stage}</span>
                      {i < pipelineStages.length - 1 && <ArrowRight className="w-3 h-3" />}
                    </React.Fragment>
                  ))}
                </div>
                {/* Leads list */}
                <div className="space-y-2">
                  {pipelineLeads.map(lead => (
                    <div key={lead.name} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.product} · {lead.value}</p>
                      </div>
                      <span className={`border rounded-full px-2.5 py-1 text-[10px] font-black ${stageColors[lead.stage]}`}>{lead.stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel
              title={`${selectedClient.name} Portfolio`}
              eyebrow="Policy, renewal, document, and payment context"
              action={<button className="text-xs font-bold text-[#004260] flex items-center gap-1">Download brief <Download className="w-4 h-4" /></button>}
            >
              <div className="p-5 grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5">
                <div className="space-y-3">
                  {clientPolicies.map(policy => (
                    <button
                      key={policy.id}
                      onClick={() => setActivePolicy(policy.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${selectedPolicy.id === policy.id ? 'border-[#004260] bg-[#004260]/5' : 'border-slate-200 bg-white hover:border-[#004260]/30'}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-black">{policy.id}</p>
                          <p className="text-xs text-slate-500">{policy.product} · {policy.insurer}</p>
                        </div>
                        <span className={`border rounded-full px-2.5 py-1 text-[10px] font-black ${statusClass(policy.status)}`}>{policy.status.replace('_', ' ')}</span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><span className="block text-slate-400">Premium</span><strong>{policy.premium}</strong></div>
                        <div><span className="block text-slate-400">Due</span><strong>{policy.due}</strong></div>
                        <div><span className="block text-slate-400">Channel</span><strong>{policy.channel}</strong></div>
                        <div><span className="block text-slate-400">Attribution</span><strong>{roleLabel}</strong></div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="rounded-xl bg-slate-900 text-white p-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-extrabold">Recommendation</p>
                  <h3 className="text-xl font-black mt-2">{selectedClient.recommended}</h3>
                  <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                    Use bank KYC, current policy data, and claim history to prepare a quote with minimum duplicate data entry.
                  </p>
                  <div className="mt-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between"><span className="text-slate-400">KYC source</span><strong>Ecobank profile</strong></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400">Consent</span><strong>Digital signature pending</strong></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400">Underwriting</span><strong>Rule review</strong></div>
                    <div className="flex items-center justify-between"><span className="text-slate-400">Payment option</span><strong>Debit/IPF eligible</strong></div>
                  </div>
                  <button onClick={onStartCustomerQuote} className="mt-6 w-full h-10 rounded-lg bg-[#00C58F] text-white text-xs font-black hover:bg-[#00a878] transition-colors">
                    Continue assisted application
                  </button>
                </div>
              </div>
            </Panel>

            <Panel title="Claims, FNOL & Evidence" eyebrow="Digital claims enablement">
              <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                {(selectedClaims.length ? selectedClaims : claims).slice(0, 3).map(claim => (
                  <div key={claim.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between">
                      <FileText className="w-5 h-5 text-[#004260]" />
                      <span className={`border rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass(claim.status)}`}>{claim.status}</span>
                    </div>
                    <p className="mt-3 font-black text-sm">{claim.id}</p>
                    <p className="text-xs text-slate-500">{claim.product} · {claim.value}</p>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">{claim.evidence}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5">
                <button className="w-full min-h-14 rounded-xl border border-dashed border-[#004260]/40 bg-[#004260]/5 text-[#004260] text-xs font-black flex items-center justify-center gap-2">
                  <UploadCloud className="w-4 h-4" /> Start FNOL or upload supporting evidence
                </button>
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Operational Control" eyebrow="Real-time dashboard">
              <div className="p-5 space-y-3">
                {[
                  ['Premiums captured', 'UGX 24.8M', <Banknote className="w-4 h-4 text-[#00C58F]" />],
                  ['Renewals at risk', '12 policies', <Clock className="w-4 h-4 text-amber-600" />],
                  ['Open claim tasks', '21 items', <MessageCircle className="w-4 h-4 text-sky-600" />],
                  ['Audit events today', '186 logs', <History className="w-4 h-4 text-slate-600" />],
                ].map(([label, value, icon]) => (
                  <div key={String(label)} className="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-100 px-4 py-3">
                    <div className="flex items-center gap-3">
                      {icon as React.ReactNode}
                      <span className="text-xs font-bold text-slate-600">{label}</span>
                    </div>
                    <strong className="text-sm">{value as string}</strong>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Commission Detail */}
            <Panel title="Commission Breakdown" eyebrow="Per-policy commission detail">
              <div className="p-5">
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 pb-1">
                    <span>Policy</span>
                    <span>Premium</span>
                    <span>Rate</span>
                    <span className="text-right">Earned</span>
                  </div>
                  {policies.map(p => {
                    const premium = parsePremium(p.premium);
                    const earned = Math.round(premium * p.commissionRate / 100);
                    return (
                      <div key={p.id} className="grid grid-cols-4 gap-2 items-center rounded-lg border border-slate-100 bg-slate-50 px-2 py-2 text-xs">
                        <div>
                          <p className="font-bold text-slate-800 truncate">{p.product}</p>
                          <p className="text-[10px] text-slate-400">{p.id}</p>
                        </div>
                        <span className="text-slate-700">{p.premium}</span>
                        <span className="text-slate-700">{p.commissionRate}%</span>
                        <span className="text-right font-bold text-[#00C58F]">{formatUGX(earned)}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between rounded-lg border border-[#004260]/20 bg-[#004260]/5 px-3 py-2 mt-2">
                    <span className="text-xs font-extrabold text-[#004260]">Total commission</span>
                    <span className="text-sm font-black text-[#004260]">{formatUGX(totalCommission)}</span>
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Payments & IPF" eyebrow="Collection orchestration">
              <div className="p-5 space-y-4">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black">{selectedPolicy.id}</p>
                    <CreditCard className="w-4 h-4 text-[#004260]" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{selectedPolicy.product} · {selectedPolicy.premium}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div><span className="block text-slate-400">Mandate</span><strong>Direct debit ready</strong></div>
                    <div><span className="block text-slate-400">Retry logic</span><strong>Enabled</strong></div>
                    <div><span className="block text-slate-400">IPF status</span><strong>Eligible</strong></div>
                    <div><span className="block text-slate-400">Next due</span><strong>{selectedPolicy.due}</strong></div>
                  </div>
                </div>
                <button className="w-full h-10 rounded-lg bg-[#004260] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#003350] transition-colors">
                  Review mandate or IPF plan <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </Panel>

            <Panel title="RFP Coverage In UI" eyebrow="What this screen demonstrates">
              <div className="p-5 space-y-3 text-xs text-slate-600">
                {[
                  ['RBAC/SSO', 'Role-based customer, agent, ops, and admin access points.'],
                  ['Assisted sales', 'RM-led discover, prefill, quote, issue, and service workflow.'],
                  ['KYC + exceptions', 'Prefill status, consent gaps, and underwriting case review.'],
                  ['Revenue assurance', 'Commission, attribution, audit, and reconciliation indicators.'],
                  ['Self-service parity', 'Documents, renewals, claims, and payments mirror customer views.'],
                ].map(([label, body]) => (
                  <div key={label} className="flex gap-3">
                    <BadgeCheck className="w-4 h-4 text-[#00C58F] shrink-0 mt-0.5" />
                    <p><strong className="text-slate-900">{label}:</strong> {body}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Document Centre" eyebrow="Access-controlled repository">
              <div className="p-5 space-y-2">
                {['Policy schedule', 'Certificate of insurance', 'Claim evidence checklist', 'KYC consent record'].map(item => (
                  <button key={item} className="w-full flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-600 hover:border-[#004260]/40 hover:text-[#004260] transition-colors">
                    <span className="flex items-center gap-2"><FileCheck2 className="w-4 h-4" /> {item}</span>
                    <ShieldCheck className="w-4 h-4 text-[#00C58F]" />
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-[#004260] mt-0.5" />
            <div>
              <h2 className="font-black text-slate-900">Omnichannel handoff is ready</h2>
              <p className="text-sm text-slate-500">Continue this case from branch, RM desktop, mobile banking, internet banking, messaging, or USSD-lite assisted channels.</p>
            </div>
          </div>
          <button className="h-10 px-4 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:border-[#004260]/40 hover:text-[#004260] transition-colors">
            Send secure handoff link
          </button>
        </section>
      </main>
    </div>
  );
}
