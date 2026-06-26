import React, { useState } from 'react';
import { Shield, RefreshCw, FileText, Download, MessageSquare, Plus, LogOut, BarChart3 } from 'lucide-react';
import { Policy, Claim, InsuranceCategory } from '../types';
import { METADATA_IMAGES } from '../data';

interface DashboardProps {
  policies: Policy[];
  claims: Claim[];
  onAddClaim: (newClaim: Claim) => void;
  onRemovePolicy?: (id: string) => void;
  onBuyInsurance?: () => void;
  onLogout?: () => void;
  userName?: string;
}

export default function Dashboard({
  policies,
  claims,
  onAddClaim,
  onBuyInsurance,
  onLogout,
  userName = 'Jane Doe'
}: DashboardProps) {
  const [activePolicyIdx, setActivePolicyIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');

  const activePol = policies[activePolicyIdx] || policies[0];
  const activeClaims = claims.filter(c => c.policyId === activePol?.id);

  // Mock data for display
  const mockPolicies = [
    { code: 'MAAS-MTR-0042', name: 'Britam Motor Insurance', status: 'ACTIVE', due: '31 May', premium: 'UGX 485k' },
    { code: 'MAAS-HLT-0119', name: 'AAR Health Prime', status: 'ACTIVE', due: '12 Aug', premium: 'UGX 1.2M' },
    { code: 'MAAS-LIF-0203', name: 'Prudential Life Cover', status: 'RENEWAL', due: '02 Jul', premium: 'UGX 800k' }
  ];

  const selectedPol = mockPolicies[activePolicyIdx];

  return (
    <div className="min-h-screen bg-[#f3f5f6]">
      {/* ──────── NAV ──────── */}
      <nav className="bg-white border-b border-[#eef0f1] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <img src={METADATA_IMAGES.ecobankLogo} alt="Ecobank" className="h-14 w-auto" />

          <div className="flex gap-10 items-center">
            <a href="#" className="text-[15px] font-medium text-[#5b6578] hover:text-[#023448]">Explore</a>
            <span className="text-[15px] font-semibold text-[#023448] relative pb-1.5 border-b-2 border-[#BED600]">My Policies</span>
            <a href="#" className="text-[15px] font-medium text-[#5b6578] hover:text-[#023448]">Claims</a>
            <a href="#" className="text-[15px] font-medium text-[#5b6578] hover:text-[#023448]">Support</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#023448] text-white flex items-center justify-center font-bold text-sm">
              {userName.charAt(0)}
            </div>
            <img src={METADATA_IMAGES.nxtpeLogo} alt="nxtpe" className="h-8 w-auto" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* ──────── HERO ──────── */}
        <div className="rounded-[22px] overflow-hidden relative bg-gradient-to-r from-[#023448] via-[#005b82] to-[#1c6fa0] p-8 mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#BED600] opacity-10 -mr-20 -mt-20" />
          <div className="relative flex justify-between items-start">
            <div>
              <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-white/60 letter-spacing-wider font-bold uppercase">Welcome back</div>
              <h1 className="text-4xl font-black text-white mt-1.5">
                {userName}
              </h1>
              <p className="text-white/70 text-sm mt-1">Your protection, all in one place.</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-full">
              <Shield className="w-4 h-4 text-[#BED600]" />
              <span className="text-white font-semibold text-xs">Verified · Ecobank</span>
            </div>
          </div>
        </div>

        {/* ──────── KPI BAR ──────── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-[#eef0f1]">
            <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad] font-bold uppercase">Active Policies</div>
            <div className="text-3xl font-black text-[#023448] mt-1 flex items-start justify-between">
              <span>{policies.length}</span>
              <div className="w-11 h-11 rounded-full bg-[#ecf2f6] text-[#023448] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#eef0f1]">
            <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad] font-bold uppercase">Pending Renewals</div>
            <div className="text-3xl font-black text-[#c4452f] mt-1 flex items-start justify-between">
              <span>1</span>
              <div className="w-11 h-11 rounded-full bg-[#fdecea] text-[#c4452f] flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#eef0f1]">
            <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad] font-bold uppercase">Pending Claims</div>
            <div className="text-3xl font-black text-[#005b82] mt-1 flex items-start justify-between">
              <span>{claims.length}</span>
              <div className="w-11 h-11 rounded-full bg-[#e7eef5] text-[#005b82] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-[#eef0f1]">
            <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad] font-bold uppercase">Next Premium Due</div>
            <div className="text-lg font-black text-[#16242b] mt-2">31 May 2026</div>
          </div>
        </div>

        {/* ──────── MAIN LAYOUT ──────── */}
        <div className="grid grid-cols-[300px_1fr] gap-5">
          {/* SIDEBAR: Policy selector */}
          <aside className="flex flex-col gap-3">
            {mockPolicies.map((p, i) => (
              <button
                key={i}
                onClick={() => setActivePolicyIdx(i)}
                className={`text-left rounded-2xl p-4 transition-all ${
                  i === activePolicyIdx
                    ? 'bg-white border-2 border-[#023448] shadow-md'
                    : 'bg-white border-2 border-[#eef0f1]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs font-bold">{p.code}</span>
                  <span className={`text-[9px] font-bold rounded-full px-2 py-1 ${
                    p.status === 'ACTIVE' ? 'bg-[#d6f5e8] text-[#00a878]' : 'bg-[#fdecea] text-[#c4452f]'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="text-sm text-[#3e4a52] font-medium">{p.name}</div>
                <div className="flex justify-between items-center mt-2.5 text-xs">
                  <span style={{ fontFamily: "'Space Grotesk', monospace" }} className="bg-[#fef3c7] text-[#92670e] font-bold px-2 py-1 rounded">Due {p.due}</span>
                  <span className="font-bold text-[#00a878]">{p.premium}</span>
                </div>
              </button>
            ))}
            <button
              onClick={onBuyInsurance}
              className="w-full border-2 border-dashed border-[#cdd9e1] bg-white text-[#023448] py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:border-[#023448] transition"
            >
              <Plus className="w-4 h-4" /> Add new policy
            </button>
          </aside>

          {/* MAIN: Tabs + Widgets */}
          <div className="bg-white rounded-2xl border border-[#eef0f1] p-5">
            {/* Filter tabs */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {['Overview', 'Policy', 'Claims', 'Payments', 'Documents'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                    activeTab === tab
                      ? 'bg-[#ecf2f6] text-[#023448]'
                      : 'border border-[#eef0f1] text-[#5b6578] hover:bg-[#f8fafb]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Widget Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Col 1 */}
              <div className="flex flex-col gap-4">
                {/* Policy Overview */}
                <div className="border border-[#eef0f1] rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white">
                    <div className="w-1 h-5 bg-[#00C58F] rounded" />
                    <span className="text-sm font-bold">Policy Overview</span>
                    <span style={{ fontFamily: "'Space Grotesk', monospace" }} className="ml-auto text-[10px] font-bold text-[#00a878] border border-[#b6e8d4] px-2 py-1 rounded">ACTIVE</span>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad] mb-1">POLICY NO.</div>
                        <div className="font-bold">{selectedPol.code}</div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad] mb-1">PREMIUM / YR</div>
                        <div className="font-bold">{selectedPol.premium}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad] mb-1">VEHICLE</div>
                        <div className="font-bold">Toyota RAV4</div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad] mb-1">SUM INSURED</div>
                        <div className="font-bold">UGX 165M</div>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-[#023448] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#015a3d] transition">
                      View full details
                    </button>
                  </div>
                </div>

                {/* Claims */}
                <div className="border border-[#eef0f1] rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3">
                    <div className="w-1 h-5 bg-[#005b82] rounded" />
                    <span className="text-sm font-bold">Claims</span>
                    <button className="ml-auto bg-[#023448] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#015a3d] transition">
                      <Plus className="w-3 h-3" /> New
                    </button>
                  </div>
                  <div className="px-4 pb-4 flex flex-col gap-2">
                    {activeClaims.slice(0, 2).map((c, i) => (
                      <div key={i} className="border border-[#eef0f1] rounded-2xl p-3 flex justify-between items-start text-sm">
                        <div>
                          <div className="font-bold">Jun 04, 2026</div>
                          <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad] mt-0.5">Britam Motor</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#00a878]">UGX 1.5M</div>
                          <span style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-[8px] font-bold bg-[#fef3c7] text-[#92670e] px-1.5 py-0.5 rounded mt-1 inline-block">IN REVIEW</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 2 */}
              <div className="flex flex-col gap-4">
                {/* Payments */}
                <div className="border border-[#eef0f1] rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3">
                    <div className="w-1 h-5 bg-[#00C58F] rounded" />
                    <span className="text-sm font-bold">Payments</span>
                  </div>
                  <div className="px-4 pb-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <div>
                        <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad]">OUTSTANDING</div>
                        <div className="text-xl font-black text-[#f59e0b] mt-1">NIL</div>
                      </div>
                      <div className="text-right">
                        <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs text-[#9aa6ad]">NEXT PREMIUM</div>
                        <div className="text-lg font-bold mt-1">{selectedPol.premium}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex border border-[#e0e5e8] rounded-xl overflow-hidden">
                        <span style={{ fontFamily: "'Space Grotesk', monospace" }} className="px-2.5 py-2.5 text-xs font-bold bg-[#f5f7f8] text-[#023448]">UGX</span>
                        <input type="text" value="485,000" readOnly className="flex-1 border-0 px-3 py-2.5 text-xs outline-none" />
                      </div>
                      <button className="px-4 py-2 bg-[#023448] text-white text-xs font-bold rounded-xl hover:bg-[#015a3d] transition">
                        Pay now
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs pt-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C58F]" />
                      <span style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-[#00a878] font-semibold">Auto-pay via Ecobank ****4292</span>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="border border-[#eef0f1] rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3">
                    <div className="w-1 h-5 bg-[#005b82] rounded" />
                    <span className="text-sm font-bold">Documents</span>
                  </div>
                  <div className="px-4 pb-4">
                    <p className="text-sm text-[#6b7780] leading-relaxed mb-3">
                      Access certificates, claim receipts and statements — all digitally signed.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['Certificate', 'Claim receipt', 'Tax statement'].map(doc => (
                        <span key={doc} style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs font-semibold bg-[#f8fafb] border border-[#eef0f1] px-3 py-1.5 rounded-full">
                          {doc}
                        </span>
                      ))}
                    </div>
                    <button className="w-full bg-[#023448] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#015a3d] transition">
                      Get statement
                    </button>
                  </div>
                </div>
              </div>

              {/* Col 3 */}
              <div className="flex flex-col gap-4">
                {/* Coverage Highlights */}
                <div className="border border-[#eef0f1] rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3">
                    <div className="w-1 h-5 bg-[#00C58F] rounded" />
                    <span className="text-sm font-bold">Coverage Highlights</span>
                  </div>
                  <div className="px-4 pb-4 space-y-3">
                    {[
                      { name: 'Third Party Liability', pct: 100 },
                      { name: 'Own Damage', pct: 85 },
                      { name: 'Theft Protection', pct: 90 },
                      { name: 'Roadside Assist', pct: 60 }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-semibold">{item.name}</span>
                          <span style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-xs font-bold text-[#00a878]">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-[#f1f4f5] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#00C58F] to-[#0ea5a4]"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ecobank Exclusive */}
                <div className="bg-[#023448] rounded-2xl overflow-hidden relative p-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#BED600] opacity-10 rounded-full -mr-8 -mt-8" />
                  <div className="relative">
                    <div style={{ fontFamily: "'Space Grotesk', monospace" }} className="text-[10px] font-bold text-[#BED600] flex items-center gap-1.5 mb-2">
                      <Shield className="w-3 h-3" /> ECOBANK EXCLUSIVE
                    </div>
                    <h3 className="text-white font-bold text-base mb-1">Did you know?</h3>
                    <p className="text-white/80 text-xs leading-relaxed mb-4">
                      You're eligible for a <span className="text-[#BED600] font-bold">10% discount</span> on Life & Personal Accident products.
                    </p>
                    <button onClick={onBuyInsurance} className="w-full bg-white text-[#023448] font-bold text-xs py-2 rounded-xl hover:bg-[#f5f7f8] transition">
                      Explore deals →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
