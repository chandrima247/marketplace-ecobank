import { useState, useEffect } from 'react';
import { 
  Heart, Shield, Car, Smartphone, Plane, Coins, Briefcase, Sparkles, 
  Search, Mic, ChevronRight, CheckCircle2, ArrowRight, UserCheck, 
  ArrowUpRight, HelpCircle, AlertCircle
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import VoiceAssistant from './components/VoiceAssistant';
import SupportChat from './components/SupportChat';
import InsuranceWizard from './components/InsuranceWizard';
import Dashboard from './components/Dashboard';
import AgentDashboard from './components/AgentDashboard';

import { 
  CATEGORIES, 
  METADATA_IMAGES, 
  INITIAL_POLICES, 
  INITIAL_CLAIMS, 
  getVehicleForPlate 
} from './data';
import { Policy, Claim, User, InsuranceCategory } from './types';

export default function App() {
  // Navigation states
  const [activeView, setActiveView] = useState<'explore' | 'policies' | 'claims' | 'wizard' | 'agent'>('explore');
  
  // Modals & Assistant States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<NonNullable<User['role']>>('customer');

  // Core User / Core Ledger States
  const [user, setUser] = useState<User | null>(null);
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICES);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);

  // Active Wizard Customization State
  const [wizardCategory, setWizardCategory] = useState<InsuranceCategory>('Motor');
  const [wizardStage, setWizardStage] = useState<string>('questions');
  const [presetPlateNum, setPresetPlateNum] = useState('');

  // Landing Search Inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(CATEGORIES);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Filter categories dynamically based on query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(CATEGORIES);
      return;
    }
    const filtered = CATEGORIES.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchQuery]);

  // Handle successful login
  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role && loggedInUser.role !== 'customer') {
      setActiveView('agent');
      return;
    }
    // If they were trying to access lists, direct them there
    if (activeView === 'explore' || activeView === 'agent') {
      setActiveView('policies');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveView('explore');
  };

  // Launch wizard flow
  const handleLaunchWizard = (cat: InsuranceCategory, plate: string = '') => {
    setWizardCategory(cat);
    setPresetPlateNum(plate);
    setActiveView('wizard');
  };

  const openRoleLogin = (role: NonNullable<User['role']> = 'customer') => {
    setLoginRole(role === 'agent' ? 'agent' : 'customer');
    setIsLoginOpen(true);
  };

  const openBackoffice = () => {
    setUser({
      email: 'operations.control@ecobank.com',
      name: 'Operations Control',
      isLoggedIn: true,
      role: 'ops',
    });
    setActiveView('agent');
  };

  // Callback when a user completes a purchase
  const handlePolicyCreated = (newPolicy: Policy) => {
    // Add policy locally
    setPolicies([newPolicy, ...policies]);
    // Redirect to policies tab on the dashboard
    setActiveView('policies');
    
    // Automatically mock login if not logged in to let them view their dashboard
    if (!user) {
      setUser({
        email: 'jane.doe@ecobank.com',
        name: 'Jane Doe',
        isLoggedIn: true
      });
    }
  };

  const handleClaimCreated = (newClaim: Claim) => {
    setClaims([newClaim, ...claims]);
  };

  const handleRemovePolicy = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
    // Remove linked claims as well for consistency
    setClaims(claims.filter(c => c.policyId !== id));
  };

  // Get specific category Lucide icons
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />;
      case 'Shield': return <Shield className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />;
      case 'Car': return <Car className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />;
      case 'Plane': return <Plane className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />;
      case 'Leaf': return <Briefcase className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />; // Agric alternative
      case 'Coins': return <Coins className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />;
      default: return <Shield className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />;
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col relative select-none antialiased overflow-x-hidden">
      

      {/* Structured Header Routing — global nav shown on explore + dashboard (policies/claims)
          for consistency. Hidden on the agent workspace and full-bleed wizard stages. */}
      {activeView !== 'agent' &&
        !(activeView === 'wizard' && (wizardStage === 'application' || wizardStage === 'checkout' || wizardStage === 'receipt')) && (
        <Header
          user={user}
          onLoginClick={() => openRoleLogin('customer')}
          onLogout={handleLogout}
          activeView={activeView}
          onNavigate={(view) => setActiveView(view)}
          onBackClick={() => setActiveView('explore')}
          isSubPage={activeView === 'wizard'}
          titleOverride={activeView === 'wizard' ? 'Ecobank Insurance' : undefined}
        />
      )}

      {/* MASTER SCENARIOS SWITCH */}
      <div className="flex-grow flex flex-col relative z-20">

        {/* 1. CORE EXPLORATION LANDING VIEW */}
        {activeView === 'explore' && (
          <div className="flex-grow flex flex-col" id="landing-explore-root">
            
            {/* Hero Banner with Grid Pattern Background */}
            <section className="relative pt-16 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto w-full overflow-hidden">
              <div className="absolute inset-0 hero-pattern opacity-40 -z-10"></div>
              
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Pan-African Platform
              </div>
              
              <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-none">
                What do you need <span className="italic font-serif font-light text-secondary underline decoration-[#BED600]/80 decoration-4 underline-offset-8">covered?</span>
              </h1>
              
              {/* Intelligent Category Search Input representation matching standard Screen 1 & Screen 2 */}
              <div className="mt-10 max-w-2xl mx-auto relative px-1">
                <div className="relative flex items-center bg-white rounded-full p-2.5 sm:p-3 shadow-xl sm:border border-gray-100 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all z-30">
                  <span className="text-gray-400 pl-4 pr-2 flex items-center justify-center">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary/60" />
                  </span>
                  
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearchDropdown(true);
                    }}
                    onFocus={() => setShowSearchDropdown(true)}
                    placeholder="Describe it or search active categories..."
                    className="w-full h-11 bg-transparent px-2 font-sans font-medium text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none border-none focus:ring-0"
                    id="hero-insurance-search"
                  />
                  
                  {/* Mic Button for voice control activation */}
                  <button
                    onClick={() => {
                      setIsVoiceOpen(true);
                    }}
                    className="w-11 h-11 sm:w-12 sm:h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all shadow-md shrink-0 border border-primary/50"
                    title="Talk to Live AI Assistant"
                    id="hero-mic-activation-btn"
                  >
                    <Mic className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Instant Category search drop zone drop-down */}
                {showSearchDropdown && searchQuery.trim() && (
                  <div className="absolute inset-x-1 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl p-4 text-left space-y-2 z-40 max-h-[300px] overflow-y-auto" id="search-dropdown-matches">
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-extrabold uppercase tracking-widest pl-2 pb-1 border-b border-gray-50">
                      <span>Matches ({filteredCategories.length})</span>
                      <button onClick={() => setShowSearchDropdown(false)} className="text-gray-400 hover:text-primary underline lowercase">close</button>
                    </div>
                    {filteredCategories.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6 font-semibold">No direct category matched. Try typing 'Motor' or use our voice mic!</p>
                    ) : (
                      filteredCategories.map(cat => (
                        <div 
                          key={cat.id}
                          onClick={() => {
                            handleLaunchWizard(cat.id);
                            setShowSearchDropdown(false);
                          }}
                          className="p-3 hover:bg-primary/5 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                        >
                          <div>
                            <span className="block font-bold text-xs sm:text-sm text-gray-900">{cat.name} Insurance</span>
                            <span className="block text-[10px] text-gray-400 line-clamp-1">{cat.description}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Micro-scale category tiles matching exact layout from Screen 1 */}
            <section className="py-6 border-y border-gray-100 bg-white/40 backdrop-blur-xs px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto pb-4 scrollbar-hide justify-center sm:justify-start lg:justify-center" id="category-chips-rail">
                  {CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => handleLaunchWizard(cat.id)}
                      className="flex flex-col items-center gap-2.5 min-w-[70px] sm:min-w-[80px] cursor-pointer group"
                      id={`chip-category-${cat.id.toLowerCase()}`}
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-xs border border-gray-100 flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                        {renderCategoryIcon(cat.icon)}
                      </div>
                      <span className="font-bold text-xs text-gray-500 group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dynamic visual Trust Badges from the home screens mock */}
            <div className="flex flex-wrap justify-center gap-3.5 sm:gap-10 py-8 bg-transparent px-4">
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/60 rounded-full border border-gray-100 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-success-teal"></span>
                <span className="text-xs font-bold text-gray-600">40-sec purchase checkout</span>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/60 rounded-full border border-gray-100 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span className="text-xs font-bold text-gray-600">98.8% Claim success payout ratio</span>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-white/60 rounded-full border border-gray-100 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-bold text-gray-600">24/7 AI Voice assistance active</span>
              </div>
            </div>

            {/* Featured Solutions Portfolio block curated as in Screen 1 */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
              <div className="mb-12 text-center sm:text-left">
                <span className="inline-block text-[10px] bg-secondary/10 text-secondary px-3 py-1 rounded-full font-extrabold uppercase tracking-widest mb-2">Portfolio</span>
                <h2 className="text-3xl sm:text-4xl font-black text-primary leading-tight">Featured Solutions</h2>
                <p className="text-sm sm:text-base text-gray-500 max-w-lg mt-1">Premium microprotect layers curated for your modern lifestyle and absolute convenience.</p>
              </div>

              {/* Bento Grid layouts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="featured-solutions-grid">
                
                {/* 1 Large block with life photography */}
                <div className="md:col-span-2 relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 bg-white flex flex-col border border-gray-100 h-[380px] sm:h-[480px]">
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={METADATA_IMAGES.lifeHero}
                      alt="Life Insurance Protection photography"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Dark premium gradients overlay */}
                    <div className="absolute inset-0 bg-primary/80"></div>
                  </div>
                  
                  <div className="p-8 sm:p-10 mt-auto relative z-10 space-y-4">
                    <div>
                      <span className="text-[10px] text-white/70 font-extrabold uppercase tracking-widest block mb-1">Peace of Mind</span>
                      <h3 className="font-extrabold text-2xl sm:text-3xl text-white font-sans max-w-md leading-tight">Protect your family's enduring legacy</h3>
                    </div>
                    <button
                      onClick={() => handleLaunchWizard('Life')}
                      className="bg-white text-primary px-8 py-3.5 rounded-full font-bold text-sm sm:text-base hover:bg-[#BED600] hover:text-primary transition-all active:scale-95 shadow-md"
                    >
                      Explore Plans
                    </button>
                  </div>
                </div>

                {/* Vertical sidebar containing 2 smaller visual cards */}
                <div className="flex flex-col gap-8">
                  
                  {/* Healthcare Setting Card */}
                  <div className="group overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col border border-gray-100 h-full">
                    <div className="aspect-[16/9] relative overflow-hidden shrink-0">
                      <img
                        src={METADATA_IMAGES.healthCard}
                        alt="Quality Medical Clinic photography"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-lg text-primary leading-snug">Quality care cover for your loved ones</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Reimbursement logs processed instantly under 24hrs.</p>
                      </div>
                      <div className="pt-2 border-t border-gray-50 flex items-center">
                        <button
                          onClick={() => handleLaunchWizard('Health')}
                          className="text-secondary font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 hover:gap-3 transition-all group/btn"
                        >
                          <span>View Health Plans</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Device Protection Card */}
                  <div className="group overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 bg-white flex flex-col border border-gray-100 h-full">
                    <div className="aspect-[16/9] relative overflow-hidden shrink-0">
                      <img
                        src={METADATA_IMAGES.deviceCard}
                        alt="Smartphone Screen damage photography"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-lg text-primary leading-snug">Instant screen &amp; liquid cover for gadgets</h4>
                        <p className="text-[10px] text-gray-400 mt-1">Covers standard drops, spills and internal shortages.</p>
                      </div>
                      <div className="pt-2 border-t border-gray-50 flex items-center">
                        <button
                          onClick={() => handleLaunchWizard('Device')}
                          className="text-secondary font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 hover:gap-3 transition-all group/btn"
                        >
                          <span>Protect Now</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* Ecobank story partner Section matched from specifications */}
            <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white/50 border-t border-gray-100">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                
                {/* Left Photo Illustration with badges overlay */}
                <div className="lg:w-1/2 relative">
                  <div className="absolute -inset-4 bg-[#BED600]/10 rounded-[3rem] blur-2xl -z-10"></div>
                  <img
                    src={METADATA_IMAGES.storyPartner}
                    alt="Professional Ecobank workspace"
                    className="rounded-3xl shadow-xl w-full object-cover aspect-[4/3] border-4 border-white"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hidden sm:block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#BED600]/25 rounded-full flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-primary leading-none">Trusted by Millions</p>
                        <p className="text-[10.5px] text-gray-400 mt-1">Verified secure liquidity reserve</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right text layout representation */}
                <div className="lg:w-1/2 space-y-6">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#BED600]/15 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-[#BED600] animate-ping"></span>
                    Official Ecobank Partner
                  </span>
                  
                  <h2 className="text-3xl sm:text-5xl font-black text-primary leading-tight font-sans">
                    Insurance protection that moves at your speed
                  </h2>
                  
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                    Leveraging Ecobank's Pan-African network, this marketplace clears the friction out of traditional policies. Get certified in seconds, manage payouts in minutes, and keep your cover moving with confidence.
                  </p>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-4">
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs">
                      <p className="text-3xl sm:text-4xl font-extrabold text-secondary font-mono">33</p>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">Countries Covered</p>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs">
                      <p className="text-3xl sm:text-4xl font-extrabold text-secondary font-mono">10M+</p>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest mt-1">Active safe users</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* 2. DYNAMIC wizard FLOW ONBOARDING CONTAINER */}
        {activeView === 'wizard' && (
          <InsuranceWizard
            initialCategory={wizardCategory}
            initialPlate={presetPlateNum}
            onCompleted={handlePolicyCreated}
            onBack={() => setActiveView('explore')}
            onStageChange={setWizardStage}
          />
        )}

        {/* 3 & 4. CUSTOMER CONSOLE PORTAL VIEW (Policies & Claims Tabs) */}
        {(activeView === 'policies' || activeView === 'claims') && (
          <Dashboard
            policies={policies}
            claims={claims}
            onAddClaim={handleClaimCreated}
            onRemovePolicy={handleRemovePolicy}
            onBuyInsurance={() => setActiveView('explore')}
            onLogout={handleLogout}
            userName={user?.name || 'Jane Doe'}
          />
        )}

        {activeView === 'agent' && (
          <AgentDashboard
            user={user}
            onLogout={handleLogout}
            onStartCustomerQuote={() => handleLaunchWizard('Motor')}
          />
        )}

      </div>

      {/* Persistent global footer - hidden on dashboard and the full-bleed Motor listing */}
      {activeView !== 'policies' && activeView !== 'claims' &&
        activeView !== 'agent' &&
        !(activeView === 'wizard' && (wizardStage === 'application' || wizardStage === 'checkout' || wizardStage === 'receipt')) && (
        <Footer isSubPage={activeView === 'wizard'} onRoleLogin={openRoleLogin} onBackofficeLogin={openBackoffice} />
      )}

      {/* INTERACTIVE LOGIN MODAL OVERLAY */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        initialRole={loginRole}
      />

      {/* INTERACTIVE VOICE ASSISTANT MIC DIALOG OVERLAY */}
      <VoiceAssistant 
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onActionTriggered={(cat, plate) => handleLaunchWizard(cat, plate)}
      />

      {/* GLOBAL "NEED HELP?" SUPPORT CHAT BUBBLE — on every page */}
      <SupportChat />

    </div>
  );
}
