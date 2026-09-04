export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  branch?: string;
  avatarInitials: string;
}

export interface SalesTransaction {
  id: string;
  created_at: string;
  location: string;
  customer_name: string;
  customer_type: 'Walk-in' | 'Franchisee' | 'Walk-in end user';
  payment_method: 'Cash' | 'GCash' | 'Bank transfer' | 'Cheque';
  proof_note?: string;
  total_amount: number;
  status: 'Completed' | 'Pending Deposit' | 'Under Review';
}

export interface CartItem {
  name: string;
  price: number;
  qty: number;
}

export interface InventoryStock {
  id: string;
  location: string;
  description: string;
  filled_crates: number;
  empty_crates: number;
  damaged_units: number;
  target_crates: number;
  status: 'ON TARGET' | 'LOW STOCK' | 'REPLENISH SOON';
}

export interface InventoryMovement {
  id: string;
  created_at: string;
  from_location: string;
  to_location: string;
  quantity: number;
  handler: string;
  note?: string;
}

export interface DailyCountLog {
  id: string;
  created_at: string;
  location: string;
  filled_crates: number;
  empty_crates: number;
  audited_by: string;
}

export interface Franchisee {
  id: string;
  created_at?: string;
  account_name: string;
  owner_name: string;
  package_pricing: string;
  account_ownership: string;
  last_purchase: string;
  status: 'Active' | 'Pending Verification' | 'Suspended';
  current_volume: number;
  target_milestone: number;
  commission_rate: string;
  territory: string;
  contact: string;
}

export interface VehicleCrew {
  id: string;
  created_at?: string;
  vehicle: string;
  home_location: string;
  approved_capacity: string;
  crew_today: string;
  status: 'Active' | 'In Transit' | 'Maintenance' | 'Inactive';
}

export interface UnplannedStop {
  id: string;
  created_at: string;
  account_name: string;
  territory: string;
  reason: string;
  status: 'Flagged' | 'Under Review' | 'Resolved';
}

export interface ChequeDeposit {
  id: string;
  created_at: string;
  cheque_date: string;
  issuing_bank: string;
  customer_name: string;
  amount: number;
  status: 'Awaiting Bank Clearing' | 'Queued for Deposit' | 'Deposited & Cleared';
}
