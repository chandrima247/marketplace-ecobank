import React, { useState, useRef } from 'react';
import {
  Shield, CheckCircle, Clock, AlertTriangle, FileText, UploadCloud,
  Plus, Heart, Car, Smartphone, Coins, Briefcase,
  LayoutDashboard, ShoppingCart, ClipboardCheck, History, HelpCircle,
  Settings, LogOut, BadgeCheck, Bell, Search, UserCircle, PlusCircle,
  RefreshCw, Receipt, ArrowRight, CreditCard, X, File, ShieldCheck,
  Users, MessageCircle, Phone, Download, ChevronUp, ChevronDown,
  Eye, Pause, XCircle, MapPin, Mail, Globe, CalendarDays,
  Banknote, TrendingUp, Sparkles, ExternalLink, RotateCcw
} from 'lucide-react';
import { Policy, Claim, InsuranceCategory } from '../types';

interface DashboardProps {
  policies: Policy[];
  claims: Claim[];
  onAddClaim: (newClaim: Claim) => void;
  onRemovePolicy?: (id: string) => void;
  onBuyInsurance?: () => void;
  onLogout?: () => void;
  userName?: string;
}

/* ─── Reusable Widget Shell ─── */
function Widget({ title, accent = '#00C58F', badge, children, className = '' }: {
  title: string;
  accent?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-[#cbd5e1] bg-white overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="w-[3px] h-5 rounded-sm" style={{ background: accent }} />
          <span className="text-[15px] font-bold text-[#1e293b]">{title}</span>
        </div>
        {badge}
      </div>
      <div className="px-4 pb-4">
        {children}
      </div>
    </div>
  );
}

/* ─── Mini stat row ─── */
function MiniGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-3 pt-1">
      {items.map((item, i) => (
        <div key={i} className={i % 2 === 1 ? 'text-right' : ''}>
          <span className="block text-[11px] font-medium text-[#64748b] mb-0.5">{item.label}</span>
          <span className="block text-[13px] font-bold text-[#1e293b] leading-tight">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({
  policies,
  claims,
  onAddClaim,
  onRemovePolicy,
  onBuyInsurance,
  onLogout,
  userName = 'Chandrima Ghosh'
}: DashboardProps) {
  const [showFileClaim, setShowFileClaim] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Overview');
  const [activePolicyIdx, setActivePolicyIdx] = useState(0);

  const [selectedPolId, setSelectedPolId] = useState(policies[0]?.id || '');
  const [claimDesc, setClaimDesc] = useState('');
  const [claimValue, setClaimValue] = useState('');

  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!selectedPolId && policies.length > 0) setSelectedPolId(policies[0].id);
  }, [policies, selectedPolId]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };
  const processFile = (file: File) => {
    setUploadedFile({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` });
  };
  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolId) { alert('Please select an active policy.'); return; }
    if (!claimDesc.trim()) { alert('Please describe the incident.'); return; }
    if (!claimValue.trim() || isNaN(parseFloat(claimValue))) { alert('Enter a valid amount.'); return; }
    const linkedPolicy = policies.find(p => p.id === selectedPolId);
    if (!linkedPolicy) return;
    onAddClaim({
      id: `clm-${Date.now()}`, policyId: selectedPolId, category: linkedPolicy.category,
      policyTitle: linkedPolicy.title, description: claimDesc,
      dateSubmitted: new Date().toISOString().split('T')[0], status: 'Processing',
      estimatedPayout: parseFloat(claimValue), fileName: uploadedFile?.name,
      documentUrl: uploadedFile ? 'blob:mock' : undefined
    });
    setClaimDesc(''); setClaimValue(''); setUploadedFile(null); setShowFileClaim(false);
  };

  const getCategoryIcon = (cat: InsuranceCategory) => {
    const map: Record<string, React.ReactNode> = {
      Motor: <Car className="w-4 h-4" />, Health: <Heart className="w-4 h-4" />,
      Life: <Users className="w-4 h-4" />, Device: <Smartphone className="w-4 h-4" />,
      Travel: <Shield className="w-4 h-4" />, Agric: <Coins className="w-4 h-4" />,
      Forex: <Coins className="w-4 h-4" />, Business: <Briefcase className="w-4 h-4" />
    };
    return map[cat] || <Shield className="w-4 h-4" />;
  };

  const formatUGX = (usd: number) => {
    const ugx = usd * 3750;
    return ugx >= 1000000 ? `${(ugx / 1000000).toFixed(1)}M` : ugx.toLocaleString();
  };

  const activePol = policies[activePolicyIdx] || null;
  const policyClaims = activePol ? claims.filter(c => c.policyId === activePol.id) : claims;
  const filters = ['Overview', 'Policy', 'Claims', 'Payments', 'Documents'];

  /* ─── Widget builders ─── */

  const renderPolicyOverview = () => {
    if (!activePol) return null;
    return (
      <Widget title="Policy Overview" badge={
        <span className="text-[11px] font-bold text-[#047857] bg-white border border-[#10b981] px-3 py-1 rounded-md">
          {activePol.status}
        </span>
      }>
        <MiniGrid items={[
          { label: 'Policy Number', value: activePol.code },
          { label: 'Premium (Monthly)', value: `UGX ${formatUGX(activePol.premium)}` },
          { label: 'Category', value: activePol.category },
          { label: 'Coverage Limit', value: `UGX ${formatUGX(activePol.coverageAmount / 3750)}` },
          { label: 'Insured Asset', value: activePol.insuredItemName.length > 28 ? activePol.insuredItemName.slice(0, 28) + '...' : activePol.insuredItemName },
          { label: 'Renewal Date', value: activePol.renewalDate },
        ]} />
        <button className="mt-4 w-full h-9 bg-[#004260] text-white rounded-md text-[12px] font-bold hover:bg-[#005b82] transition-colors">
          View Full Details
        </button>
      </Widget>
    );
  };

  const renderClaimsWidget = () => (
    <Widget title="Claims" badge={
      <button
        onClick={() => { if (policies.length > 0) setShowFileClaim(true); }}
        className="text-[11px] font-bold text-white bg-[#004260] px-3 py-1.5 rounded-md hover:bg-[#005b82] transition-colors flex items-center gap-1"
      >
        <Plus className="w-3 h-3" /> New Claim
      </button>
    }>
      {claims.length === 0 ? (
        <p className="text-[13px] text-[#64748b] py-4 text-center">No claims filed yet.</p>
      ) : (
        <div className="space-y-2">
          {claims.slice(0, 4).map(clm => (
            <div key={clm.id} className="flex items-start justify-between gap-2 bg-white border border-[#e2e8f0] rounded-lg p-3 hover:border-[#cbd5e1] hover:shadow-sm transition-all cursor-pointer">
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#334155] block">{new Date(clm.dateSubmitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="text-[10px] text-[#64748b] block mt-0.5 truncate">{clm.policyTitle}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="flex items-baseline gap-0.5 justify-end mb-1">
                  <span className="text-[11px] font-bold text-[#10b981]">UGX</span>
                  <span className="text-[12px] font-bold text-[#0f172a]">{formatUGX(clm.estimatedPayout)}</span>
                </span>
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded inline-block ${
                  clm.status === 'Approved' ? 'bg-[#d1fae5] text-[#065f46]'
                    : clm.status === 'Processing' ? 'bg-[#fef3c7] text-[#92400e]'
                      : 'bg-[#fee2e2] text-[#991b1b]'
                }`}>
                  {clm.status === 'Processing' ? 'IN REVIEW' : clm.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Widget>
  );

  const renderPaymentsWidget = () => (
    <Widget title="Payments">
      <div className="flex justify-between mb-3">
        <div>
          <span className="text-[11px] font-medium text-[#64748b] block">Outstanding</span>
          <span className="text-[14px] font-bold text-[#f59e0b]">NIL</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-medium text-[#64748b] block">Next Premium</span>
          <span className="text-[13px] font-bold text-[#1e293b]">UGX {activePol ? formatUGX(activePol.premium) : '0'}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3">
        <div className="flex items-center flex-1 border border-[#e2e8f0] rounded-md overflow-hidden">
          <span className="text-[10px] font-bold text-[#004260] pl-2.5 pr-1">UGX</span>
          <input
            className="flex-1 text-[11px] font-medium py-2 pr-2 outline-none bg-transparent text-[#004260]"
            defaultValue={activePol ? formatUGX(activePol.premium) : '0'}
          />
        </div>
        <button className="h-9 px-4 bg-[#004260] text-white rounded-md text-[11px] font-bold hover:bg-[#005b82] transition-colors shrink-0">
          Pay Now
        </button>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[11px] font-bold text-[#047857]">
        <span className="w-[7px] h-[7px] rounded-full bg-[#10b981] shrink-0" />
        Auto-pay active via Ecobank **** 4292
      </div>
    </Widget>
  );

  const renderDocumentsWidget = () => (
    <Widget title="Documents">
      <p className="text-[12.5px] text-[#6b7280] leading-relaxed">
        Access policy certificates, claim receipts and account statements. All documents are digitally signed.
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        {['Policy Certificate', 'Claim Receipt', 'Tax Statement'].map(doc => (
          <span key={doc} className="inline-flex items-center h-[26px] px-2.5 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[11px] font-bold text-[#334155]">
            {doc}
          </span>
        ))}
      </div>
      <button className="mt-4 h-9 px-4 bg-[#004260] text-white rounded-md text-[12px] font-bold hover:bg-[#005b82] transition-colors">
        Get Statement Details
      </button>
    </Widget>
  );

  const renderPolicyDetails = () => {
    if (!activePol) return null;
    return (
      <Widget title="Policy Details">
        <div className="space-y-0">
          {[
            ['Policy Holder', userName],
            ['Product', activePol.title],
            ['Insured', activePol.insuredItemName],
            ['Start Date', new Date(Date.now() - 180 * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
            ['Renewal', activePol.renewalDate],
            ['Sum Insured', `UGX ${formatUGX(activePol.coverageAmount / 3750)}`],
          ].map(([label, val], i) => (
            <div key={i} className={`flex justify-between py-2 ${i < 5 ? 'border-b border-[#f1f5f9]' : ''}`}>
              <span className="text-[11px] font-medium text-[#64748b]">{label}</span>
              <span className="text-[12.5px] font-bold text-[#1e293b] text-right max-w-[55%] truncate">{val}</span>
            </div>
          ))}
        </div>
      </Widget>
    );
  };

  const renderCoverageWidget = () => {
    if (!activePol) return null;
    const coverageItems = activePol.category === 'Motor'
      ? [{ name: 'Third Party Liability', pct: 100 }, { name: 'Own Damage', pct: 85 }, { name: 'Theft Protection', pct: 90 }, { name: 'Roadside Assistance', pct: 60 }]
      : activePol.category === 'Health'
        ? [{ name: 'Inpatient Cover', pct: 95 }, { name: 'Outpatient Cover', pct: 80 }, { name: 'Dental & Optical', pct: 50 }, { name: 'Maternity', pct: 70 }]
        : [{ name: 'Primary Cover', pct: 100 }, { name: 'Additional Benefits', pct: 75 }, { name: 'Emergency Fund', pct: 60 }];
    return (
      <Widget title="Coverage Highlights">
        <div className="space-y-3">
          {coverageItems.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[14px] font-bold text-[#1f2937]">{item.name}</span>
                <span className="text-[12px] font-bold text-[#2d7a6e]">{item.pct}%</span>
              </div>
              <div className="relative h-2 rounded-full bg-[#f3f4f6] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0ea5a4] to-[#10b981]"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Widget>
    );
  };

  const renderRenewalWidget = () => {
    if (!activePol) return null;
    return (
      <Widget title="Policy Renewal">
        <div className="border border-[#e8eef6] rounded-lg bg-[#f8fafc] p-3.5 mb-3">
          <span className="text-[10.5px] font-bold text-[#64748b] uppercase tracking-wider block mb-1">Next Renewal</span>
          <span className="text-[20px] font-extrabold text-[#1e293b] block leading-tight">
            UGX {formatUGX(activePol.premium * 12)}
          </span>
          <span className="text-[11.5px] text-[#6b7280] block mt-1">Annual premium due on</span>
          <span className="text-[15px] font-extrabold text-[#1f2937] block mt-1">{activePol.renewalDate}</span>
        </div>
        <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#dcfce7] text-[#047857]">
          Active
        </span>
        <div className="flex gap-3 mt-4">
          <button className="flex-1 h-10 bg-[#004260] text-white rounded-md text-[12.5px] font-bold hover:bg-[#005b82] transition-colors">
            Renew Now
          </button>
          <button className="flex-1 h-10 border border-[#004260] text-[#004260] rounded-md text-[12.5px] font-bold hover:bg-[#004260]/5 transition-colors">
            Set Reminder
          </button>
        </div>
      </Widget>
    );
  };

  const renderContactWidget = () => (
    <Widget title="Contact Details">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <span className="text-[16px] text-[#000] block mb-2.5">Insurer</span>
          {[
            { icon: <Phone className="w-2 h-2 text-white" />, text: '+256 700 123 456' },
            { icon: <Mail className="w-2 h-2 text-white" />, text: 'support@maas.ug' },
            { icon: <Globe className="w-2 h-2 text-white" />, text: 'maas-insurance.com' },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2 mb-2 text-[13px] font-bold text-[#1e293b]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#059668] flex items-center justify-center shrink-0">{c.icon}</span>
              {c.text}
            </div>
          ))}
        </div>
        <div>
          <span className="text-[16px] text-[#000] block mb-2.5">Agent</span>
          {[
            { icon: <Phone className="w-2 h-2 text-white" />, text: '+256 701 445 882' },
            { icon: <Mail className="w-2 h-2 text-white" />, text: 'chandrima@nxt.pe' },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2 mb-2 text-[13px] font-bold text-[#1e293b]">
              <span className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] flex items-center justify-center shrink-0">{c.icon}</span>
              {c.text}
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );

  const renderTransactionsWidget = () => (
    <Widget title="Transaction History">
      {policies.length === 0 ? (
        <p className="text-[15px] text-[#9ca3af] text-center py-8">No transactions recorded.</p>
      ) : (
        <div className="space-y-2">
          {policies.slice(0, 4).map((pol, i) => {
            const months = ['Jun', 'May', 'Apr', 'Mar'];
            const dates = ['Jun 01, 2026', 'May 01, 2026', 'Apr 15, 2026', 'Mar 01, 2026'];
            return (
              <div key={`${pol.id}-${i}`} className="flex items-start justify-between gap-3 bg-white border border-[#e2e8f0] rounded-lg p-4 hover:border-[#cbd5e1] hover:shadow-sm transition-all cursor-pointer">
                <div>
                  <span className="text-[11.5px] font-bold text-[#334155] block">{dates[i] || dates[0]}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[9px] font-medium text-[#64748b]">Ref:</span>
                    <span className="text-[8.5px] font-bold text-[#334155]">TXN-{(10000 + i * 1337).toString()}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="flex items-baseline gap-0.5 justify-end mb-1.5">
                    <span className="text-[12px] font-bold text-[#10b981]">UGX</span>
                    <span className="text-[12.5px] font-bold text-[#0f172a]">{formatUGX(pol.premium)}</span>
                  </span>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-[#d1fae5] text-[#065f46] inline-flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> SUCCESS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Widget>
  );

  const renderRecommendedWidget = () => (
    <Widget title="Recommended for You" accent="#3b82f6">
      <div className="border border-[#e2e8f0] rounded-lg bg-gradient-to-b from-white to-[#f8fbff] p-3.5">
        <h4 className="text-[16px] font-extrabold text-[#1f2937] leading-snug mb-1.5">
          {activePol?.category === 'Motor' ? 'Add Roadside Assist+' : activePol?.category === 'Health' ? 'Upgrade to Family Plan' : 'Increase Your Cover'}
        </h4>
        <p className="text-[12.5px] text-[#6b7280] leading-relaxed">
          Based on your current coverage, we recommend enhancing your protection. Speak with an agent for a personalized quote.
        </p>
      </div>
      {onBuyInsurance && (
        <button onClick={onBuyInsurance} className="mt-3 h-9 px-4 bg-[#004260] text-white rounded-md text-[12px] font-bold hover:bg-[#005b82] transition-colors">
          Explore Options
        </button>
      )}
    </Widget>
  );

  const renderDidYouKnowWidget = () => (
    <div className="rounded-xl overflow-hidden relative" style={{ background: '#004260' }}>
      {/* subtle svg pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 220">
          <circle cx="320" cy="40" r="120" fill="white" />
          <circle cx="60" cy="180" r="80" fill="white" />
        </svg>
      </div>
      <div className="relative z-10 p-5">
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-[#BED600] mb-3">
          <Sparkles className="w-3 h-3" /> Ecobank Exclusive
        </span>
        <h4 className="text-[17px] font-extrabold text-white leading-snug mb-2">Did you know?</h4>
        <p className="text-[12.5px] text-white/80 leading-relaxed mb-5">
          As an Ecobank client, you're eligible for a <span className="text-[#BED600] font-bold">10% discount</span> on Life &amp; Personal Accident insurance products through our marketplace.
        </p>
        {onBuyInsurance && (
          <button
            onClick={onBuyInsurance}
            className="h-9 px-5 bg-white text-[#004260] rounded-lg text-[12px] font-extrabold hover:bg-[#f0f3ff] transition-colors flex items-center gap-1.5"
          >
            Explore Deals <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );

  /* ─── Column assembly based on filter ─── */
  const getWidgetColumns = () => {
    if (activeFilter === 'Overview' || !activePol) {
      const col1 = [renderPolicyOverview(), renderClaimsWidget()];
      const col2 = [renderPaymentsWidget(), renderDocumentsWidget()];
      const col3 = [renderCoverageWidget(), renderDidYouKnowWidget(), renderRecommendedWidget()];
      return [col1, col2, col3];
    }
    if (activeFilter === 'Policy') {
      return [[renderPolicyDetails(), renderCoverageWidget()], [renderRenewalWidget(), renderContactWidget()], [renderRecommendedWidget()]];
    }
    if (activeFilter === 'Claims') {
      return [[renderClaimsWidget()], [renderDocumentsWidget()], [renderRecommendedWidget()]];
    }
    if (activeFilter === 'Payments') {
      return [[renderPaymentsWidget(), renderRenewalWidget()], [renderTransactionsWidget()], [renderRecommendedWidget()]];
    }
    if (activeFilter === 'Documents') {
      return [[renderDocumentsWidget()], [renderTransactionsWidget()], [renderContactWidget()]];
    }
    return [[renderPolicyOverview()], [renderClaimsWidget()], [renderPaymentsWidget()]];
  };

  const columns = getWidgetColumns();

  return (
    <div className="min-h-screen bg-[#f3f4f6]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }} id="portal-dashboard">

      {/* Hero Banner */}
      <div className="bg-white p-2 pb-0">
        <div className="rounded-xl h-40 overflow-hidden relative bg-gradient-to-r from-[#004260] via-[#005b82] to-[#4159ab]">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              <path d="M0 200 C 200 0 500 0 1000 200" fill="none" stroke="white" strokeWidth="1" />
              <path d="M0 160 C 300 40 600 40 1000 160" fill="none" stroke="white" strokeWidth="1" />
            </svg>
          </div>
          <div className="absolute top-4 left-5 z-10">
            <span className="text-white text-[22px] font-bold block">MaaS Insurance</span>
            <span className="text-white/60 text-[11px] font-medium">Ecobank Partnership</span>
          </div>
          <div className="absolute top-4 right-5 flex items-center gap-2 z-10">
            <BadgeCheck className="w-4 h-4 text-[#BED600]" />
            <span className="text-white/80 text-[11px] font-semibold">{userName}</span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="bg-[#f3f4f6]">
        <div className="max-w-[1700px] mx-auto px-4 md:px-8">

          {/* Heading Row */}
          <div className="flex items-center justify-between py-5">
            <h1 className="text-[23px] font-bold text-[#1f2937] tracking-tight">Account Dashboard</h1>
            <div className="flex items-center gap-3">
              <button className="w-[34px] h-[34px] rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] flex items-center justify-center hover:bg-[#f8fafc] transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <button className="w-[34px] h-[34px] rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] flex items-center justify-center hover:bg-[#f8fafc] transition-colors">
                <Search className="w-4 h-4" />
              </button>
              {onLogout && (
                <button onClick={onLogout} className="w-8 h-8 rounded-full text-[#ba0c2f] flex items-center justify-center hover:bg-[#ba0c2f]/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* KPI Stats Bar */}
          {(() => {
            const activeCount = policies.length > 0 ? policies.filter(p => p.status === 'Active' || !p.status).length || policies.length : 0;
            const pendingRenewals = policies.filter(p => p.status === 'Renewal' || p.renewalDate).length > 0 ? 1 : 0;
            const pendingClaims = claims.filter(c => c.status === 'Processing').length;
            const nextDuePolicy = policies.length > 0 ? policies[0] : null;
            const kpis = [
              { label: 'Active Policies', value: String(activeCount), color: '#004260', iconBg: '#e7eeff', icon: <Shield className="w-5 h-5" style={{ color: '#004260' }} /> },
              { label: 'Pending Renewals', value: String(pendingRenewals), color: '#ba1a1a', iconBg: '#ffdad6', icon: <RefreshCw className="w-5 h-5" style={{ color: '#ba1a1a' }} /> },
              { label: 'Pending Claims', value: String(pendingClaims), color: '#4159ab', iconBg: '#dce1ff', icon: <Receipt className="w-5 h-5" style={{ color: '#4159ab' }} /> },
              { label: 'Next Premium Due', value: nextDuePolicy?.renewalDate || '—', color: '#1e293b', iconBg: '#dee8ff', icon: <CalendarDays className="w-5 h-5" style={{ color: '#004260' }} />, small: true },
            ];
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                {kpis.map((k, i) => (
                  <div key={i} className="bg-white rounded-xl border border-[#e5e5e5] px-4 py-3.5 flex items-center justify-between shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
                    <div>
                      <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-1">{k.label}</p>
                      <p className={`font-extrabold leading-tight ${k.small ? 'text-[15px] text-[#1e293b]' : 'text-[28px]'}`} style={k.small ? {} : { color: k.color }}>{k.value}</p>
                    </div>
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: k.iconBg }}>
                      {k.icon}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Main Layout: Policy Selector + Widget Panel */}
          <div className="flex gap-4 items-start pb-8">

            {/* LEFT: Policy Selector Column */}
            <div className="hidden lg:block w-[440px] shrink-0 sticky top-4">
              <div className="bg-[#f8f9fa] rounded-2xl p-3.5 space-y-2.5">
                {/* Scroll arrows */}
                <div className="text-center">
                  <button className="text-[#9ca3af] hover:text-[#1f2937] transition-colors p-1">
                    <ChevronUp className="w-4 h-4 mx-auto" />
                  </button>
                </div>

                {/* Policy Cards */}
                {policies.length === 0 ? (
                  <div className="bg-white rounded-lg border-2 border-dashed border-[#cbd5e1] p-6 text-center">
                    <Shield className="w-10 h-10 text-[#cbd5e1] mx-auto mb-2" />
                    <p className="text-[13px] font-bold text-[#1f2937]">No policies yet</p>
                    <p className="text-[11px] text-[#64748b] mt-1">Get started by purchasing insurance</p>
                    {onBuyInsurance && (
                      <button onClick={onBuyInsurance} className="mt-3 h-9 px-4 bg-[#004260] text-white rounded-md text-[12px] font-bold hover:bg-[#005b82] transition-colors">
                        Buy Insurance
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {policies.map((pol, idx) => {
                      const isRenewal = pol.status === 'Renewal';
                      return (
                        <div
                          key={pol.id}
                          onClick={() => { setActivePolicyIdx(idx); setActiveFilter('Overview'); }}
                          className={`bg-white rounded-lg border-2 p-3 cursor-pointer transition-all ${
                            idx === activePolicyIdx
                              ? 'border-[#004260] shadow-[0_2px_12px_rgba(0,66,96,0.15)]'
                              : 'border-[#cbd5e1] hover:border-[#004260]/40'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1.5">
                            <span className="text-[13px] font-bold text-[#1f2937]">{pol.code}</span>
                            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              isRenewal
                                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                : 'bg-[#00C58F]/10 text-[#00C58F]'
                            }`}>
                              {isRenewal ? 'RENEWAL' : 'ACTIVE'}
                            </span>
                          </div>
                          <p className="text-[13px] font-medium text-[#334155] mb-2">{pol.title}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#92400e] bg-[#fef3c7] rounded px-1.5 py-0.5">
                              Due {pol.renewalDate}
                            </span>
                            <span className="flex items-baseline gap-0.5">
                              <span className="text-[10px] font-bold text-[#059668]">UGX</span>
                              <span className="text-[13px] font-bold text-[#059668]">{formatUGX(pol.premium)}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom arrows */}
                <div className="text-center">
                  <button className="text-[#9ca3af] hover:text-[#1f2937] transition-colors p-1">
                    <ChevronDown className="w-4 h-4 mx-auto" />
                  </button>
                </div>

                {/* Buy more */}
                {onBuyInsurance && policies.length > 0 && (
                  <button onClick={onBuyInsurance} className="w-full h-9 border border-[#004260] text-[#004260] rounded-lg text-[12px] font-bold hover:bg-[#004260]/5 transition-colors flex items-center justify-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add New Policy
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT: White Widget Panel */}
            <div className="flex-1 min-w-0 bg-white rounded-md p-5">

              {/* Filter Bar */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {filters.map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`inline-flex items-center justify-center min-h-[34px] px-3.5 rounded-full border text-[12px] font-bold tracking-[0.01em] transition-all whitespace-nowrap ${
                        activeFilter === f
                          ? 'border-[#004260]/22 bg-[#004260]/5 text-[#004260] shadow-[0_0_0_1px_rgba(0,66,96,0.04)_inset]'
                          : 'border-[#d6e0ea] bg-white text-[#64748b] hover:border-[#c0ccd9] hover:text-[#1e293b] hover:bg-[#f8fafc]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                {onBuyInsurance && (
                  <button onClick={onBuyInsurance} className="h-9 px-4 rounded-lg border border-[#004260] bg-[#004260] text-white text-[12.5px] font-extrabold flex items-center gap-2 hover:bg-[#005b82] transition-colors whitespace-nowrap shadow-md shadow-[#004260]/15">
                    <ShoppingCart className="w-3.5 h-3.5" /> Buy Insurance
                  </button>
                )}
              </div>

              {/* Widget Grid: 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 items-start">
                {columns.map((col, ci) => (
                  <div key={ci} className="flex flex-col gap-2.5 min-w-0">
                    {col.map((widget, wi) => (
                      <React.Fragment key={wi}>{widget}</React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Claim Modal */}
      {showFileClaim && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0f172a]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl p-8 flex flex-col shadow-2xl mx-4 relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowFileClaim(false)} className="absolute top-5 right-5 text-[#94a3b8] hover:text-[#1f2937] transition-colors p-1.5 rounded-lg hover:bg-[#f8fafc]">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <h3 className="text-[20px] font-bold text-[#1f2937]">Submit New Claim</h3>
              <p className="text-[12px] text-[#64748b] mt-1">Provide incident details to begin the review process.</p>
            </div>
            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#64748b] block mb-1 uppercase tracking-wider">Policy</label>
                <select value={selectedPolId} onChange={(e) => setSelectedPolId(e.target.value)} className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#004260] text-[13px] font-semibold">
                  {policies.map(p => <option key={p.id} value={p.id}>{p.code} — {p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#64748b] block mb-1 uppercase tracking-wider">Description</label>
                <textarea value={claimDesc} onChange={(e) => setClaimDesc(e.target.value)} placeholder="What happened?" rows={3} className="w-full p-3 bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#004260] text-[13px] resize-none placeholder:text-[#9ca3af]" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#64748b] block mb-1 uppercase tracking-wider">Estimated Amount (USD)</label>
                <input type="number" value={claimValue} onChange={(e) => setClaimValue(e.target.value)} placeholder="e.g. 500" className="w-full h-10 px-3 bg-[#f8f9fa] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#004260] text-[13px] font-semibold" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#64748b] block mb-1 uppercase tracking-wider">Evidence</label>
                <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center gap-2 ${isDragging ? 'border-[#004260] bg-[#004260]/5' : uploadedFile ? 'border-[#10b981]/50 bg-[#10b981]/5' : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-[#f8f9fa]'}`}>
                  <input ref={fileInputRef} type="file" onChange={handleFileInputChange} className="hidden" accept="image/*,.pdf" />
                  {uploadedFile ? (
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle className="w-6 h-6 text-[#10b981]" />
                      <span className="text-[12px] font-bold text-[#1f2937] truncate max-w-[240px]">{uploadedFile.name}</span>
                      <button type="button" onClick={handleClearFile} className="text-[10px] text-[#ef4444] font-bold uppercase hover:underline">Remove</button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-[#9ca3af]" />
                      <p className="text-[12px] text-[#6b7280] font-semibold">Drop files or <span className="text-[#004260]">browse</span></p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowFileClaim(false)} className="flex-1 h-10 border border-[#e2e8f0] rounded-lg text-[13px] font-semibold text-[#64748b] hover:bg-[#f8f9fa]">Cancel</button>
                <button type="submit" className="flex-[2] h-10 bg-[#004260] text-white rounded-lg text-[13px] font-bold hover:bg-[#005b82] shadow-md">Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
