export type InsuranceCategory =
  | 'Life'
  | 'Health'
  | 'Motor'
  | 'Device'
  | 'Travel'
  | 'Agric'
  | 'Property'
  | 'Business';

export interface Policy {
  id: string;
  category: InsuranceCategory;
  title: string;
  insuredItemName: string;
  premium: number;
  renewalDate: string;
  status: 'Active' | 'Pending' | 'Expired' | 'Renewal';
  coverageAmount: number;
  code: string;
}

export interface Claim {
  id: string;
  policyId: string;
  category: InsuranceCategory;
  policyTitle: string;
  description: string;
  dateSubmitted: string;
  status: 'Processing' | 'Approved' | 'Declined';
  estimatedPayout: number;
  documentUrl?: string;
  fileName?: string;
}

export interface User {
  email: string;
  name: string;
  isLoggedIn: boolean;
  phone?: string;
  role?: 'customer' | 'agent' | 'ops' | 'admin';
}

export interface VehicleLookupResult {
  plateNumber: string;
  makeModel: string;
  year: number;
  fuelType: string;
  engineCc: number;
  value: number;
  imageUrl: string;
}
