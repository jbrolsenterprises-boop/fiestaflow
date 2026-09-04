import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const STORAGE_KEY_URL = 'fiestagas_supabase_url';
const STORAGE_KEY_KEY = 'fiestagas_supabase_key';

export function getSupabaseConfig(): { url: string; key: string; isConfigured: boolean } {
  const envUrl = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || '';
  const envKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '';
  
  const savedUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const savedKey = localStorage.getItem(STORAGE_KEY_KEY) || '';

  const url = savedUrl.trim() || envUrl.trim();
  const key = savedKey.trim() || envKey.trim();
  const isConfigured = Boolean(url && key && url.startsWith('http'));

  return { url, key, isConfigured };
}

export function saveSupabaseConfig(url: string, key: string) {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, key.trim());
  reinitSupabase();
}

export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_KEY);
  reinitSupabase();
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function reinitSupabase() {
  supabaseInstance = null;
  return getSupabaseClient();
}

export const SUPABASE_SQL_SCHEMA = `-- Run this in Supabase SQL Editor to set up all tables:

-- 1. Sales Transactions
create table if not exists sales_transactions (
  id text primary key default gen_random_uuid()::text,
  created_at timestamptz default now(),
  location text not null,
  customer_name text not null,
  customer_type text default 'Walk-in',
  payment_method text not null,
  proof_note text,
  total_amount numeric not null default 0,
  status text default 'Completed'
);

-- 2. Inventory Stock
create table if not exists inventory_stock (
  id text primary key default gen_random_uuid()::text,
  location text unique not null,
  description text,
  filled_crates int default 0,
  empty_crates int default 0,
  damaged_units int default 0,
  target_crates int default 0,
  status text default 'ON TARGET'
);

-- 3. Inventory Movements (Custody Chain)
create table if not exists inventory_movements (
  id text primary key default gen_random_uuid()::text,
  created_at timestamptz default now(),
  from_location text not null,
  to_location text not null,
  quantity int not null,
  handler text not null,
  note text
);

-- 4. Daily Count Logs
create table if not exists daily_count_logs (
  id text primary key default gen_random_uuid()::text,
  created_at timestamptz default now(),
  location text not null,
  filled_crates int default 0,
  empty_crates int default 0,
  audited_by text not null
);

-- 5. Franchisees
create table if not exists franchisees (
  id text primary key default gen_random_uuid()::text,
  created_at timestamptz default now(),
  account_name text not null,
  owner_name text not null,
  package_pricing text,
  account_ownership text,
  last_purchase date default current_date,
  status text default 'Active',
  current_volume int default 0,
  target_milestone int default 500,
  commission_rate text default '3%',
  territory text,
  contact text
);

-- 6. Vehicles and Crew
create table if not exists vehicles_and_crew (
  id text primary key default gen_random_uuid()::text,
  created_at timestamptz default now(),
  vehicle text not null,
  home_location text not null,
  approved_capacity text not null,
  crew_today text not null,
  status text default 'Active'
);

-- 7. Unplanned Stops
create table if not exists unplanned_stops (
  id text primary key default gen_random_uuid()::text,
  created_at timestamptz default now(),
  account_name text not null,
  territory text not null,
  reason text not null,
  status text default 'Flagged'
);

-- 8. Cheque Deposits
create table if not exists cheque_deposits (
  id text primary key default gen_random_uuid()::text,
  created_at timestamptz default now(),
  cheque_date date default current_date,
  issuing_bank text not null,
  customer_name text not null,
  amount numeric not null default 0,
  status text default 'Awaiting Bank Clearing'
);

-- Initial seed data
insert into inventory_stock (location, description, filled_crates, empty_crates, damaged_units, target_crates, status)
values
  ('Main warehouse', 'Central stock depot', 420, 197, 8, 504, 'REPLENISH SOON'),
  ('BGC Branch', 'Company retail outlet', 18, 32, 2, 45, 'LOW STOCK'),
  ('Quezon City Branch', 'Company retail outlet', 71, 46, 0, 96, 'ON TARGET')
on conflict (location) do nothing;
`;

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'demo-usr-1',
    email: 'maria.p@fiestagas.ph',
    fullName: 'Maria P.',
    role: 'Central Operations Director',
    branch: 'Baloy Central Operations',
    avatarInitials: 'MP',
  },
  {
    id: 'demo-usr-2',
    email: 'cashier.bgc@fiestagas.ph',
    fullName: 'Ana Ramirez',
    role: 'Head Register Cashier',
    branch: 'BGC Branch · Register 01',
    avatarInitials: 'AR',
  },
  {
    id: 'demo-usr-3',
    email: 'dispatch@fiestagas.ph',
    fullName: 'Juanito M.',
    role: 'Fleet Dispatch Supervisor',
    branch: 'Baloy Dispatch Hub',
    avatarInitials: 'JM',
  },
];
