import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, SalesTransaction, InventoryStock, InventoryMovement, DailyCountLog, Franchisee, VehicleCrew, UnplannedStop, ChequeDeposit } from './types';
import { getSupabaseClient, getSupabaseConfig, DEMO_USERS } from './lib/supabase';
import { LoginPage } from './components/LoginPage';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewPage } from './components/OverviewPage';
import { SalesPage } from './components/SalesPage';
import { PosPage } from './components/PosPage';
import { DispatchPage } from './components/DispatchPage';
import { InventoryPage } from './components/InventoryPage';
import { FranchiseesPage } from './components/FranchiseesPage';
import { ApprovalsPage } from './components/ApprovalsPage';
import { VehiclesPage } from './components/VehiclesPage';
import { ReportsPage } from './components/ReportsPage';
import { RecordModal } from './components/RecordModal';
import { PrintableReceipt } from './components/PrintableReceipt';

const INITIAL_TRANSACTIONS: SalesTransaction[] = [
  { id: 'tx-1', created_at: '2026-09-04T08:30:00Z', location: 'BGC Branch', customer_name: 'Delos Reyes Trading', customer_type: 'Franchisee', payment_method: 'Bank transfer', proof_note: 'Ref #981273912', total_amount: 60000, status: 'Completed' },
  { id: 'tx-2', created_at: '2026-09-04T09:15:00Z', location: 'Baloy Central Hub', customer_name: 'Walk-in Customer', customer_type: 'Walk-in', payment_method: 'Cash', proof_note: 'Cash Slip #0091', total_amount: 2400, status: 'Completed' },
  { id: 'tx-3', created_at: '2026-09-04T09:40:00Z', location: 'Quezon City Branch', customer_name: 'Quezon Gas Depot', customer_type: 'Franchisee', payment_method: 'Cheque', proof_note: 'BDO Cheque #000192', total_amount: 35000, status: 'Pending Deposit' },
  { id: 'tx-4', created_at: '2026-09-04T10:05:00Z', location: 'BGC Branch', customer_name: 'Northway Retail Hub', customer_type: 'Franchisee', payment_method: 'GCash', proof_note: 'Ref #771239012', total_amount: 15000, status: 'Completed' },
];

const INITIAL_INVENTORY: InventoryStock[] = [
  { id: 'inv-1', location: 'Main warehouse', description: 'Central stock depot', filled_crates: 420, empty_crates: 197, damaged_units: 8, target_crates: 504, status: 'REPLENISH SOON' },
  { id: 'inv-2', location: 'BGC Branch', description: 'Company retail outlet', filled_crates: 18, empty_crates: 32, damaged_units: 2, target_crates: 45, status: 'LOW STOCK' },
  { id: 'inv-3', location: 'Quezon City Branch', description: 'Company retail outlet', filled_crates: 71, empty_crates: 46, damaged_units: 0, target_crates: 96, status: 'ON TARGET' },
];

const INITIAL_MOVEMENTS: InventoryMovement[] = [
  { id: 'mov-1', created_at: '2026-08-22T08:13:00Z', from_location: 'Main warehouse', to_location: 'Northway Retail Hub', quantity: 24, handler: 'Ramon D. (WH-01)', note: 'Accepted load · 08:13 AM' },
  { id: 'mov-2', created_at: '2026-08-21T16:45:00Z', from_location: 'Baloy Bottling Plant', to_location: 'Main warehouse', quantity: 100, handler: 'Plant Operations', note: 'Received 100 filled crates' },
  { id: 'mov-3', created_at: '2026-08-21T14:10:00Z', from_location: 'Main warehouse', to_location: 'BGC Branch', quantity: 15, handler: 'Juanito M.', note: 'Daily branch replenishment' },
];

const INITIAL_DAILY_LOGS: DailyCountLog[] = [
  { id: 'log-1', created_at: '2026-08-22T00:00:00Z', location: 'Main warehouse', filled_crates: 420, empty_crates: 197, audited_by: 'Ramon D.' },
  { id: 'log-2', created_at: '2026-08-22T00:00:00Z', location: 'BGC Branch', filled_crates: 18, empty_crates: 32, audited_by: 'Maria P.' },
  { id: 'log-3', created_at: '2026-08-22T00:00:00Z', location: 'Quezon City Branch', filled_crates: 71, empty_crates: 46, audited_by: 'Juan K.' },
];

const INITIAL_FRANCHISEES: Franchisee[] = [
  { id: 'f1', account_name: 'Delos Reyes Trading', owner_name: 'Gabriel Delos Reyes', package_pricing: 'Gold Package - ₱600,000', account_ownership: 'Sole Proprietorship', last_purchase: '2026-08-21', status: 'Active', current_volume: 1250, target_milestone: 1500, commission_rate: '5%', territory: 'BGC / Taguig', contact: '+63 917 555 0192' },
  { id: 'f2', account_name: 'Northway Retail Hub', owner_name: 'Elena Rostova', package_pricing: 'Starter Package - ₱150,000', account_ownership: 'Corporation', last_purchase: '2026-08-18', status: 'Active', current_volume: 480, target_milestone: 500, commission_rate: '3%', territory: 'Quezon City North', contact: '+63 918 444 8821' },
  { id: 'f3', account_name: 'Quezon Gas Depot', owner_name: 'Marco Quezon', package_pricing: 'Silver Package - ₱350,000', account_ownership: 'Partnership', last_purchase: '2026-08-15', status: 'Active', current_volume: 890, target_milestone: 1000, commission_rate: '4%', territory: 'Quezon City South', contact: '+63 922 333 1199' },
  { id: 'f4', account_name: 'Lapasan Gas Central', owner_name: 'Eduardo Santos', package_pricing: 'Starter Package - ₱150,000', account_ownership: 'Sole Proprietorship', last_purchase: '2026-09-01', status: 'Pending Verification', current_volume: 50, target_milestone: 500, commission_rate: '3%', territory: 'Lapasan District', contact: '+63 917 888 1234' },
];

const INITIAL_VEHICLES: VehicleCrew[] = [
  { id: 'v1', vehicle: 'Isuzu Elf (ABC 1234)', home_location: 'Baloy Central Hub', approved_capacity: '150 Cylinders', crew_today: 'Juan Perez (Driver), Mark T. (Helper)', status: 'Active' },
  { id: 'v2', vehicle: 'Mitsubishi Canter (XYZ 5678)', home_location: 'Cugman Depot', approved_capacity: '200 Cylinders', crew_today: 'Roberto S. (Driver), Alan K.', status: 'In Transit' },
  { id: 'v3', vehicle: 'L300 Utility Van (JKL 9012)', home_location: 'Lapasan Branch', approved_capacity: '80 Cylinders', crew_today: 'Mario B. (Driver)', status: 'Maintenance' },
];

const INITIAL_STOPS: UnplannedStop[] = [
  { id: 's1', created_at: '2026-09-03T00:00:00Z', account_name: 'Lapasan Gas Retailer', territory: 'Lapasan District', reason: 'Unauthorized secondary depot drop detected outside designated zone', status: 'Flagged' },
  { id: 's2', created_at: '2026-09-02T00:00:00Z', account_name: 'Bulua Mini Mart', territory: 'Bulua West', reason: 'Inventory count mismatch during route audit check', status: 'Under Review' },
];

const INITIAL_CHEQUES: ChequeDeposit[] = [
  { id: 'c1', created_at: '2026-09-01T00:00:00Z', cheque_date: '2026-09-05', issuing_bank: 'BDO Unibank (#000192)', customer_name: 'Quezon Gas Depot', amount: 35000, status: 'Awaiting Bank Clearing' },
  { id: 'c2', created_at: '2026-09-02T00:00:00Z', cheque_date: '2026-09-06', issuing_bank: 'BPI (#000841)', customer_name: 'Delos Reyes Trading', amount: 60000, status: 'Queued for Deposit' },
];

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fiestagas_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to Maria P. if previously signed in or can show login page
    return null;
  });

  // Navigation State
  const [activePage, setActivePage] = useState<string>('overview');
  const [overviewSubTab, setOverviewSubTab] = useState<string>('transaction-monitoring');
  const [franchiseeSubTab, setFranchiseeSubTab] = useState<string>('active-franchisees');
  const [approvalSubTab, setApprovalSubTab] = useState<string>('unplanned-stops');

  // Supabase Configuration State
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Business Data States
  const [transactions, setTransactions] = useState<SalesTransaction[]>(INITIAL_TRANSACTIONS);
  const [inventory, setInventory] = useState<InventoryStock[]>(INITIAL_INVENTORY);
  const [movements, setMovements] = useState<InventoryMovement[]>(INITIAL_MOVEMENTS);
  const [dailyLogs, setDailyLogs] = useState<DailyCountLog[]>(INITIAL_DAILY_LOGS);
  const [franchisees, setFranchisees] = useState<Franchisee[]>(INITIAL_FRANCHISEES);
  const [vehicles, setVehicles] = useState<VehicleCrew[]>(INITIAL_VEHICLES);
  const [stops, setStops] = useState<UnplannedStop[]>(INITIAL_STOPS);
  const [cheques, setCheques] = useState<ChequeDeposit[]>(INITIAL_CHEQUES);

  // Modals & Printable
  const [inspectedTxn, setInspectedTxn] = useState<SalesTransaction | null>(null);
  const [printableData, setPrintableData] = useState<any>(null);

  // Synchronize session on load
  useEffect(() => {
    const checkAuth = async () => {
      const client = getSupabaseClient();
      if (client && supabaseConfig.isConfigured) {
        const { data } = await client.auth.getSession();
        if (data.session && data.session.user) {
          const u = data.session.user;
          const meta = u.user_metadata || {};
          const name = meta.full_name || u.email?.split('@')[0] || 'Operations Specialist';
          const userObj: UserProfile = {
            id: u.id,
            email: u.email || '',
            fullName: name,
            role: meta.role || 'Central Operations',
            branch: meta.branch || 'Baloy Depot',
            avatarInitials: name.slice(0, 2).toUpperCase(),
          };
          setCurrentUser(userObj);
          localStorage.setItem('fiestagas_user', JSON.stringify(userObj));
        }
      }
    };
    checkAuth();
  }, [supabaseConfig.isConfigured]);

  // Fetch all tables from Supabase or Fallback
  const fetchAllData = useCallback(async () => {
    setIsRefreshing(true);
    const client = getSupabaseClient();

    if (client && supabaseConfig.isConfigured) {
      try {
        const [
          resTxns,
          resInv,
          resMov,
          resLogs,
          resFran,
          resVeh,
          resStops,
          resCheques,
        ] = await Promise.all([
          client.from('sales_transactions').select('*').order('created_at', { ascending: false }),
          client.from('inventory_stock').select('*').order('location', { ascending: true }),
          client.from('inventory_movements').select('*').order('created_at', { ascending: false }),
          client.from('daily_count_logs').select('*').order('created_at', { ascending: false }),
          client.from('franchisees').select('*').order('created_at', { ascending: false }),
          client.from('vehicles_and_crew').select('*').order('created_at', { ascending: false }),
          client.from('unplanned_stops').select('*').order('created_at', { ascending: false }),
          client.from('cheque_deposits').select('*').order('created_at', { ascending: false }),
        ]);

        if (resTxns.data && resTxns.data.length > 0) setTransactions(resTxns.data);
        if (resInv.data && resInv.data.length > 0) setInventory(resInv.data);
        if (resMov.data && resMov.data.length > 0) setMovements(resMov.data);
        if (resLogs.data && resLogs.data.length > 0) setDailyLogs(resLogs.data);
        if (resFran.data && resFran.data.length > 0) setFranchisees(resFran.data);
        if (resVeh.data && resVeh.data.length > 0) setVehicles(resVeh.data);
        if (resStops.data && resStops.data.length > 0) setStops(resStops.data);
        if (resCheques.data && resCheques.data.length > 0) setCheques(resCheques.data);
      } catch (err) {
        console.warn('Supabase fetch returned error; maintaining current datasets:', err);
      }
    }
    setIsRefreshing(false);
  }, [supabaseConfig.isConfigured]);

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser, fetchAllData]);

  // Handlers for Operations
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('fiestagas_user', JSON.stringify(user));
  };

  const handleLogout = async () => {
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    localStorage.removeItem('fiestagas_user');
    setCurrentUser(null);
  };

  const handleConfigChanged = () => {
    setSupabaseConfig(getSupabaseConfig());
    fetchAllData();
  };

  // POS Order Save
  const handleSaveOrder = async (
    newTxnData: Omit<SalesTransaction, 'id' | 'created_at'>,
    shouldPrint: boolean
  ): Promise<SalesTransaction | null> => {
    const client = getSupabaseClient();
    const tempId = `tx-${Date.now().toString().slice(-6)}`;
    const fullTxn: SalesTransaction = {
      id: tempId,
      created_at: new Date().toISOString(),
      ...newTxnData,
    };

    if (client && supabaseConfig.isConfigured) {
      try {
        const { data, error } = await client.from('sales_transactions').insert([fullTxn]).select();
        if (error) {
          console.warn('Could not insert to Supabase, saving locally:', error.message);
        } else if (data && data[0]) {
          const inserted = data[0] as SalesTransaction;
          setTransactions((prev) => [inserted, ...prev]);
          return inserted;
        }
      } catch (err) {
        console.warn('Supabase exception:', err);
      }
    }

    setTransactions((prev) => [fullTxn, ...prev]);
    return fullTxn;
  };

  // Stock Transfer
  const handleTransferStock = async (from: string, to: string, qty: number, handler: string) => {
    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      created_at: new Date().toISOString(),
      from_location: from,
      to_location: to,
      quantity: qty,
      handler,
      note: `Transferred ${qty} crates from ${from} to ${to}`,
    };

    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('inventory_movements').insert([newMovement]);
      } catch (e) {
        console.warn(e);
      }
    }

    setMovements((prev) => [newMovement, ...prev]);
    setInventory((prev) =>
      prev.map((item) => {
        if (item.location === from) {
          return { ...item, filled_crates: Math.max(0, item.filled_crates - qty) };
        }
        if (item.location === to) {
          return { ...item, filled_crates: item.filled_crates + qty };
        }
        return item;
      })
    );
  };

  // Plant Exchange
  const handlePlantExchange = async (plant: string, emptyQty: number, filledQty: number) => {
    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      created_at: new Date().toISOString(),
      from_location: plant,
      to_location: 'Main warehouse',
      quantity: filledQty,
      handler: 'Plant Operations',
      note: `Exchanged ${emptyQty} empty for ${filledQty} filled crates`,
    };

    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('inventory_movements').insert([newMovement]);
      } catch (e) {
        console.warn(e);
      }
    }

    setMovements((prev) => [newMovement, ...prev]);
    setInventory((prev) =>
      prev.map((item) => {
        if (item.location === 'Main warehouse') {
          return {
            ...item,
            filled_crates: item.filled_crates + filledQty,
            empty_crates: Math.max(0, item.empty_crates - emptyQty),
          };
        }
        return item;
      })
    );
  };

  // Add Franchisee
  const handleAddFranchisee = async (data: Omit<Franchisee, 'id' | 'created_at'>) => {
    const newFranchisee: Franchisee = {
      id: `f-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...data,
    };

    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('franchisees').insert([newFranchisee]);
      } catch (e) {
        console.warn(e);
      }
    }

    setFranchisees((prev) => [newFranchisee, ...prev]);
  };

  // Approve Franchisee
  const handleApproveFranchisee = async (id: string) => {
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('franchisees').update({ status: 'Active' }).eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    setFranchisees((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'Active' } : f))
    );
  };

  // Reject Franchisee
  const handleRejectFranchisee = async (id: string) => {
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('franchisees').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    setFranchisees((prev) => prev.filter((f) => f.id !== id));
  };

  // Approvals Actions
  const handleClearStop = async (id: string) => {
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('unplanned_stops').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDepositCheque = async (id: string) => {
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('cheque_deposits').update({ status: 'Deposited & Cleared' }).eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    setCheques((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Deposited & Cleared' } : c))
    );
  };

  // Add Vehicle
  const handleAddVehicle = async (data: Omit<VehicleCrew, 'id' | 'created_at'>) => {
    const newVehicle: VehicleCrew = {
      id: `v-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...data,
    };
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('vehicles_and_crew').insert([newVehicle]);
      } catch (e) {
        console.warn(e);
      }
    }
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  const handleRemoveVehicle = async (id: string) => {
    const client = getSupabaseClient();
    if (client && supabaseConfig.isConfigured) {
      try {
        await client.from('vehicles_and_crew').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
    }
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // If user is not logged in, show the Login Page
  if (!currentUser) {
    return (
      <>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        />
        <SupabaseConfigModal
          isOpen={isSupabaseModalOpen}
          onClose={() => setIsSupabaseModalOpen(false)}
          onConfigChanged={handleConfigChanged}
        />
      </>
    );
  }

  // Determine Page Title
  const getPageTitle = () => {
    switch (activePage) {
      case 'overview':
        return 'Overview & Transaction Audit';
      case 'sales':
        return 'Sales Ledger';
      case 'pos':
        return 'Point of Sale Register';
      case 'dispatch':
        return 'Fleet Dispatch Radar';
      case 'inventory':
        return 'Inventory & Custody Chain';
      case 'accounts':
        return 'Franchisee Operations';
      case 'approvals':
        return 'Approvals & Compliance';
      case 'vehicles':
        return 'Vehicle & Crew Roster';
      case 'reports':
        return 'Financial & Operational Reports';
      default:
        return 'Distribution Operations';
    }
  };

  const pendingApprovalsCount = stops.length + franchisees.filter((f) => f.status === 'Pending Verification').length + cheques.filter((c) => c.status !== 'Deposited & Cleared').length;
  const pendingFranchiseesCount = franchisees.filter((f) => f.status === 'Pending Verification').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-['Manrope',sans-serif]">
      {/* Printable Receipt (Invisible except during window.print()) */}
      <PrintableReceipt receiptData={printableData} />

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        overviewSubTab={overviewSubTab}
        setOverviewSubTab={setOverviewSubTab}
        franchiseeSubTab={franchiseeSubTab}
        setFranchiseeSubTab={setFranchiseeSubTab}
        approvalSubTab={approvalSubTab}
        setApprovalSubTab={setApprovalSubTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        isSupabaseConfigured={supabaseConfig.isConfigured}
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        pendingFranchiseesCount={pendingFranchiseesCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          pageTitle={getPageTitle()}
          subTitle={currentUser.role}
          currentUser={currentUser}
          isSupabaseConfigured={supabaseConfig.isConfigured}
          onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
          onRefreshData={fetchAllData}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 overflow-y-auto">
          {activePage === 'overview' && (
            <OverviewPage
              activeSubTab={overviewSubTab}
              setActiveSubTab={setOverviewSubTab}
              transactions={transactions}
              onRefresh={fetchAllData}
              onSelectTransaction={(txn) => setInspectedTxn(txn)}
              isSupabaseConfigured={supabaseConfig.isConfigured}
            />
          )}

          {activePage === 'sales' && (
            <SalesPage
              transactions={transactions}
              onRefresh={fetchAllData}
              onSelectTransaction={(txn) => setInspectedTxn(txn)}
            />
          )}

          {activePage === 'pos' && (
            <PosPage
              onSaveOrder={handleSaveOrder}
              recentTransactions={transactions}
              onSelectTransaction={(txn) => setInspectedTxn(txn)}
              onPrintPreview={(data) => {
                setPrintableData({
                  ...data,
                  cashierName: currentUser.fullName,
                });
                setTimeout(() => window.print(), 100);
              }}
            />
          )}

          {activePage === 'dispatch' && <DispatchPage />}

          {activePage === 'inventory' && (
            <InventoryPage
              inventory={inventory}
              movements={movements}
              dailyLogs={dailyLogs}
              onTransferStock={handleTransferStock}
              onPlantExchange={handlePlantExchange}
            />
          )}

          {activePage === 'accounts' && (
            <FranchiseesPage
              activeSubTab={franchiseeSubTab}
              setActiveSubTab={setFranchiseeSubTab}
              franchisees={franchisees}
              onRefresh={fetchAllData}
              onApprove={handleApproveFranchisee}
              onReject={handleRejectFranchisee}
              onAddAccount={handleAddFranchisee}
            />
          )}

          {activePage === 'approvals' && (
            <ApprovalsPage
              activeSubTab={approvalSubTab}
              setActiveSubTab={setApprovalSubTab}
              stops={stops}
              pendingFranchisees={franchisees.filter((f) => f.status === 'Pending Verification')}
              cheques={cheques}
              onRefresh={fetchAllData}
              onClearStop={handleClearStop}
              onApproveFranchisee={handleApproveFranchisee}
              onDepositCheque={handleDepositCheque}
            />
          )}

          {activePage === 'vehicles' && (
            <VehiclesPage
              vehicles={vehicles}
              onRefresh={fetchAllData}
              onAddVehicle={handleAddVehicle}
              onRemoveVehicle={handleRemoveVehicle}
            />
          )}

          {activePage === 'reports' && (
            <ReportsPage transactions={transactions} onRefresh={fetchAllData} />
          )}
        </main>
      </div>

      {/* Supabase Connection Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigChanged={handleConfigChanged}
      />

      {/* Transaction Detail Audit Modal */}
      <RecordModal
        transaction={inspectedTxn}
        onClose={() => setInspectedTxn(null)}
      />
    </div>
  );
}
