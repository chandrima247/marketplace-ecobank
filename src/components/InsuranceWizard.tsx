import React, { useState, useEffect } from 'react';
import {
  Search, Shield, CheckCircle2, ChevronRight, HelpCircle, HardDrive,
  Smartphone, User, Heart, Sparkles, Car, Loader2, ArrowLeft, ArrowRight,
  CreditCard, Calendar, Check, AlertCircle, FileText, Info, Award, X,
  Star, SlidersHorizontal, Filter, Edit3, ChevronDown, ChevronUp,
  Zap, Upload, Camera, Clock, Phone, Globe, Flame, Umbrella, Scale,
  Wrench, Stethoscope, Home, Laptop, Plane, Tractor, Briefcase, Lock,
  MapPin, Mail, UserCheck, FileCheck, BadgeCheck, CircleDollarSign,
  ShieldCheck, HeartPulse, CarFront, Cpu, PlaneTakeoff, Wheat, Building
} from 'lucide-react';
import { VEHICLE_DATABASE, POPULAR_PLATES, getVehicleForPlate, getProvidersForCategory, InsuranceProvider } from '../data';
import { Policy, InsuranceCategory, VehicleLookupResult } from '../types';

interface InsuranceWizardProps {
  initialCategory: InsuranceCategory;
  initialPlate?: string;
  onCompleted: (newPolicy: Policy) => void;
  onBack: () => void;
  onStageChange?: (stage: string) => void;
}

export default function InsuranceWizard({
  initialCategory,
  initialPlate = '',
  onCompleted,
  onBack,
  onStageChange
}: InsuranceWizardProps) {
  const [category, setCategory] = useState<InsuranceCategory>(initialCategory);
  
  // Refactored 5-Stage Wizard Progression States
  // 'questions' -> 'listing' -> 'details' -> 'application' -> 'policy'
  const [stage, setStage] = useState<'questions' | 'listing' | 'details' | 'application' | 'policy'>('questions');

  // QUESTIONNAIRE STATES

  // 1. Motor States
  const [plateNumber, setPlateNumber] = useState(initialPlate);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupResult, setLookupResult] = useState<VehicleLookupResult | null>(null);
  const [showManualMotor, setShowManualMotor] = useState(false);
  // Manual vehicle inputs
  const [manMakeMod, setManMakeMod] = useState('Toyota RAV4');
  const [manYear, setManYear] = useState('2021');
  const [manValue, setManValue] = useState('28000');
  const [manFuel, setManFuel] = useState('Petrol');
  // Motor specific questions
  const [vehicleUsage, setVehicleUsage] = useState<'personal' | 'business' | 'ridehailing'>('personal');
  const [driverAge, setDriverAge] = useState('32');
  const [driverExperience, setDriverExperience] = useState('8');
  const [annualMileage, setAnnualMileage] = useState<'low' | 'standard' | 'high'>('standard');
  const [cleanRecord, setCleanRecord] = useState(true);

  // 2. Health States
  const [healthAge, setHealthAge] = useState('32');
  const [familySize, setFamilySize] = useState('Self + Family');
  const [preconditions, setPreconditions] = useState<'None' | 'Minor (Allergies)' | 'Chronic'>('None');
  const [hasRecentCheckup, setHasRecentCheckup] = useState(true);

  // 3. Life States
  const [annualIncome, setAnnualIncome] = useState('$50,000 - $100,000');
  const [dependentsCount, setDependentsCount] = useState('2');
  const [isSmoker, setIsSmoker] = useState(false);
  const [benefitMultiplier, setBenefitMultiplier] = useState<'10x' | '15x' | '20x'>('10x');

  // 4. Device States
  const [deviceModel, setDeviceModel] = useState('iPhone 15 Pro Max');
  const [deviceSerial, setDeviceSerial] = useState('IMEI-8839210-99');
  const [deviceValue, setDeviceValue] = useState('1200');
  const [deviceCondition, setDeviceCondition] = useState<'New' | 'Mint' | 'Refurbished'>('New');

  // GLOBAL STAGE SELECT STATES
  const [selectedPlanId, setSelectedPlanId] = useState<'plan-basic' | 'plan-standard' | 'plan-pro'>('plan-standard');
  const [waiverOption, setWaiverOption] = useState(true);
  const [extraAssistance, setExtraAssistance] = useState(false);

  // PROVIDER MARKETPLACE STATES
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [providerFilterChecked, setProviderFilterChecked] = useState<string[]>([]);
  const [showAllProviderFilters, setShowAllProviderFilters] = useState(false);
  const [priceRangeFilter, setPriceRangeFilter] = useState<[number, number]>([0, 5000000]);
  const [addonFilters, setAddonFilters] = useState<string[]>([]);

  // SECURE CHECKOUT / FINAL FORM STATES
  const [fullName, setFullName] = useState('Chandrima Ghosh');
  const [email, setEmail] = useState('chandrimaghosh2004@gmail.com');
  const [phone, setPhone] = useState('+256 701 445882');
  const [nationalId, setNationalId] = useState('NID-UG594031-Z');
  const [licenseNumber, setLicenseNumber] = useState('UG-DRV-9840212');
  
  const [paymentMethod, setPaymentMethod] = useState<'nxtpe' | 'ecobank' | 'momo'>('nxtpe');
  const [isCompletingPurchase, setIsCompletingPurchase] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState<Policy | null>(null);

  // Health multi-step state
  const [healthStep, setHealthStep] = useState(1);

  // Dynamic iframe height for embedded pages (no scroll)
  const [iframeHeight, setIframeHeight] = useState(800);

  // Product page states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Application form stepper states
  const [appStep, setAppStep] = useState(1);
  const [appGender, setAppGender] = useState<'Male' | 'Female' | ''>('');
  const [appDob, setAppDob] = useState('');
  const [appAddress, setAppAddress] = useState('Kampala, Uganda');
  const [appCountry, setAppCountry] = useState('Uganda');
  const [appAgreedTerms, setAppAgreedTerms] = useState(false);

  // Automatically pre-fill plate and match if passed from voice / search
  useEffect(() => {
    if (category === 'Motor' && initialPlate) {
      setPlateNumber(initialPlate);
      handlePlateLookup(initialPlate);
    }
  }, [initialPlate, category]);

  // Notify parent shell of stage changes (so it can adjust chrome, e.g. hide header)
  useEffect(() => {
    onStageChange?.(stage);
  }, [stage, onStageChange]);

  // Bridge: receive actions from the embedded Motor listing page (postMessage)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.source !== 'maas-motor-listing') return;
      if (data.action === 'buy') {
        const providers = getProvidersForCategory('Motor');
        const match = providers.find(p =>
          (data.provider || '').toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
        );
        setSelectedProviderId((match || providers[0]).id);
        setStage('details');
        window.scrollTo(0, 0);
      } else if (data.action === 'navigate') {
        if (data.target === 'edit') {
          setStage('questions');
        } else if (data.target === 'explore') {
          onBack();
        }
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onBack]);

  // Bridge: receive actions from Vehicle Lookup Stitch page
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.source !== 'maas-vehicle-lookup') return;
      if (data.action === 'confirm') {
        if (data.plate) setPlateNumber(data.plate);
        setStage('listing');
        window.scrollTo(0, 0);
      } else if (data.action === 'manual') {
        setShowManualMotor(true);
      } else if (data.action === 'back') {
        onBack();
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onBack]);

  // Bridge: receive actions from Health wizard Stitch pages
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.source !== 'maas-health-wizard') return;
      if (data.action === 'next') {
        if (healthStep < 5) {
          setHealthStep(healthStep + 1);
        } else {
          setStage('listing');
        }
        window.scrollTo(0, 0);
      } else if (data.action === 'back') {
        if (healthStep > 1) {
          setHealthStep(healthStep - 1);
        } else {
          onBack();
        }
        window.scrollTo(0, 0);
      } else if (data.action === 'complete') {
        setStage('listing');
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [healthStep, onBack]);

  // Iframe auto-resize: listen for height reports from embedded pages
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || data.source !== 'maas-iframe-resize') return;
      if (typeof data.height === 'number' && data.height > 0) {
        setIframeHeight(data.height);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Reset iframe height when switching health steps or stages
  useEffect(() => {
    setIframeHeight(800);
  }, [healthStep, stage]);

  // Handle Motor plate lookup
  const handlePlateLookup = (plateToQuery?: string) => {
    const query = plateToQuery || plateNumber;
    if (!query.trim()) return;

    setIsLookingUp(true);
    setLookupResult(null);

    setTimeout(() => {
      setIsLookingUp(false);
      const res = getVehicleForPlate(query);
      setLookupResult(res);
      // Automatically disable manual mode if we successfully retrieved DMV records
      if (res) {
        setShowManualMotor(false);
      }
    }, 1200);
  };

  const fillPlate = (selected: string) => {
    setPlateNumber(selected);
    handlePlateLookup(selected);
  };

  const toggleManualMotorFields = () => {
    setShowManualMotor(!showManualMotor);
    if (!showManualMotor) {
      setLookupResult(null);
    }
  };

  // Generate three dynamically customized quote choices based on questionnaire input
  const getPlanList = () => {
    let basePrice = 20;
    let titlePrefix = 'Auto Cover';
    let coverageLimit = 45000;
    let insuredItem = 'Registered Asset';

    if (category === 'Motor') {
      const activeValue = lookupResult ? lookupResult.value : parseInt(manValue) || 28000;
      insuredItem = lookupResult ? lookupResult.makeModel : manMakeMod;
      titlePrefix = 'Motor Auto Cover';
      
      // Calculate dynamic price based on 0.55% of car value/year as a monthly base
      basePrice = Math.max(12, Math.round(activeValue * 0.0055 / 12)); 
      
      // Fine-tune prices based on answers to the specific set of questions
      if (vehicleUsage === 'business') basePrice += 9;
      if (vehicleUsage === 'ridehailing') basePrice += 16;
      
      const ageNum = parseInt(driverAge) || 32;
      if (ageNum < 25) basePrice += 12; // young drivers pay more
      if (ageNum > 70) basePrice += 4;
      
      const expNum = parseInt(driverExperience) || 8;
      if (expNum < 3) basePrice += 14; // low experience surcharge
      else if (expNum > 10) basePrice = Math.max(10, basePrice - 5); // direct discount
      
      if (annualMileage === 'high') basePrice += 7;
      if (annualMileage === 'low') basePrice = Math.max(8, basePrice - 3);
      
      if (!cleanRecord) basePrice += 22; // accident history surcharge
      
      coverageLimit = activeValue;
    } else if (category === 'Health') {
      insuredItem = `Wellness Protection (${familySize})`;
      titlePrefix = `Wellness Health Cover`;
      
      let baseTierPrice = 24;
      if (familySize === 'Self Only') baseTierPrice = 16;
      if (familySize === 'Executive Clan Plan') baseTierPrice = 48;
      
      basePrice = baseTierPrice;
      coverageLimit = familySize === 'Self Only' ? 75000 : familySize === 'Self + Family' ? 180000 : 450000;
      
      const ageNum = parseInt(healthAge) || 32;
      if (ageNum > 50) basePrice += 14;
      if (preconditions === 'Chronic') basePrice += 22;
      if (preconditions === 'Minor (Allergies)') basePrice += 6;
      if (!hasRecentCheckup) basePrice += 5;
    } else if (category === 'Life') {
      insuredItem = 'Life & Family Safety Legacy';
      titlePrefix = `Legacy Trust Life Protection`;
      basePrice = isSmoker ? 35 : 18;
      coverageLimit = dependentsCount === '1' ? 150000 : dependentsCount === '2' ? 250000 : 400000;
      
      if (benefitMultiplier === '15x') { basePrice += 8; coverageLimit *= 1.5; }
      else if (benefitMultiplier === '20x') { basePrice += 18; coverageLimit *= 2.0; }
      
      if (annualIncome === 'Under $50,000') { basePrice = Math.max(10, basePrice - 3); coverageLimit *= 0.8; }
      else if (annualIncome === 'Over $100,000') { basePrice += 10; coverageLimit *= 1.4; }
    } else if (category === 'Device') {
      insuredItem = `${deviceModel}`;
      titlePrefix = 'Smart Device Secure Protection';
      const parsedValue = parseInt(deviceValue) || 1200;
      basePrice = Math.max(6, Math.round(parsedValue * 0.006));
      coverageLimit = parsedValue;
      
      if (deviceCondition === 'Refurbished') basePrice += 3;
      if (deviceCondition === 'New') basePrice = Math.max(5, basePrice - 1);
    } else {
      insuredItem = `${category} Specialized Asset`;
      titlePrefix = `${category} Protective Guarantee`;
      basePrice = 18;
      coverageLimit = 30000;
    }

    // Return custom list of three tailored plans
    return [
      {
        id: 'plan-basic' as const,
        name: 'Starter Cover / Third-Party Only',
        badge: 'Eco Slim',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        payoutCapText: '75% pay-out cap',
        description: category === 'Motor' 
          ? 'Essential third-party injury & property legal liability protection. Standard co-pay applies.'
          : 'Essential tier coverage protecting against primary catastrophe risks. Clean self-funded co-pay.',
        price: Math.round(basePrice * 0.70),
        coverage: Math.round(coverageLimit * 0.75),
        features: category === 'Motor' ? [
          'Unlimited Third-Party bodily injury liability',
          'Third-Party property damage cover up to $15,000',
          'Standard towing assistance service (up to 25km rescue)',
          'Flexible standard deductible deductible limits'
        ] : [
          'Standard emergency ward cover & hospital transport',
          'Diagnostic test panel direct reimbursement',
          '24/7 teleconsultation access to certified clinicians',
          'Participating list of local district clinics'
        ]
      },
      {
        id: 'plan-standard' as const,
        name: 'Standard Comprehensive Shield',
        badge: 'Most Popular',
        badgeColor: 'bg-primary/10 text-primary border-primary/20',
        payoutCapText: '95% pay-out cap',
        description: category === 'Motor'
          ? 'Full collision, theft, water, and third-party liabilities cover. Direct swift Ecobank clearing.'
          : 'Fully balanced everyday protection option. Instant direct settlement of standard clinic bills.',
        price: Math.round(basePrice * 1.0) + (waiverOption ? 4 : 0) + (extraAssistance ? 6 : 0),
        coverage: Math.round(coverageLimit * 0.95),
        features: category === 'Motor' ? [
          'All coverage in Starter Cover',
          'Full own-vehicle collision damage repairs',
          'Fire, burglary, severe vandalism, and flood protections',
          'Direct billing network at 150+ professional garages',
          'No limit premium windshield crack repair & replacement',
          'Comprehensive roadside towing & tire change assistance'
        ] : [
          'All coverage in Starter Cover',
          'Full inpatient surgery & standard ward hospitalization fee cover',
          'Specialist consultation fee direct payouts',
          'Chronic & prescription medicines 100% offset',
          'Accidental out-of-country emergency treatment cover'
        ]
      },
      {
        id: 'plan-pro' as const,
        name: 'Elite Comprehensive Premium',
        badge: '100% Protection',
        badgeColor: 'bg-[#BED600]/20 text-primary border-[#BED600]/30',
        payoutCapText: '100% pay-out cap',
        description: category === 'Motor'
          ? 'Absolute zero co-pay protection. Includes nil-depreciation, spare vehicle, and premium rescue.'
          : 'Elite-tier medical protection with extensive limits, zero co-pays, and overseas hospital referrals.',
        price: Math.round(basePrice * 1.35) + (waiverOption ? 4 : 0) + (extraAssistance ? 6 : 0),
        coverage: Math.round(coverageLimit * 1.25),
        features: category === 'Motor' ? [
          'All coverage in Standard Shield',
          'Complete excess-fee waiver (Zero deductible payout)',
          'Nil depreciation (100% full value parts replacement)',
          'Convenient replacement support car during repairs (up to 12 days)',
          'Immediate Pan-African helicopter medical evacuation logistics',
          'Global international driving license coverage extension'
        ] : [
          'All coverage in Standard Shield',
          'Zero deductible cost (Standard co-pay is waved completely)',
          'Private hospital room lodging and direct admission priority',
          'Specialized international hospital referral & treatment logic',
          'Personal wellness plan supervisor & priority claims queue'
        ]
      }
    ];
  };

  const activePlans = getPlanList();
  const selectedPlan = activePlans.find(p => p.id === selectedPlanId) || activePlans[1];

  // Navigate forward with validation
  const handleProceedToListing = () => {
    if (category === 'Motor' && !lookupResult && !showManualMotor) {
      alert('Please perform a License plate lookup or toggle manual details entry to proceed.');
      return;
    }
    setStage('listing');
  };

  // Submit secure policy creation
  const handlePurchaseSecurely = () => {
    setIsCompletingPurchase(true);

    setTimeout(() => {
      const randCode = `POL-${category.charAt(0).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const activeItemName = category === 'Motor' 
        ? (lookupResult ? lookupResult.makeModel : manMakeMod) + ` (${plateNumber || 'Manual Vehicle'})`
        : selectedPlan.name;

      const newPolicy: Policy = {
        id: `pol-${Date.now()}`,
        category,
        title: selectedPlan.name,
        insuredItemName: activeItemName,
        premium: selectedPlan.price,
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Active',
        coverageAmount: selectedPlan.coverage,
        code: randCode
      };

      setGeneratedPolicy(newPolicy);
      setIsCompletingPurchase(false);
      setStage('policy');
    }, 2200);
  };

  // Callback to parent dashboard redirect
  const handleFinishWizard = () => {
    if (generatedPolicy) {
      onCompleted(generatedPolicy);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center py-6 w-full animate-fade-in" id="wizard-base-main">

      <div className="w-full max-w-4xl px-4 mx-auto">

        {/* 1. STATE SUCCESS CERTIFICATE */}
        {stage === 'policy' && generatedPolicy && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 sm:p-10 text-center flex flex-col items-center animate-in zoom-in-95 duration-500 max-w-2xl mx-auto" id="wizard-success-card">
            
            <div className="w-18 h-18 bg-[#639E32]/10 text-success-teal rounded-full flex items-center justify-center mb-5 animate-bounce">
              <CheckCircle2 className="w-11 h-11 text-success-teal" />
            </div>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-teal/10 text-success-teal rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
              <Shield className="w-3.5 h-3.5" /> MaaS Secure Certified
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">Microinsurance Coverage Issued!</h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
              Your comprehensive protective coverage has been settled and registered securely on the MaaS Pan-African Ecobank system ledger.
            </p>

            {/* Premium Microinsurance Certificate Block */}
            <div className="w-full bg-slate-50 rounded-2xl border border-gray-100 p-5 mt-6 mb-8 text-left space-y-3.5 relative overflow-hidden" id="policy-success-receipt">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full filter blur-xl pointer-events-none translate-x-12 -translate-y-12"></div>
              
              <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                <div>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block">Policy Registry Code</span>
                  <span className="text-xs sm:text-sm font-black text-primary font-mono">{generatedPolicy.code}</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/5 rounded-lg border border-primary/15 text-[10px] font-bold text-primary">
                    <Award className="w-3.5 h-3.5 text-primary" /> Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider">Asset Covered</span>
                  <span className="font-extrabold text-gray-900 line-clamp-1">{generatedPolicy.insuredItemName}</span>
                </div>
                <div>
                  <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider">Full Policy Underwriter</span>
                  <span className="font-bold text-gray-700 flex items-center gap-1">
                    Ecobank Microassurance
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2.5">
                  <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider">Authorized Premium</span>
                  <span className="font-black text-[#639E32] text-sm sm:text-base">${generatedPolicy.premium}/month</span>
                </div>
                <div className="border-t border-gray-100 pt-2.5">
                  <span className="block text-gray-400 text-[10px] font-bold uppercase tracking-wider">Active Cap Limits</span>
                  <span className="font-black text-primary text-sm sm:text-base">${generatedPolicy.coverageAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200/50 pt-3 flex justify-between items-center text-[11px] text-gray-400 font-medium">
                <span>Direct Automatic Renewals: Active</span>
                <span>Renewal Date: {generatedPolicy.renewalDate}</span>
              </div>
            </div>

            <button
              onClick={handleFinishWizard}
              className="w-full py-4 bg-primary text-white hover:bg-opacity-95 rounded-xl font-bold active:scale-95 transition-all text-xs sm:text-sm shadow-xl shadow-primary/10"
              id="success-portal-redirect-btn"
            >
              Access Policy Dashboard & Claims Portal
            </button>
          </div>
        )}

        {/* STAGE 1: QUESTIONNAIRE — Health uses Stitch multi-step iframes, Motor uses vehicle-lookup iframe */}
        {stage === 'questions' && category === 'Health' && (() => {
          const healthPages = [
            '/health-step1-whos-covered.html',
            '/health-step2-member-ages.html',
            '/health-step3-location.html',
            '/health-step4-contact.html',
            '/health-step5-medical.html',
          ];
          return (
            <div id="stage-health-wizard-view">
              <iframe
                key={`health-step-${healthStep}`}
                src={healthPages[healthStep - 1]}
                title={`Health Insurance - Step ${healthStep}`}
                className="w-full border-0 block"
                scrolling="no"
                style={{ height: `${iframeHeight}px`, overflow: 'hidden' }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
              />
            </div>
          );
        })()}

        {stage === 'questions' && category === 'Motor' && (
          <div
            className="w-screen relative left-1/2 -translate-x-1/2 -mt-6"
            id="stage-vehicle-lookup-view"
          >
            <iframe
              ref={(el) => {
                if (el && initialPlate) {
                  el.addEventListener('load', () => {
                    el.contentWindow?.postMessage({ source: 'maas-wizard', plate: initialPlate }, '*');
                  }, { once: true });
                }
              }}
              src="/vehicle-lookup.html"
              title="Vehicle Lookup"
              className="w-full border-0 block"
              style={{ height: 'calc(100vh - 56px)', minHeight: '700px' }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
            />
          </div>
        )}

        {stage !== 'policy' && (
          <div className="transition-all duration-300" id="wizard-stage-panel">
            {stage === 'questions' && category !== 'Motor' && category !== 'Health' && (
              <div className="space-y-6" id="stage-questions-view">
                <div className="mb-2">
                  <h2 className="font-black text-2xl sm:text-3xl text-primary font-sans leading-tight">
                    Tell us about your {category}
                  </h2>
                </div>

                {/* NON-MOTOR categories still use the old form */}
                {false && category === 'Motor' && (
                  <div className="space-y-6" id="form-motor-questions">

                    {/* Vehicle Lookup (Standard Lookup Card Restored) */}
                    <div className="bg-slate-50/50 rounded-2xl border border-gray-100 p-5 space-y-4">
                      <div>
                        <label htmlFor="plate-lookup-input" className="font-bold text-xs sm:text-sm text-primary block mb-2">
                          Enter License Plate Number
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="plate-lookup-input"
                            type="text"
                            value={plateNumber}
                            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                            placeholder="e.g. UBM 492X"
                            className="w-full h-14 sm:h-16 bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 text-base sm:text-xl font-black px-4 uppercase tracking-widest placeholder:normal-case placeholder:font-normal placeholder:text-gray-400 transition-all outline-none rounded-xl shadow-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handlePlateLookup()}
                            disabled={isLookingUp || !plateNumber.trim()}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-primary text-white h-10 px-4 sm:px-5 rounded-lg font-bold text-xs hover:bg-opacity-95 active:scale-95 transition-all flex items-center gap-1.5"
                          >
                            {isLookingUp ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <span>Lookup</span>
                                <Search className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Popular Search Badges */}
                      <div id="popular-plates-chips">
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-2">Popular Searches</p>
                        <div className="flex flex-wrap gap-2">
                          {POPULAR_PLATES.map((plate) => (
                            <button
                              key={plate}
                              type="button"
                              onClick={() => fillPlate(plate)}
                              className="px-3.5 py-1.5 bg-white border border-gray-200 hover:border-secondary hover:bg-secondary/5 rounded-xl text-xs font-bold text-secondary transition-all active:scale-95"
                            >
                              {plate}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Lookup Results view */}
                      {lookupResult && (
                        <div className="bg-white border border-emerald-500/40 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-top-4" id="dmv-lookup-success">
                          <div className="w-16 h-16 bg-[#639E32]/5 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
                            <Car className="w-8 h-8 text-secondary" />
                          </div>
                          <div className="flex-grow text-center md:text-left">
                            <h4 className="font-extrabold text-sm sm:text-base text-primary">{lookupResult.makeModel}</h4>
                            <p className="text-[11px] text-gray-400 font-semibold">
                              {lookupResult.year} model • {lookupResult.fuelType} Fuel • {lookupResult.engineCc.toLocaleString()}cc Engine
                            </p>
                            <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-success-teal bg-success-teal/10 px-2 py-0.5 rounded-full font-bold mt-1">
                              <Check className="w-3 h-3" /> DMV Database Match Verified
                            </span>
                          </div>
                          <div className="text-center md:text-right flex-shrink-0">
                            <span className="block text-[9px] text-gray-400 uppercase tracking-widest font-extrabold leading-none">Market Value</span>
                            <span className="text-lg font-black text-primary">${lookupResult.value.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      {/* Manual inputs fallback toggle */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={toggleManualMotorFields}
                          className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1"
                        >
                          {showManualMotor ? 'Use Automated Database Lookup' : 'Enter car specifications manually'}
                        </button>

                        {showManualMotor && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 bg-white p-4 rounded-xl border border-gray-100" id="manual-inputs-form">
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Make & Model</label>
                              <input
                                type="text"
                                value={manMakeMod}
                                onChange={(e) => setManMakeMod(e.target.value)}
                                className="w-full h-10 px-3 bg-slate-50 border border-gray-200 rounded-lg outline-none text-xs sm:text-sm font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Manufacturing Year</label>
                              <input
                                type="number"
                                value={manYear}
                                onChange={(e) => setManYear(e.target.value)}
                                className="w-full h-10 px-3 bg-slate-50 border border-gray-200 rounded-lg outline-none text-xs sm:text-sm font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Estimated Value (USD)</label>
                              <input
                                type="number"
                                value={manValue}
                                onChange={(e) => setManValue(e.target.value)}
                                className="w-full h-10 px-3 bg-slate-50 border border-gray-200 rounded-lg outline-none text-xs sm:text-sm font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Fuel Type</label>
                              <select
                                value={manFuel}
                                onChange={(e) => setManFuel(e.target.value)}
                                className="w-full h-10 px-3 bg-slate-50 border border-gray-200 rounded-lg outline-none text-xs sm:text-sm font-semibold"
                              >
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Hybrid/Electric">Hybrid or EV</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dynamic set of questions for Motor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      
                      {/* Vehicle Usage */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2.5">Vehicle Usage Type</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { id: 'personal', title: 'Personal / Leisure', desc: 'Household use, commute' },
                            { id: 'business', title: 'Business / Company', desc: 'Commercial transit, clients' },
                            { id: 'ridehailing', title: 'Ride-Hailing / Taxi', desc: 'Uber, Bolt, or Transport' }
                          ].map((use) => (
                            <button
                              key={use.id}
                              type="button"
                              onClick={() => setVehicleUsage(use.id as any)}
                              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
                                vehicleUsage === use.id
                                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                  : 'border-gray-100 bg-slate-50/50 hover:bg-slate-50'
                              }`}
                            >
                              <span className="block font-bold text-xs text-primary leading-tight">{use.title}</span>
                              <span className="block text-[9px] text-gray-400 mt-1">{use.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Driver's Age */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-xs sm:text-sm text-primary block">Primary Driver Age</label>
                          <span className="text-xs bg-slate-100 font-bold text-primary px-2.5 py-0.5 rounded-lg">{driverAge} Yrs</span>
                        </div>
                        <input 
                          type="range"
                          min="18"
                          max="80"
                          value={driverAge}
                          onChange={(e) => setDriverAge(e.target.value)}
                          className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                          <span>18 Yrs</span>
                          <span>80 Yrs</span>
                        </div>
                      </div>

                      {/* Driving Experience */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-xs sm:text-sm text-primary block">Driving Experience</label>
                          <span className="text-xs bg-slate-100 font-bold text-primary px-2.5 py-0.5 rounded-lg">{driverExperience} Years</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="40"
                          value={driverExperience}
                          onChange={(e) => setDriverExperience(e.target.value)}
                          className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                          <span>First Year</span>
                          <span>40+ Years</span>
                        </div>
                      </div>

                      {/* Annual Mileage */}
                      <div>
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2">Estimated Annual Mileage</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'low', label: 'Under 5k km' },
                            { id: 'standard', label: '5k - 15k km' },
                            { id: 'high', label: 'Above 15k km' }
                          ].map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setAnnualMileage(m.id as any)}
                              className={`py-2.5 text-[11px] font-bold rounded-lg border text-center transition-all ${
                                annualMileage === m.id
                                  ? 'border-primary bg-primary/5 text-primary'
                                  : 'border-gray-200 bg-white text-gray-500 hover:bg-slate-50'
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Safe Driver declaration */}
                      <div className="p-3.5 bg-slate-50/50 rounded-xl border border-gray-100 flex items-center justify-between col-span-1">
                        <div className="max-w-[75%]">
                          <p className="text-xs font-bold text-primary leading-tight">Clean Record Statement</p>
                          <p className="text-[9px] text-gray-400 mt-0.5 leading-none">No traffic citations or major claims in 3 yrs</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCleanRecord(!cleanRecord)}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${cleanRecord ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                          <span className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-transform ${cleanRecord ? 'translate-x-[22px]' : 'translate-x-[4px]'}`}></span>
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* B. HEALTH DETAILS */}
                {category === 'Health' && (
                  <div className="space-y-6" id="form-health-questions">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2">Primary Insured Age</label>
                        <input
                          type="number"
                          value={healthAge}
                          onChange={(e) => setHealthAge(e.target.value)}
                          className="w-full h-11 px-4 bg-slate-50/50 border border-gray-100 focus:border-primary rounded-xl outline-none text-xs sm:text-sm font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2">Family Membership Scope</label>
                        <select
                          value={familySize}
                          onChange={(e) => setFamilySize(e.target.value)}
                          className="w-full h-11 px-3 bg-slate-50/50 border border-gray-100 focus:border-primary rounded-xl outline-none text-xs sm:text-sm font-semibold"
                        >
                          <option value="Self Only">Self Only</option>
                          <option value="Self + Family">Self + Family (Spouse & 2 Children)</option>
                          <option value="Executive Clan Plan">Executive (Extended Family Max 5)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-xs sm:text-sm text-primary block mb-3">Pre-Existing Wellness Declared Conditions</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {(['None', 'Minor (Allergies)', 'Chronic'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setPreconditions(opt)}
                            className={`py-3 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                              preconditions === opt
                                ? 'bg-primary/5 border-primary text-primary'
                                : 'bg-slate-50/50 border-gray-100 text-gray-500 hover:bg-slate-100/50'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-gray-100">
                      <div className="max-w-[75%]">
                        <h4 className="text-xs font-bold text-primary leading-tight">Recent Medical Checkup</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">I have had a complete certified health checkup within the last 6 months</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasRecentCheckup(!hasRecentCheckup)}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${hasRecentCheckup ? 'bg-primary' : 'bg-gray-200'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-transform ${hasRecentCheckup ? 'translate-x-[22px]' : 'translate-x-[4px]'}`}></span>
                      </button>
                    </div>
                  </div>
                )}

                {/* C. LIFE DETAILS */}
                {category === 'Life' && (
                  <div className="space-y-6" id="form-life-questions">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2">Annual Income Bracket</label>
                        <select
                          value={annualIncome}
                          onChange={(e) => setAnnualIncome(e.target.value)}
                          className="w-full h-11 px-3 bg-slate-50/50 border border-gray-100 focus:border-primary rounded-xl outline-none text-xs sm:text-sm font-semibold"
                        >
                          <option value="Under $50,000">Under $50,000</option>
                          <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                          <option value="Over $100,000">Over $100,000</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2">Number of Listed Beneficiaries</label>
                        <select
                          value={dependentsCount}
                          onChange={(e) => setDependentsCount(e.target.value)}
                          className="w-full h-11 px-3 bg-slate-50/50 border border-gray-100 focus:border-primary rounded-xl outline-none text-xs sm:text-sm font-semibold"
                        >
                          <option value="1">1 Beneficiary</option>
                          <option value="2">2 Beneficiaries</option>
                          <option value="3+">3 or more Beneficiaries</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Smoking Declared Status */}
                      <div className="p-4 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-gray-100">
                        <div>
                          <p className="text-xs font-bold text-primary leading-tight">Tobacco Declared Status</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">I consume cigarette/nicotine items regularly</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsSmoker(!isSmoker)}
                          className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${isSmoker ? 'bg-primary' : 'bg-gray-200'}`}
                        >
                          <span className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-transform ${isSmoker ? 'translate-x-[22px]' : 'translate-x-[4px]'}`}></span>
                        </button>
                      </div>

                      {/* Trust legacy multiplier */}
                      <div>
                        <label className="text-xs font-bold text-primary block mb-2">Desired Protection Multiplier</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['10x', '15x', '20x'] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setBenefitMultiplier(m)}
                              className={`py-2 text-xs font-extrabold rounded-xl border text-center transition-all ${
                                benefitMultiplier === m
                                  ? 'bg-primary/5 border-primary text-primary'
                                  : 'bg-white border-gray-100 text-gray-500 hover:bg-slate-50'
                              }`}
                            >
                              {m} limit
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* D. DEVICE DETAILS */}
                {category === 'Device' && (
                  <div className="space-y-6" id="form-device-questions">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2">Gadget Model Name</label>
                        <input
                          type="text"
                          value={deviceModel}
                          onChange={(e) => setDeviceModel(e.target.value)}
                          className="w-full h-11 px-4 bg-slate-50/50 border border-gray-100 focus:border-primary rounded-xl outline-none text-xs sm:text-sm font-semibold"
                          placeholder="e.g. MacBook Pro 14"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2">Device Estimated Retail Value (USD)</label>
                        <input
                          type="number"
                          value={deviceValue}
                          onChange={(e) => setDeviceValue(e.target.value)}
                          className="w-full h-11 px-4 bg-slate-50/50 border border-gray-100 focus:border-primary rounded-xl outline-none text-xs sm:text-sm font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2">Device Condition State</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['New', 'Mint', 'Refurbished'] as const).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setDeviceCondition(c)}
                              className={`py-2 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                                deviceCondition === c
                                  ? 'bg-primary/5 border-primary text-primary'
                                  : 'bg-slate-50/50 border-gray-100 text-gray-500 hover:bg-slate-100/50'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="font-bold text-xs sm:text-sm text-primary block mb-2">Device IMEI or Serial Code</label>
                        <input
                          type="text"
                          value={deviceSerial}
                          onChange={(e) => setDeviceSerial(e.target.value)}
                          className="w-full h-11 px-4 bg-slate-50/50 border border-gray-100 focus:border-primary rounded-xl outline-none text-xs sm:text-sm font-semibold text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Secure Trust Indicators matching Home Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-gray-100" id="wizard-badges">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-slate-50/50">
                    <Shield className="w-4.5 h-4.5 text-success-teal shrink-0" />
                    <div>
                      <p className="font-black text-xs text-primary leading-none">Security Guaranteed</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Ecobank premium verified reserves</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-slate-50/50">
                    <Sparkles className="w-4.5 h-4.5 text-secondary shrink-0" />
                    <div>
                      <p className="font-black text-xs text-primary leading-none">Real-Time Clearance</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">40-sec direct digital processing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-slate-50/50">
                    <User className="w-4.5 h-4.5 text-primary shrink-0" />
                    <div>
                      <p className="font-black text-xs text-primary leading-none">Licensed Network</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Under Pan-African regulatory treaty</p>
                    </div>
                  </div>
                </div>

                {/* Footer buttons for Stage 1 */}
                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full sm:w-auto px-6 py-2.5 border border-gray-200 text-gray-500 hover:bg-slate-50 rounded-xl font-bold transition-colors text-xs sm:text-sm"
                  >
                    Exit Portal
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToListing}
                    className="w-full sm:w-auto px-8 py-3 bg-primary text-white hover:bg-opacity-95 rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <span>Get Real-Time Quotes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STAGE 2: MARKETPLACE PRODUCT LISTING */}
            {/* MOTOR LISTING — full-bleed Stitch iframe */}
            {stage === 'listing' && category === 'Motor' && (
              <div
                className="w-screen relative left-1/2 -translate-x-1/2 -mt-6"
                id="stage-listing-view"
              >
                <iframe
                  src="/motor-listing.html"
                  title="Motor Insurance Quotes"
                  className="w-full border-0 block"
                  style={{ height: 'calc(100vh - 56px)', minHeight: '600px' }}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                />
              </div>
            )}

            {/* NON-MOTOR LISTING — native React marketplace */}
            {stage === 'listing' && category !== 'Motor' && (() => {
              const providers = getProvidersForCategory(category);
              const assetName = category === 'Motor'
                ? (lookupResult ? `${lookupResult.makeModel} ${lookupResult.year}` : manMakeMod)
                : category === 'Health' ? `Wellness (${familySize})`
                : category === 'Device' ? deviceModel
                : category === 'Life' ? 'Life & Legacy'
                : `${category} Cover`;
              const assetSubline = category === 'Motor'
                ? (lookupResult ? `${lookupResult.plateNumber} • ${lookupResult.fuelType} • ${lookupResult.engineCc}cc` : `${manYear} • ${manFuel}`)
                : category === 'Health' ? `Age ${healthAge} • ${preconditions} conditions`
                : category === 'Device' ? `${deviceCondition} • Value $${deviceValue}`
                : category === 'Life' ? `${dependentsCount} beneficiaries • ${annualIncome}`
                : `${category} protection`;
              const assetValue = category === 'Motor'
                ? (lookupResult ? lookupResult.value : parseInt(manValue) || 28000)
                : category === 'Device' ? (parseInt(deviceValue) || 1200)
                : category === 'Health' ? (familySize === 'Self Only' ? 75000 : familySize === 'Self + Family' ? 180000 : 450000)
                : 250000;

              const getProviderPrice = (provider: InsuranceProvider, idx: number) => {
                let base = Math.max(12, Math.round(assetValue * 0.0055 / 12));
                if (category === 'Health') base = familySize === 'Self Only' ? 16 : familySize === 'Self + Family' ? 28 : 48;
                if (category === 'Life') base = isSmoker ? 35 : 18;
                if (category === 'Device') base = Math.max(6, Math.round(assetValue * 0.006));
                const multipliers = [1.0, 0.86, 1.13];
                return Math.round(base * (multipliers[idx] || 1.0));
              };

              const getProviderCoverage = (idx: number) => {
                const multipliers = [1.0, 0.85, 1.14];
                return Math.round(assetValue * (multipliers[idx] || 1.0));
              };

              const ugxRate = 3750;

              return (
                <div className="space-y-0" id="stage-listing-view">
                  {/* Marketplace Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                    <div>
                      <span className="inline-block text-[9px] bg-secondary/15 text-secondary px-3 py-1 rounded-full font-black uppercase tracking-widest mb-1.5">Compare & Select</span>
                      <h3 className="font-extrabold text-xl sm:text-2xl text-primary leading-tight">Compare & Select</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Comprehensive Coverage quotes from trusted partners</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 font-semibold">Compare All Plans</span>
                      <button type="button" className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Main Marketplace Layout: Sidebar + Cards */}
                  <div className="flex flex-col lg:flex-row gap-6">

                    {/* LEFT SIDEBAR */}
                    <div className="lg:w-[260px] shrink-0 space-y-4">
                      {/* Your Selection Summary Card */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                        <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">Your Selection</p>
                        <div>
                          <h4 className="font-bold text-sm text-primary leading-tight">{assetName}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{assetSubline}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStage('questions')}
                          className="flex items-center gap-1.5 text-[11px] text-primary font-bold hover:underline"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit Details</span>
                        </button>
                      </div>

                      {/* Refine Search Card */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">Refine Search</p>
                          <button
                            type="button"
                            onClick={() => {
                              setProviderFilterChecked([]);
                              setAddonFilters([]);
                            }}
                            className="text-[10px] text-primary font-bold hover:underline"
                          >
                            Clear All
                          </button>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2">
                          <p className="text-[10px] text-gray-500 font-bold">Price Range (Annual)</p>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-gray-600">
                              USD 500k
                            </div>
                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-gray-600">
                              UGX 2.5M+
                            </div>
                          </div>
                        </div>

                        {/* Insurance Providers */}
                        <div className="space-y-2">
                          <p className="text-[10px] text-gray-500 font-bold">Insurance Providers</p>
                          <div className="space-y-1.5">
                            {providers.map((prov) => (
                              <label key={prov.id} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={providerFilterChecked.includes(prov.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setProviderFilterChecked([...providerFilterChecked, prov.id]);
                                    } else {
                                      setProviderFilterChecked(providerFilterChecked.filter(id => id !== prov.id));
                                    }
                                  }}
                                  className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                                />
                                <span className="text-[11px] text-gray-600 font-medium group-hover:text-primary transition-colors">{prov.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Additional Add-ons */}
                        <div className="space-y-2 border-t border-gray-100 pt-3">
                          <p className="text-[10px] text-gray-500 font-bold">Additional Add-ons</p>
                          <div className="space-y-1.5">
                            {['Roadside Assistance', 'Courtesy Car', 'Windshield Excess'].map((addon) => (
                              <label key={addon} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={addonFilters.includes(addon)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setAddonFilters([...addonFilters, addon]);
                                    } else {
                                      setAddonFilters(addonFilters.filter(a => a !== addon));
                                    }
                                  }}
                                  className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
                                />
                                <span className="text-[11px] text-gray-600 font-medium group-hover:text-primary transition-colors">{addon}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: PROVIDER PLAN CARDS */}
                    <div className="flex-1 space-y-4">
                      {providers.map((provider, idx) => {
                        const price = getProviderPrice(provider, idx);
                        const coverage = getProviderCoverage(idx);
                        const isSelected = selectedProviderId === provider.id;
                        const filteredOut = providerFilterChecked.length > 0 && !providerFilterChecked.includes(provider.id);

                        if (filteredOut) return null;

                        return (
                          <div
                            key={provider.id}
                            className={`bg-white rounded-xl border-2 p-5 sm:p-6 transition-all duration-300 relative group ${
                              isSelected
                                ? 'border-primary shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            {/* Recommended Badge */}
                            {provider.recommended && (
                              <div className="absolute top-0 left-6 -translate-y-1/2">
                                <span className="px-3 py-0.5 bg-eco-lime text-primary text-[9px] font-black uppercase tracking-wider rounded-full border border-eco-lime/50">
                                  Recommended
                                </span>
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-5">
                              {/* Provider Identity */}
                              <div className="flex items-start gap-4 sm:w-[180px] shrink-0">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                                  style={{ backgroundColor: provider.logoBg, color: provider.logoColor }}
                                >
                                  {provider.logoInitial}
                                </div>
                                <div className="sm:hidden flex-1">
                                  <h4 className="font-bold text-sm text-primary leading-tight">{provider.name}</h4>
                                  <p className="text-[10px] text-gray-400 font-medium">{provider.tagline}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-bold text-gray-600">{provider.rating}</span>
                                    <span className="text-[9px] text-gray-400">• {provider.claimsRatio} claims</span>
                                  </div>
                                </div>
                                <div className="hidden sm:block">
                                  <h4 className="font-bold text-sm text-primary leading-tight">{provider.name}</h4>
                                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{provider.tagline}</p>
                                  <div className="flex items-center gap-1 mt-1.5">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span className="text-[10px] font-bold text-gray-600">{provider.rating}</span>
                                  </div>
                                  <span className="text-[9px] text-gray-400 block mt-0.5">{provider.claimsRatio} claims ratio</span>
                                </div>
                              </div>

                              {/* Features Grid */}
                              <div className="flex-1 flex flex-wrap gap-2 items-start content-start">
                                {provider.features.map((feat, fIdx) => (
                                  <div
                                    key={fIdx}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-success-teal shrink-0" />
                                    <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">{feat}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Price & Action */}
                              <div className="sm:w-[160px] shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-1.5 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-5">
                                <div className="text-left sm:text-right">
                                  <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">Annual Premium</span>
                                  <span className="text-lg sm:text-xl font-black text-primary">UGX</span>
                                  <span className="text-lg sm:text-xl font-black text-primary ml-1">{(price * ugxRate).toLocaleString()}</span>
                                  <span className="block text-[10px] text-gray-400 font-medium">${price}/mo (USD)</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedProviderId(provider.id);
                                    const planIdx = idx === 0 ? 'plan-standard' : idx === 1 ? 'plan-basic' : 'plan-pro';
                                    setSelectedPlanId(planIdx as any);
                                    setStage('details');
                                  }}
                                  className={`px-5 py-2.5 rounded-lg font-bold text-xs transition-all active:scale-95 whitespace-nowrap ${
                                    isSelected
                                      ? 'bg-primary text-white shadow-md'
                                      : 'bg-primary text-white hover:bg-primary-container shadow-sm'
                                  }`}
                                >
                                  Select Plan
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {/* Info Banner */}
                      <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-primary font-medium leading-snug">
                          All quotes are based on {category === 'Motor' ? `a ${lookupResult?.year || manYear} ${assetName}` : assetName} with an estimated {category === 'Motor' ? 'market' : 'coverage'} value of UGX {(assetValue * ugxRate).toLocaleString()}. Final premiums may vary based on {category === 'Motor' ? 'vehicle inspection and document verification' : 'underwriting review'}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="pt-6 flex justify-between items-center border-t border-gray-100 mt-6">
                    <button
                      type="button"
                      onClick={() => setStage('questions')}
                      className="px-6 py-2.5 border border-gray-200 text-gray-500 hover:bg-slate-50 rounded-lg font-bold transition-colors text-xs sm:text-sm"
                    >
                      Go Back
                    </button>
                  </div>

                  {/* Footer attribution */}
                  <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 font-medium">
                      Powered by <span className="font-bold text-primary">Ecobank</span>. Regulated by the Insurance Regulatory Authority.
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* STAGE 3: PRODUCT PAGE (Britam-style full product page) */}
            {stage === 'details' && (() => {
              const providers = getProvidersForCategory(category);
              const selectedProvider = providers.find(p => p.id === selectedProviderId) || providers[0];
              const providerIdx = providers.indexOf(selectedProvider);
              const ugxRate = 3750;
              const assetVal = category === 'Motor'
                ? (lookupResult ? lookupResult.value : parseInt(manValue) || 28000)
                : category === 'Device' ? (parseInt(deviceValue) || 1200)
                : category === 'Health' ? (familySize === 'Self Only' ? 75000 : familySize === 'Self + Family' ? 180000 : 450000)
                : 250000;
              const premiumUsd = selectedPlan.price;
              const premiumUgx = premiumUsd * 12 * ugxRate;
              const coverageUgx = selectedPlan.coverage * ugxRate;

              const categoryIcon = category === 'Motor' ? <CarFront className="w-6 h-6" />
                : category === 'Health' ? <HeartPulse className="w-6 h-6" />
                : category === 'Life' ? <ShieldCheck className="w-6 h-6" />
                : category === 'Device' ? <Cpu className="w-6 h-6" />
                : category === 'Travel' ? <PlaneTakeoff className="w-6 h-6" />
                : category === 'Agric' ? <Wheat className="w-6 h-6" />
                : <Building className="w-6 h-6" />;

              const getCoverageItems = () => {
                if (category === 'Motor') return [
                  { title: 'Fire & Theft Protection', desc: 'Covers loss or damage from fire, theft, or attempted theft.' },
                  { title: 'Vehicle Protection', desc: 'Repairs or replacement if damaged in accident or natural disaster.' },
                  { title: 'Legal Liability', desc: 'Covers financial liability if you damage property or injure others.' },
                  { title: 'Passenger Medical', desc: 'Medical cover and compensation for you and passengers.' },
                  { title: '24/7 Roadside Assistance', desc: 'Emergency towing, flat tyres, battery jump-start anytime.' },
                  { title: 'Digital Policy Management', desc: 'Manage claims and updates through our fully digital process.' },
                ];
                if (category === 'Health') return [
                  { title: 'Inpatient Hospital Cover', desc: 'Full coverage for hospital stays, surgeries, and treatments.' },
                  { title: 'Outpatient Care', desc: 'Doctor visits, lab tests, and prescription medications covered.' },
                  { title: 'Dental & Optical', desc: 'Annual dental checkups and optical care included.' },
                  { title: 'Maternity Benefits', desc: 'Prenatal, delivery, and postnatal care for mother and baby.' },
                  { title: 'Emergency Evacuation', desc: 'Air ambulance and emergency medical transport when needed.' },
                  { title: 'Wellness Programs', desc: 'Preventive health screenings and wellness checkups annually.' },
                ];
                if (category === 'Life') return [
                  { title: 'Death Benefit', desc: 'Lump sum payout to your beneficiaries upon passing.' },
                  { title: 'Critical Illness Cover', desc: 'Payout upon diagnosis of listed critical illnesses.' },
                  { title: 'Disability Protection', desc: 'Income replacement if permanently disabled.' },
                  { title: 'Funeral Expense Cover', desc: 'Immediate payout to cover funeral and related costs.' },
                  { title: 'Education Fund', desc: "Children's education fund if policyholder passes away." },
                  { title: 'Investment Component', desc: 'Savings that grow with guaranteed returns over time.' },
                ];
                if (category === 'Device') return [
                  { title: 'Accidental Damage', desc: 'Covers drops, cracks, and liquid damage to your device.' },
                  { title: 'Theft Protection', desc: 'Full replacement if your device is stolen.' },
                  { title: 'Screen Replacement', desc: 'Free screen repairs at authorized service centers.' },
                  { title: 'Battery Replacement', desc: 'Battery swap when capacity drops below 80%.' },
                  { title: 'Worldwide Coverage', desc: 'Protection wherever you travel with your device.' },
                  { title: 'Express Repair', desc: 'Priority repair service with 24-hour turnaround.' },
                ];
                return [
                  { title: 'Comprehensive Protection', desc: 'Full coverage tailored to your specific needs.' },
                  { title: 'Claims Support', desc: '24/7 dedicated claims assistance and processing.' },
                  { title: 'Flexible Payments', desc: 'Monthly, quarterly, or annual payment options.' },
                  { title: 'Digital Management', desc: 'Manage everything from your mobile device.' },
                  { title: 'Pan-African Network', desc: 'Coverage across multiple African countries.' },
                  { title: 'Partner Benefits', desc: 'Exclusive discounts through the Ecobank network.' },
                ];
              };

              const getWhyFeatures = () => {
                if (category === 'Motor') return [
                  { icon: <Zap className="w-5 h-5" />, title: 'Fully Online Process', desc: 'Apply, upload documents, and pay online without visiting an office.' },
                  { icon: <CreditCard className="w-5 h-5" />, title: 'Flexible Payments', desc: 'Pay in full or choose convenient monthly installments.' },
                  { icon: <Upload className="w-5 h-5" />, title: 'Smart Document Upload', desc: 'Upload your documents and details are filled automatically.' },
                  { icon: <Camera className="w-5 h-5" />, title: 'Self Vehicle Inspection', desc: 'Upload photos of your vehicle instead of waiting for physical inspection.' },
                ];
                if (category === 'Health') return [
                  { icon: <Stethoscope className="w-5 h-5" />, title: 'Cashless Treatment', desc: 'Walk into any network hospital without upfront payment.' },
                  { icon: <Globe className="w-5 h-5" />, title: 'Wide Hospital Network', desc: 'Access to 500+ hospitals across East Africa.' },
                  { icon: <Clock className="w-5 h-5" />, title: 'Quick Claims', desc: 'Claims processed within 48 hours of submission.' },
                  { icon: <Heart className="w-5 h-5" />, title: 'Family Coverage', desc: 'One plan covers your entire family with no extra forms.' },
                ];
                if (category === 'Life') return [
                  { icon: <Shield className="w-5 h-5" />, title: 'Guaranteed Payout', desc: 'Your beneficiaries receive the full sum assured, guaranteed.' },
                  { icon: <CircleDollarSign className="w-5 h-5" />, title: 'Investment Returns', desc: 'Your premiums grow with competitive interest rates.' },
                  { icon: <Zap className="w-5 h-5" />, title: 'Instant Activation', desc: 'Coverage starts immediately upon first premium payment.' },
                  { icon: <Lock className="w-5 h-5" />, title: 'Locked Premiums', desc: 'Your premium rate is locked and never increases.' },
                ];
                return [
                  { icon: <Zap className="w-5 h-5" />, title: 'Instant Coverage', desc: 'Get covered in minutes with our streamlined digital process.' },
                  { icon: <CreditCard className="w-5 h-5" />, title: 'Flexible Payments', desc: 'Pay monthly or annually with multiple payment options.' },
                  { icon: <Shield className="w-5 h-5" />, title: 'Trusted Underwriting', desc: 'Backed by licensed, regulated insurance providers.' },
                  { icon: <Phone className="w-5 h-5" />, title: '24/7 Support', desc: 'Round-the-clock claims and customer support.' },
                ];
              };

              const getBenefits = () => {
                if (category === 'Motor') return [
                  { title: '24/7 Concierge Support', desc: 'Personal claims adjusters and emergency teams.' },
                  { title: 'Windscreen Replacement', desc: 'Full replacement with no excess charged.' },
                  { title: 'Emergency Towing', desc: 'Towing to the nearest approved garage.' },
                ];
                if (category === 'Health') return [
                  { title: 'Annual Health Checkup', desc: 'Free comprehensive health screening every year.' },
                  { title: 'Telemedicine Access', desc: '24/7 virtual doctor consultations from home.' },
                  { title: 'Prescription Delivery', desc: 'Medications delivered to your doorstep.' },
                ];
                if (category === 'Life') return [
                  { title: 'Premium Waiver on Disability', desc: 'Premiums waived if you become disabled.' },
                  { title: 'Accelerated Death Benefit', desc: 'Early access if diagnosed with terminal illness.' },
                  { title: 'Loyalty Bonus', desc: 'Additional payout after 10+ years of coverage.' },
                ];
                return [
                  { title: 'Priority Claims Processing', desc: 'Fast-tracked claims with dedicated support.' },
                  { title: 'Digital Dashboard', desc: 'Track policies and claims in real-time.' },
                  { title: 'Renewal Reminders', desc: 'Automated reminders so you never lapse.' },
                ];
              };

              const getDiscounts = () => {
                if (category === 'Motor') return [
                  { title: 'GPS Tracker', desc: 'Vehicle fitted with GPS', pct: '10% OFF' },
                  { title: 'Alarm System', desc: 'Vehicle fitted with alarm', pct: '5% OFF' },
                ];
                if (category === 'Health') return [
                  { title: 'No Claims Bonus', desc: 'Zero claims in past year', pct: '15% OFF' },
                  { title: 'Family Bundle', desc: '3+ family members', pct: '10% OFF' },
                ];
                return [
                  { title: 'Annual Payment', desc: 'Pay full year upfront', pct: '12% OFF' },
                  { title: 'Ecobank Customer', desc: 'Existing Ecobank account', pct: '5% OFF' },
                ];
              };

              const getFaqs = () => {
                if (category === 'Motor') return [
                  { q: 'How long does the application take?', a: 'The form typically takes about 3 minutes to complete if you have your NIN and vehicle logbook ready.' },
                  { q: 'When do I get my policy certificate?', a: 'Your policy certificate is issued within 24 hours after your vehicle inspection is approved.' },
                  { q: 'Am I covered before the inspection?', a: 'Provisional cover begins upon successful payment. Full coverage is confirmed after inspection approval.' },
                  { q: 'Can I pay in installments?', a: 'Yes! You can spread your premium over 4 to 10 months with our IPF plan.' },
                  { q: 'How do I make a claim?', a: 'Log into your dashboard, navigate to Claims, and submit the required documents. Our team responds within 24 hours.' },
                  { q: 'What if I made an error in the form?', a: 'Contact our support team via the in-app chat and we\'ll correct it before your policy is issued.' },
                ];
                if (category === 'Health') return [
                  { q: 'Is there a waiting period?', a: 'General coverage starts immediately. Maternity and pre-existing conditions have a 12-month waiting period.' },
                  { q: 'Can I add family members later?', a: 'Yes, you can add dependents at any time. Coverage for new members starts from the next billing cycle.' },
                  { q: 'Which hospitals are covered?', a: 'We partner with 500+ hospitals across East Africa. Check our network directory in the dashboard.' },
                  { q: 'How do I file a claim?', a: 'For cashless claims, show your digital card at the hospital. For reimbursements, upload receipts in the dashboard.' },
                ];
                if (category === 'Life') return [
                  { q: 'Who can be my beneficiary?', a: 'Any person you designate — spouse, children, parents, or any trusted individual.' },
                  { q: 'Can I change my coverage amount?', a: 'Yes, you can increase or decrease coverage at your annual renewal date.' },
                  { q: 'What happens if I miss a payment?', a: 'There is a 30-day grace period. After that, coverage is suspended until payment is made.' },
                  { q: 'Is there a cash value component?', a: 'Yes, whole life policies accumulate cash value that you can borrow against or withdraw.' },
                ];
                return [
                  { q: 'How quickly is my coverage activated?', a: 'Coverage is activated within minutes of your first successful payment.' },
                  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel with 30 days notice. Unused premiums are refunded pro-rata.' },
                  { q: 'How do I file a claim?', a: 'Through your MaaS dashboard — upload documents and track progress in real-time.' },
                  { q: 'Is my data secure?', a: 'All data is encrypted and secured through Ecobank\'s banking-grade infrastructure.' },
                ];
              };

              const getDocuments = () => {
                if (category === 'Motor') return [
                  { icon: <UserCheck className="w-8 h-8 text-primary" />, title: 'National ID (NIN)', desc: 'Your Uganda National Identification Number card for identity verification.', reqs: ['Must be the vehicle owner\'s ID', 'All 4 corners clearly visible', 'Expired IDs not accepted'] },
                  { icon: <FileCheck className="w-8 h-8 text-primary" />, title: 'Vehicle Logbook', desc: 'Official UNRA registration logbook confirming ownership and specs.', reqs: ['Photograph the bio-data page', 'Plate number must match', 'Transfer ownership if recently bought'] },
                ];
                if (category === 'Health') return [
                  { icon: <UserCheck className="w-8 h-8 text-primary" />, title: 'National ID', desc: 'Valid government-issued ID for the primary policyholder.', reqs: ['Clear photo of front and back', 'Not expired'] },
                  { icon: <FileCheck className="w-8 h-8 text-primary" />, title: 'Medical History (Optional)', desc: 'Recent medical records if you have pre-existing conditions.', reqs: ['Last 12 months records', 'Doctor\'s notes if applicable'] },
                ];
                return [
                  { icon: <UserCheck className="w-8 h-8 text-primary" />, title: 'National ID', desc: 'Valid government-issued identification document.', reqs: ['Clear photo', 'Not expired'] },
                  { icon: <FileCheck className="w-8 h-8 text-primary" />, title: 'Supporting Documents', desc: 'Category-specific documentation as required.', reqs: ['Clear, legible copies', 'Recent documents preferred'] },
                ];
              };

              return (
              <div className="space-y-0 -mx-4" id="stage-details-view">

                {/* ── HERO SECTION ── */}
                <div className="bg-gradient-to-br from-primary via-[#005b82] to-secondary text-white px-5 sm:px-8 py-8 sm:py-12 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-eco-lime/10 rounded-full translate-y-1/2 -translate-x-1/4"></div>
                  <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0"
                        style={{ backgroundColor: selectedProvider.logoBg, color: selectedProvider.logoColor }}>
                        {selectedProvider.logoInitial}
                      </div>
                      <div>
                        <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider block">Provided by</span>
                        <span className="font-bold text-sm">{selectedProvider.name}</span>
                      </div>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black leading-tight mb-2">
                      {category} Insurance
                      <span className="block text-eco-lime text-xs sm:text-sm font-bold uppercase tracking-widest mt-2">Simple. Fast. Online.</span>
                    </h1>
                    <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
                      {category === 'Motor' ? 'Protect your vehicle with comprehensive coverage. Apply in minutes, pay in installments, and get your policy today.' :
                       category === 'Health' ? 'Complete health coverage for you and your family. Cashless treatment at 500+ hospitals across East Africa.' :
                       category === 'Life' ? 'Secure your family\'s future with guaranteed protection. Investment returns and flexible coverage options.' :
                       category === 'Device' ? 'Total protection for your device against damage, theft, and breakdowns. Express repairs included.' :
                       `Comprehensive ${category.toLowerCase()} protection tailored to your needs with flexible payment options.`}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => { setAppStep(1); setStage('application'); }}
                        className="px-6 py-3 bg-white text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        Start Application <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => document.getElementById('product-coverage')?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-6 py-3 border-2 border-white/30 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition-colors"
                      >
                        View Coverage
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-5">
                      <span className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                        <BadgeCheck className="w-3.5 h-3.5 text-eco-lime" /> Licensed by IRA Uganda
                      </span>
                      <span className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                        <Zap className="w-3.5 h-3.5 text-eco-lime" /> Instant Digital Policy
                      </span>
                      <span className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {selectedProvider.rating} Rating
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── WHY CHOOSE FEATURES ── */}
                <div className="px-4 py-10">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 text-center mb-8">A Simpler Way to Get Insured</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getWhyFeatures().map((feat, i) => (
                      <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                          {feat.icon}
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 mb-1">{feat.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── COVERAGE SECTION ── */}
                <div className="px-4 py-10 bg-slate-50 rounded-2xl" id="product-coverage">
                  <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">What's Covered</span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Comprehensive Protection</h2>
                  <p className="text-sm text-gray-500 mb-8 max-w-lg">Your protection plan is designed to provide maximum security and peace of mind.</p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Coverage Grid */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                      <h3 className="font-bold text-sm text-gray-900 mb-4">What's Included</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {getCoverageItems().map((item, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-success-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-4 h-4 text-success-teal" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-gray-900">{item.title}</h4>
                              <p className="text-[11px] text-gray-500 leading-snug mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Side Cards */}
                    <div className="space-y-4">
                      {/* Additional Benefits */}
                      <div className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-4 h-4 text-primary" />
                          <h3 className="font-bold text-xs text-gray-900">Additional Benefits</h3>
                        </div>
                        <div className="space-y-3">
                          {getBenefits().map((ben, i) => (
                            <div key={i} className="flex gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-eco-lime/20 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary stroke-[3]" />
                              </div>
                              <div>
                                <span className="font-bold text-[11px] text-gray-800 block">{ben.title}</span>
                                <span className="text-[10px] text-gray-400">{ben.desc}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Discounts */}
                      <div className="bg-white rounded-xl border border-primary/10 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <CircleDollarSign className="w-4 h-4 text-primary" />
                          <h3 className="font-bold text-xs text-gray-900">Savings & Discounts</h3>
                        </div>
                        <div className="space-y-2.5">
                          {getDiscounts().map((disc, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-[11px] text-gray-800 block">{disc.title}</span>
                                <span className="text-[10px] text-gray-400">{disc.desc}</span>
                              </div>
                              <span className="px-2.5 py-1 bg-eco-lime/20 text-primary text-[10px] font-black rounded-full whitespace-nowrap">{disc.pct}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── PREMIUM CALCULATOR ── */}
                <div className="px-4 py-10">
                  <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">Get Started</span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6">Your Premium Estimate</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Quote Card */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                      <div>
                        <span className="text-sm font-bold text-gray-900">Your Estimated Premium</span>
                        <p className="text-xs text-gray-400 mt-0.5">Based on your profile and selected plan</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Annual Premium</span>
                        <span className="text-3xl font-black text-primary">UGX {premiumUgx.toLocaleString()}</span>
                        <span className="block text-xs text-gray-400 mt-1">≈ ${premiumUsd}/month (USD)</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Coverage Limit</span>
                          <span className="text-lg font-black text-secondary">UGX {coverageUgx.toLocaleString()}</span>
                        </div>
                        <Award className="w-5 h-5 text-secondary" />
                      </div>
                      <button
                        type="button"
                        onClick={() => { setAppStep(1); setStage('application'); }}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
                      >
                        Start Application <ArrowRight className="w-4 h-4" />
                      </button>
                      <p className="text-[10px] text-gray-400 text-center">This is an indicative estimate. Final premium confirmed after verification.</p>
                    </div>

                    {/* Installment Card */}
                    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-gray-900 block">Pay in Installments</span>
                          <span className="text-xs text-gray-400">Spread the cost with flexible monthly payments</span>
                        </div>
                      </div>
                      <div className="bg-primary/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
                          <Clock className="w-4 h-4" /> How It Works
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                          With Insurance Premium Finance (IPF), spread your premium over 4 to 10 months. A 10% interest and 3% processing fee applies.
                        </p>
                      </div>
                      <div className="space-y-0">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Monthly Payment Options</div>
                        <div className="border border-gray-100 rounded-lg overflow-hidden">
                          {[4, 6, 8, 10].map((months) => {
                            const totalWithFees = premiumUgx * 1.13;
                            const monthly = Math.round(totalWithFees / months);
                            return (
                              <div key={months} className="flex justify-between items-center px-4 py-2.5 border-b border-gray-50 last:border-b-0 hover:bg-slate-50 transition-colors">
                                <span className="text-xs text-gray-600">{months} Months</span>
                                <span className="text-xs font-bold text-gray-900">UGX {monthly.toLocaleString()}/mo</span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[9px] text-gray-400 mt-2">*Includes 10% interest + 3% processing fee.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── ADD-ONS ── */}
                <div className="px-4 py-8">
                  <h3 className="font-bold text-sm text-gray-900 mb-4">Customize Your Coverage</h3>
                  <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
                    <label className="flex items-center justify-between cursor-pointer p-4 hover:bg-slate-50 transition-colors">
                      <div className="space-y-0.5 pr-4">
                        <h5 className="text-sm font-bold text-gray-800">Premium Excess Fee Waiver</h5>
                        <p className="text-[11px] text-gray-400 leading-snug">Eliminate all co-payment costs on claims. Zero out-of-pocket expenses. (+$4/month)</p>
                      </div>
                      <input type="checkbox" checked={waiverOption} onChange={(e) => setWaiverOption(e.target.checked)}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary accent-primary shrink-0" />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer p-4 hover:bg-slate-50 transition-colors">
                      <div className="space-y-0.5 pr-4">
                        <h5 className="text-sm font-bold text-gray-800">Emergency & Medical Concierge</h5>
                        <p className="text-[11px] text-gray-400 leading-snug">24/7 ambulance support, emergency towing, and medical evacuation services. (+$6/month)</p>
                      </div>
                      <input type="checkbox" checked={extraAssistance} onChange={(e) => setExtraAssistance(e.target.checked)}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary accent-primary shrink-0" />
                    </label>
                  </div>
                </div>

                {/* ── DOCUMENTS NEEDED ── */}
                <div className="px-4 py-10 bg-slate-50 rounded-2xl">
                  <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">Before You Apply</span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Ready for Application?</h2>
                  <p className="text-sm text-gray-500 mb-6">Have these ready to ensure a smooth application process</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getDocuments().map((doc, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
                        <div className="mb-3">{doc.icon}</div>
                        <h3 className="font-bold text-sm text-gray-900 mb-1">{doc.title}</h3>
                        <p className="text-xs text-gray-500 mb-3 leading-relaxed">{doc.desc}</p>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Requirements:</span>
                        <ul className="space-y-1">
                          {doc.reqs.map((req, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                              <Check className="w-3 h-3 text-success-teal shrink-0 mt-0.5 stroke-[3]" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {category === 'Motor' && (
                      <div className="bg-primary/5 rounded-xl border border-primary/10 p-5">
                        <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-[9px] font-bold uppercase mb-3">Tip</span>
                        <h3 className="font-bold text-sm text-gray-900 mb-1">Keep Your Vehicle Nearby</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">After completing the form you'll need to take live photos during the self-inspection step. Photos must be taken live and cannot be uploaded beforehand.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── FAQ ── */}
                <div className="px-4 py-10">
                  <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">Got Questions?</span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-900">Frequently Asked Questions</h2>
                    <p className="text-sm text-gray-500 mt-1">Everything you need to know before you start your application.</p>
                  </div>
                  <div className="max-w-2xl mx-auto space-y-2">
                    {getFaqs().map((faq, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-bold text-sm text-gray-800 pr-4">{faq.q}</span>
                          {openFaqIndex === i ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                        </button>
                        {openFaqIndex === i && (
                          <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── CTA SECTION ── */}
                <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 sm:p-10 text-center text-white">
                  <h2 className="text-xl sm:text-2xl font-black mb-2">Ready to Get Protected?</h2>
                  <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">
                    Join thousands of customers who trust {selectedProvider.name} for their {category.toLowerCase()} insurance needs.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      type="button"
                      onClick={() => { setAppStep(1); setStage('application'); }}
                      className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      Start Application <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setStage('listing')}
                      className="px-8 py-3.5 border-2 border-white/30 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition-colors"
                    >
                      Compare Other Plans
                    </button>
                  </div>
                </div>

                {/* ── BACK NAVIGATION ── */}
                <div className="px-4 pt-6 flex justify-between items-center border-t border-gray-100 mt-4">
                  <button type="button" onClick={() => setStage('listing')}
                    className="px-6 py-2.5 border border-gray-200 text-gray-500 hover:bg-slate-50 rounded-xl font-bold transition-colors text-sm">
                    Back to Plans
                  </button>
                  <button type="button" onClick={() => { setAppStep(1); setStage('application'); }}
                    className="px-8 py-3 bg-primary text-white hover:bg-primary-container rounded-xl font-bold transition-all text-sm flex items-center gap-1.5">
                    <span>Start Application</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
              );
            })()}

            {/* STAGE 4: APPLICATION FORM — intent form iframe */}
            {stage === 'application' && (
              <div id="stage-application-view">
                <iframe
                  src="/intent-form.html"
                  title="Application"
                  className="w-full border-0 block"
                  scrolling="no"
                  style={{ height: `${iframeHeight}px`, overflow: 'hidden' }}
                  allow="camera; microphone; geolocation"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                />
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}
