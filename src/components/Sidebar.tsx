import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Store, 
  Navigation, 
  Boxes, 
  Users, 
  CheckSquare, 
  Truck, 
  FileSpreadsheet, 
  LogOut,
  Database,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  activePage: string;
  setActivePage: (page: string) => void;
  overviewSubTab: string;
  setOverviewSubTab: (sub: string) => void;
  franchiseeSubTab: string;
  setFranchiseeSubTab: (sub: string) => void;
  approvalSubTab: string;
  setApprovalSubTab: (sub: string) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  isSupabaseConfigured: boolean;
  onOpenSupabaseConfig: () => void;
  pendingApprovalsCount: number;
  pendingFranchiseesCount: number;
}

export const Sidebar: React.FC<Props> = ({
  activePage,
  setActivePage,
  overviewSubTab,
  setOverviewSubTab,
  franchiseeSubTab,
  setFranchiseeSubTab,
  approvalSubTab,
  setApprovalSubTab,
  currentUser,
  onLogout,
  isSupabaseConfigured,
  onOpenSupabaseConfig,
  pendingApprovalsCount,
  pendingFranchiseesCount,
}) => {
  const [overviewExpanded, setOverviewExpanded] = useState(true);
  const [posExpanded, setPosExpanded] = useState(true);
  const [franchiseeExpanded, setFranchiseeExpanded] = useState(false);
  const [approvalExpanded, setApprovalExpanded] = useState(false);

  const handleNavClick = (page: string) => {
    setActivePage(page);
    if (page === 'overview') setOverviewExpanded(!overviewExpanded);
    if (page === 'pos') setPosExpanded(!posExpanded);
    if (page === 'accounts') setFranchiseeExpanded(!franchiseeExpanded);
    if (page === 'approvals') setApprovalExpanded(!approvalExpanded);
  };

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800/80 min-h-screen select-none font-['Manrope',sans-serif]">
      {/* Brand Header */}
      <div className="p-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#3ECF8E] text-slate-950 flex items-center justify-center font-black text-base shadow-[0_0_12px_rgba(62,207,142,0.35)]">
            F
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-tight leading-none">
              FiestaFlow
            </div>
            <div className="text-[10px] tracking-widest text-[#3ECF8E] font-bold uppercase mt-1">
              Distribution Operations
            </div>
          </div>
        </div>

        {/* Supabase Connection Status Pill */}
        <div 
          onClick={onOpenSupabaseConfig}
          className="mt-3.5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-all hover:border-slate-600"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-[#3ECF8E] shadow-[0_0_8px_#3ECF8E] animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-[11px] font-semibold text-slate-200">
              {isSupabaseConfigured ? 'Supabase Live' : 'Supabase Demo'}
            </span>
          </div>
          <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-xs">
        {/* Overview */}
        <div>
          <button
            onClick={() => handleNavClick('overview')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activePage === 'overview'
                ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/40'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className={`w-4 h-4 ${activePage === 'overview' ? 'text-white' : 'text-slate-400'}`} />
              <span>Overview</span>
            </div>
            <span className={`text-[10px] ${activePage === 'overview' ? 'text-white' : 'text-[#3ECF8E]'}`}>●</span>
          </button>

          {overviewExpanded && (
            <div className="ml-4 pl-3 border-l border-slate-800 my-1 space-y-0.5">
              <button
                onClick={() => {
                  setActivePage('overview');
                  setOverviewSubTab('transaction-monitoring');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'overview' && overviewSubTab === 'transaction-monitoring'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Transaction Monitoring
              </button>
              <button
                onClick={() => {
                  setActivePage('overview');
                  setOverviewSubTab('live-stream-ledger');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'overview' && overviewSubTab === 'live-stream-ledger'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Live Stream Ledger
              </button>
              <button
                onClick={() => {
                  setActivePage('overview');
                  setOverviewSubTab('executive-metrics');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'overview' && overviewSubTab === 'executive-metrics'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Executive Metrics
              </button>
            </div>
          )}
        </div>

        {/* Sales */}
        <button
          onClick={() => handleNavClick('sales')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activePage === 'sales'
              ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/40'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Receipt className={`w-4 h-4 ${activePage === 'sales' ? 'text-white' : 'text-slate-400'}`} />
            <span>Sales</span>
          </div>
        </button>

        {/* POS */}
        <div>
          <button
            onClick={() => handleNavClick('pos')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activePage === 'pos'
                ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/40'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Store className={`w-4 h-4 ${activePage === 'pos' ? 'text-white' : 'text-slate-400'}`} />
              <span>POS Register</span>
            </div>
            <span className="px-1.5 py-0.5 text-[9px] font-black bg-[#3ECF8E] text-slate-950 rounded-sm">
              NEW
            </span>
          </button>
          {posExpanded && (
            <div className="ml-4 pl-3 border-l border-slate-800 my-1 space-y-0.5">
              <button
                onClick={() => setActivePage('pos')}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-indigo-500/20"
              >
                • New Sale
              </button>
            </div>
          )}
        </div>

        {/* Dispatch & Routes */}
        <button
          onClick={() => handleNavClick('dispatch')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activePage === 'dispatch'
              ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/40'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Navigation className={`w-4 h-4 ${activePage === 'dispatch' ? 'text-white' : 'text-slate-400'}`} />
            <span>Dispatch & routes</span>
          </div>
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded-sm">
            3
          </span>
        </button>

        {/* Inventory */}
        <button
          onClick={() => handleNavClick('inventory')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activePage === 'inventory'
              ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/40'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Boxes className={`w-4 h-4 ${activePage === 'inventory' ? 'text-white' : 'text-slate-400'}`} />
            <span>Inventory</span>
          </div>
        </button>

        {/* Franchisees */}
        <div>
          <button
            onClick={() => handleNavClick('accounts')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activePage === 'accounts'
                ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/40'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`w-4 h-4 ${activePage === 'accounts' ? 'text-white' : 'text-slate-400'}`} />
              <span>Franchisees</span>
            </div>
            {pendingFranchiseesCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-sm">
                {pendingFranchiseesCount}
              </span>
            )}
          </button>
          {franchiseeExpanded && (
            <div className="ml-4 pl-3 border-l border-slate-800 my-1 space-y-0.5">
              <button
                onClick={() => {
                  setActivePage('accounts');
                  setFranchiseeSubTab('active-franchisees');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'accounts' && franchiseeSubTab === 'active-franchisees'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Active Franchisees
              </button>
              <button
                onClick={() => {
                  setActivePage('accounts');
                  setFranchiseeSubTab('pending-verification');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'accounts' && franchiseeSubTab === 'pending-verification'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Pending Verification
              </button>
              <button
                onClick={() => {
                  setActivePage('accounts');
                  setFranchiseeSubTab('commission-milestones');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'accounts' && franchiseeSubTab === 'commission-milestones'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Commission Milestones
              </button>
              <button
                onClick={() => {
                  setActivePage('accounts');
                  setFranchiseeSubTab('account-directory');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'accounts' && franchiseeSubTab === 'account-directory'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Account Directory
              </button>
            </div>
          )}
        </div>

        {/* Approvals */}
        <div>
          <button
            onClick={() => handleNavClick('approvals')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activePage === 'approvals'
                ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/40'
                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className={`w-4 h-4 ${activePage === 'approvals' ? 'text-white' : 'text-slate-400'}`} />
              <span>Approvals</span>
            </div>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-sm">
                {pendingApprovalsCount}
              </span>
            )}
          </button>
          {approvalExpanded && (
            <div className="ml-4 pl-3 border-l border-slate-800 my-1 space-y-0.5">
              <button
                onClick={() => {
                  setActivePage('approvals');
                  setApprovalSubTab('unplanned-stops');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'approvals' && approvalSubTab === 'unplanned-stops'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Unplanned acquisition stop
              </button>
              <button
                onClick={() => {
                  setActivePage('approvals');
                  setApprovalSubTab('pending-verification');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'approvals' && approvalSubTab === 'pending-verification'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Pending franchisee verification
              </button>
              <button
                onClick={() => {
                  setActivePage('approvals');
                  setApprovalSubTab('cheque-monitoring');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  activePage === 'approvals' && approvalSubTab === 'cheque-monitoring'
                    ? 'bg-indigo-500/20 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                • Cheque awaiting deposit
              </button>
            </div>
          )}
        </div>

        <div className="pt-3 pb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3">
            MANAGE
          </span>
        </div>

        {/* Vehicles & Crew */}
        <button
          onClick={() => handleNavClick('vehicles')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activePage === 'vehicles'
              ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/40'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Truck className={`w-4 h-4 ${activePage === 'vehicles' ? 'text-white' : 'text-slate-400'}`} />
            <span>Vehicles & crew</span>
          </div>
        </button>

        {/* Reports */}
        <button
          onClick={() => handleNavClick('reports')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
            activePage === 'reports'
              ? 'bg-[#6366F1] text-white shadow-lg shadow-indigo-950/40'
              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className={`w-4 h-4 ${activePage === 'reports' ? 'text-white' : 'text-slate-400'}`} />
            <span>Reports</span>
          </div>
        </button>
      </nav>

      {/* User Profile / Logout Bar at Bottom */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              {currentUser.avatarInitials || 'MP'}
            </div>
            <div className="min-w-0 truncate">
              <div className="font-bold text-xs text-white truncate">{currentUser.fullName}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.role}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign out of FiestaGas"
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
