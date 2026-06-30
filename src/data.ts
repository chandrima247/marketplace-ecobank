import { Policy, Claim, VehicleLookupResult, InsuranceCategory } from './types';

export const METADATA_IMAGES = {
  ecobankLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Nt5OVToBPKxtyfZBReBtWk-ipo786E1W6qVtZVNOKYggz5n7Kk7TMSUfBwG7zajrZjYKCXGx37rtVDkP8EUQGhCuwT2ir47347C8mMzRQ2yqKV3Q0003dTKDFafVPEm1zYFSNk0h3lwQG-pRInnMGXtExh1B5IYLVxWJnlRQ4XRG3aEV7uRkc_k3y9dgKIHi9Vo6HE8cfDNYAVUydmgCTvqXdkirmOjjpVG5F_2m4_jKyWftN81LBvCm2x6z4ulqSOhJ4RX_v0c',
  nxtpeLogo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0OJhkVGQEtK_BFI-bmLqZztV9fS3Gls2wnxVD5NFh6xubAVBbfMnxVRJU23cEFVsS8jH-v43TjslANVxyeuqXKCTo5c_LeYWUVGv02LyW29BJjnScXAxR-YHQ5IRMa3IJejFk6KyvqAFvndSh4X7TymlWk6E4HDSbhEtDt1j-VC0xTW2eRgTYLq17tEp5kYLPhurmnOboRc2tUC-wANQFT8h29dZCgXNBMJevqpQ7e5bk9M7zK4s9IaML-cMvoZxnDKzWuaMx5jI',
  lifeHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjaE-OuMUnM_-qjrjuH2z0dneryppONTKwmUKW0gRh6OM1jHMDqOcqZnJRGnGbsYmZePyuMrLVyWOdZ-IL6XGXxsapZd9XyhPeRK7VgOq8MgDuURKK5hOFLbCe0PMdBNfoOIG3alA97zbzb9vqFkzvCV5gV_oVjOilIE_oRT22aCUQXqkfDjypkBD1DLoK3JSgrnhr-aDWDXAwmde0EksoaFpb380genXlrgPJoDMimDkAwR2x6qctw9kXFrA96pBoqqZgaiudtEE',
  healthCard: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkNXOTqlBeE6pfa6oJmOljRhK3gBUEfg5JLBA8jioJePMfR5ks3mmdyhCzhNvHpNjc8FGYsKGNyeEC46dsYa3M0Y88t7oQccZYCLvUznza5c5oIEvaLBwmZjDQsHGz8PwUl-dpCcmd42w_OP0Vxwgm5ZtgPHL7gEcleU5Sp7H3Gv3tj4lqmCqJIK5kS7H_v8LH3hATI-k_pJVrOAZbrG-5JdGs12IkLoVFsxycx60SxFz3YTbJjGNEWxn6Atv1nNdTOAclZvKF-eU',
  deviceCard: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiiuVArjSGCb_Mi4TO3-nBZpTcAOrm4dy9htZXUsFNTrdtKLQFiOJ4lhAdHakhHkH9l3Dteo2bVzPqmeg8x2Qxogr8aYEVjmqoKH3Q2FRYkZYDlGaczEaIVaaGqfCiHzVy86FEaZES4Hgj2djyXFAmPpCVnkiayngsXpSytjPqOHrbkN9nQyaJ1ih7aYDXtxW-1hE5sjMt5AHZW-TSW-AOVZhdrrSkNxpRufNSdGPwS90lsipO8gNqVNTFSPJ8tyXXLOqUHRzznrQ',
  storyPartner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCztFkh82mMyl881eOw5mJgn0CzoOHW1r0sD5BTMXKP2Ye0HsX2v_AXl-8SNTfWdxi5vNkb4WH3CO6-QIS_hjxWOkJW_332TtG3_iRLQBMi3YEdf55J8VGuFZCEDkQgYXnx4YsO1XJ9WZD915ps4K1s3BDT-g0HcJP_b6Ml9jleMaxhCvHhWpVa-dMR7XXFUxNLuok9CxW_VJQFcvs-1nxsa1Pibjsa45--NK4O8alqmqyOJVrgC1-Muk1rzrQxB1afAP8uZnOTZOs',
  sedanCar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg1JqcTWdV_h-GVNLLXsU0zU4mCzxzjYLr5Y09uEsqLKaPmZZd55a2d_m7VrP2c8TUpX-sCON3wmni1QsaqPmFotsEYtU8qv961-pAxYI_GRiAx8B1DaHzzw_L6h3_B2KBFSFqf9LqGM_BY1TDcCRkvpZPnalT0NtF9Aj3784lcfED00_MzxHXlI3EPETZ6c_ISiQITicmoOavRSua28YQFSjMFEbRKyihasQSrBgeFBOkIsy6_oUoN4g22T9VWPVkn_-zZm6TtZ0'
};

export interface CategoryInfo {
  id: InsuranceCategory;
  name: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'Life',
    name: 'Life',
    icon: 'Heart',
    description: 'Ensure your loved ones are covered with premium life protection starting from $15/month.'
  },
  {
    id: 'Health',
    name: 'Health',
    icon: 'Shield',
    description: 'Instant, reliable cash payouts and direct hospital bills payment for comprehensive healthcare.'
  },
  {
    id: 'Motor',
    name: 'Motor',
    icon: 'Car',
    description: 'Protect your vehicle against accident repairs, theft, and third-party liabilities in 40 seconds.'
  },
  {
    id: 'Device',
    name: 'Device',
    icon: 'Smartphone',
    description: 'Instant full coverage for phone screen damage, liquid spills, theft, and electric short-circuits.'
  },
  {
    id: 'Travel',
    name: 'Travel',
    icon: 'Plane',
    description: 'Luggage loss insurance, flight cancellation cover, and medical emergencies abroad.'
  },
  {
    id: 'Agric',
    name: 'Agric',
    icon: 'Leaf',
    description: 'Crop yields protection for multi-scale famers using weather index and automated soil sensors.'
  },
  {
    id: 'Property',
    name: 'Property',
    icon: 'Home',
    description: 'Cover your home, rental or commercial building against fire, flood, burglary and liability.'
  },
  {
    id: 'Business',
    name: 'Business',
    icon: 'Briefcase',
    description: 'Indemnity protection for commercial assets, offices, public liabilities, and employer contracts.'
  }
];

export const POPULAR_PLATES = ['UBM 492X', 'UBA 123Z', 'UAS 999K'];

export const VEHICLE_DATABASE: Record<string, VehicleLookupResult> = {
  'UBM 492X': {
    plateNumber: 'UBM 492X',
    makeModel: 'Toyota Land Cruiser V8',
    year: 2022,
    fuelType: 'Diesel',
    engineCc: 4500,
    value: 75000,
    imageUrl: METADATA_IMAGES.sedanCar
  },
  'UBA 123Z': {
    plateNumber: 'UBA 123Z',
    makeModel: 'Mercedes-Benz G63 AMG',
    year: 2023,
    fuelType: 'Petrol',
    engineCc: 3982,
    value: 125000,
    imageUrl: METADATA_IMAGES.sedanCar
  },
  'UAS 999K': {
    plateNumber: 'UAS 999K',
    makeModel: 'Land Rover Defender 110',
    year: 2021,
    fuelType: 'Hybrid',
    engineCc: 2996,
    value: 85000,
    imageUrl: METADATA_IMAGES.sedanCar
  }
};

// Generates fallback values for plates not specifically listed
export function getVehicleForPlate(plate: string): VehicleLookupResult {
  const normalized = plate.trim().toUpperCase();
  if (VEHICLE_DATABASE[normalized]) {
    return VEHICLE_DATABASE[normalized];
  }
  
  // Custom generated based on plate characters to keep it consistent
  const manufacturers = ['Toyota Hilux', 'Hyundai Santa Fe', 'BMW 530i', 'Ford Ranger', 'Kia Sportage'];
  const hash = normalized.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedMake = manufacturers[hash % manufacturers.length];
  const year = 2018 + (hash % 6); // 2018 to 2023
  const value = 18000 + (hash % 35) * 1500; // $18,000 to $70,500
  
  return {
    plateNumber: normalized,
    makeModel: selectedMake,
    year,
    fuelType: hash % 2 === 0 ? 'Petrol' : 'Diesel',
    engineCc: 1600 + (hash % 5) * 400, // 1600cc to 3200cc
    value,
    imageUrl: METADATA_IMAGES.sedanCar
  };
}

export const INITIAL_POLICES: Policy[] = [
  {
    id: 'pol-01',
    category: 'Motor',
    title: 'Comprehensive Auto Shield',
    insuredItemName: 'Toyota Land Cruiser V8 (UBM 492X)',
    premium: 45,
    renewalDate: '2026-11-20',
    status: 'Active',
    coverageAmount: 75000,
    code: 'POL-M-88392'
  },
  {
    id: 'pol-02',
    category: 'Health',
    title: 'Ecobank Wellness Care Prime',
    insuredItemName: 'Jane Doe (Self + Family)',
    premium: 28,
    renewalDate: '2026-09-15',
    status: 'Active',
    coverageAmount: 150000,
    code: 'POL-H-47201'
  }
];

export const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'clm-01',
    policyId: 'pol-01',
    category: 'Motor',
    policyTitle: 'Comprehensive Auto Shield',
    description: 'Minor fender scratch on rear bumper near Ecobank Headquarters parking lot',
    dateSubmitted: '2026-06-10',
    status: 'Processing',
    estimatedPayout: 850
  },
  {
    id: 'clm-02',
    policyId: 'pol-02',
    category: 'Health',
    policyTitle: 'Ecobank Wellness Care Prime',
    description: 'Routine outpatient medical dental cleaning checkup & coverage reimbursement',
    dateSubmitted: '2026-05-01',
    status: 'Approved',
    estimatedPayout: 120
  }
];

export interface InsuranceProvider {
  id: string;
  name: string;
  tagline: string;
  logoColor: string;
  logoBg: string;
  logoInitial: string;
  rating: number;
  claimsRatio: string;
  features: string[];
  featureIcons: string[];
  recommended?: boolean;
}

export const INSURANCE_PROVIDERS: Record<string, InsuranceProvider[]> = {
  Motor: [
    {
      id: 'britam',
      name: 'Britam',
      tagline: 'Instant Fast Claims',
      logoColor: '#004260',
      logoBg: '#e7eeff',
      logoInitial: 'B',
      rating: 4.8,
      claimsRatio: '98.2%',
      features: ['Roadside Assist', 'Courtesy Car', 'Zero Depreciation', 'Agency Repair'],
      featureIcons: ['car', 'car', 'shield', 'wrench'],
      recommended: true,
    },
    {
      id: 'oldmutual',
      name: 'Old Mutual',
      tagline: 'Global Standards',
      logoColor: '#004832',
      logoBg: '#e6f7f0',
      logoInitial: 'OM',
      rating: 4.6,
      claimsRatio: '96.5%',
      features: ['Windshield Cover', 'Mechanical Breakdown', 'Medical Expenses', 'No Depreciation'],
      featureIcons: ['shield', 'wrench', 'heart', 'check'],
    },
    {
      id: 'uap',
      name: 'UAP Insurance',
      tagline: 'Wide Network',
      logoColor: '#4159ab',
      logoBg: '#eef0ff',
      logoInitial: 'UAP',
      rating: 4.5,
      claimsRatio: '95.8%',
      features: ['Legal Liability', 'P.A for Driver', 'Regional Cover (EAC)', 'Tyres & Rims'],
      featureIcons: ['scale', 'user', 'globe', 'circle'],
    },
  ],
  Health: [
    {
      id: 'jubilee',
      name: 'Jubilee Health',
      tagline: 'Premium Healthcare',
      logoColor: '#8B0000',
      logoBg: '#fff0f0',
      logoInitial: 'JH',
      rating: 4.9,
      claimsRatio: '99.1%',
      features: ['Inpatient Cover', 'Outpatient', 'Dental & Optical', 'Maternity'],
      featureIcons: ['hospital', 'stethoscope', 'eye', 'baby'],
      recommended: true,
    },
    {
      id: 'axa',
      name: 'AXA Mansard',
      tagline: 'Pan-African Coverage',
      logoColor: '#004260',
      logoBg: '#e7eeff',
      logoInitial: 'AXA',
      rating: 4.7,
      claimsRatio: '97.3%',
      features: ['Hospital Direct Pay', 'Chronic Care', 'Teleconsultation', 'Emergency Evac'],
      featureIcons: ['building', 'pill', 'phone', 'ambulance'],
    },
    {
      id: 'aar',
      name: 'AAR Insurance',
      tagline: 'East Africa Trusted',
      logoColor: '#006245',
      logoBg: '#e6f7f0',
      logoInitial: 'AAR',
      rating: 4.5,
      claimsRatio: '96.0%',
      features: ['Family Cover', 'Wellness Programs', 'Lab & Diagnostics', 'Pharmacy Network'],
      featureIcons: ['users', 'heart', 'flask', 'pill'],
    },
  ],
  Life: [
    {
      id: 'prudential',
      name: 'Prudential Life',
      tagline: 'Legacy Protection',
      logoColor: '#8B0000',
      logoBg: '#fff0f0',
      logoInitial: 'PL',
      rating: 4.8,
      claimsRatio: '99.5%',
      features: ['Term Life', 'Critical Illness', 'Disability Cover', 'Funeral Benefit'],
      featureIcons: ['shield', 'heart', 'user', 'home'],
      recommended: true,
    },
    {
      id: 'sanlam',
      name: 'Sanlam Life',
      tagline: 'African Growth Partner',
      logoColor: '#004260',
      logoBg: '#e7eeff',
      logoInitial: 'SL',
      rating: 4.6,
      claimsRatio: '98.0%',
      features: ['Whole Life Cover', 'Education Plan', 'Investment Linked', 'Accidental Death'],
      featureIcons: ['infinity', 'book', 'trending-up', 'alert'],
    },
    {
      id: 'icea',
      name: 'ICEA Lion',
      tagline: 'Strength & Stability',
      logoColor: '#006245',
      logoBg: '#e6f7f0',
      logoInitial: 'IL',
      rating: 4.5,
      claimsRatio: '97.2%',
      features: ['Family Income', 'Savings Plan', 'Pension Linked', 'Repatriation'],
      featureIcons: ['wallet', 'piggy-bank', 'calendar', 'plane'],
    },
  ],
  Device: [
    {
      id: 'mtn-insure',
      name: 'MTN MoMo Insure',
      tagline: 'Mobile-First Cover',
      logoColor: '#FFC107',
      logoBg: '#fff8e1',
      logoInitial: 'MTN',
      rating: 4.7,
      claimsRatio: '97.8%',
      features: ['Screen Damage', 'Liquid Damage', 'Theft Protection', 'Battery Failure'],
      featureIcons: ['smartphone', 'droplet', 'lock', 'battery'],
      recommended: true,
    },
    {
      id: 'bolttech',
      name: 'bolttech',
      tagline: 'Global Device Shield',
      logoColor: '#4159ab',
      logoBg: '#eef0ff',
      logoInitial: 'bt',
      rating: 4.6,
      claimsRatio: '96.5%',
      features: ['Accidental Damage', 'Extended Warranty', 'Cracked Screen', 'Worldwide Cover'],
      featureIcons: ['shield', 'clock', 'smartphone', 'globe'],
    },
    {
      id: 'britam-device',
      name: 'Britam Gadget',
      tagline: 'Instant Claims',
      logoColor: '#004260',
      logoBg: '#e7eeff',
      logoInitial: 'B',
      rating: 4.4,
      claimsRatio: '95.5%',
      features: ['Full Replacement', 'Mechanical Failure', 'Electrical Shortage', 'Courier Pickup'],
      featureIcons: ['refresh', 'wrench', 'zap', 'truck'],
    },
  ],
};

const defaultProviders: InsuranceProvider[] = [
  {
    id: 'ecobank-protect',
    name: 'Ecobank Protect',
    tagline: 'Pan-African Coverage',
    logoColor: '#004260',
    logoBg: '#e7eeff',
    logoInitial: 'EP',
    rating: 4.7,
    claimsRatio: '97.5%',
    features: ['Standard Cover', 'Emergency Assist', 'Direct Settlement', 'Multi-Country'],
    featureIcons: ['shield', 'phone', 'credit-card', 'globe'],
    recommended: true,
  },
  {
    id: 'jubilee-general',
    name: 'Jubilee General',
    tagline: 'Trusted Since 1937',
    logoColor: '#8B0000',
    logoBg: '#fff0f0',
    logoInitial: 'JG',
    rating: 4.6,
    claimsRatio: '96.8%',
    features: ['Comprehensive', 'Legal Liability', 'Asset Protection', 'Claims Assist'],
    featureIcons: ['shield', 'scale', 'lock', 'headphones'],
  },
  {
    id: 'sanlam-general',
    name: 'Sanlam General',
    tagline: 'African Growth',
    logoColor: '#006245',
    logoBg: '#e6f7f0',
    logoInitial: 'SG',
    rating: 4.5,
    claimsRatio: '95.9%',
    features: ['Basic Cover', 'Third Party', 'Flexible Terms', 'Mobile Claims'],
    featureIcons: ['shield', 'users', 'settings', 'smartphone'],
  },
];

export function getProvidersForCategory(category: InsuranceCategory): InsuranceProvider[] {
  return INSURANCE_PROVIDERS[category] || defaultProviders;
}

export const VOICE_RESPONSES = [
  { match: /health/i, text: 'Fetching premium Health Insurance plans for you and your family...', action: 'Health' },
  { match: /car|vehicle|motor|plate/i, text: 'Opening DMV Vehicle Lookup flow. Please prepare your license plate number...', action: 'Motor' },
  { match: /phone|device|screen|gadget/i, text: 'Taking you to Screen & Gadget Damage Protection setup...', action: 'Device' },
  { match: /travel|flight/i, text: 'Routing you to Travel Premium Inter-State Cover package options...', action: 'Travel' },
  { match: /life|legacy/i, text: 'Preparing Life legacy security coverage plans and trust calculations...', action: 'Life' },
  { match: /business|office/i, text: 'Launching Commercial Asset & Indemnity protection portal...', action: 'Business' }
];
