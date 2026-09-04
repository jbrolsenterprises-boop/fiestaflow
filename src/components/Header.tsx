import React from 'react';
import { Menu, Database, RefreshCw, Bell, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  pageTitle: string;
  subTitle?: string;
  currentUser: UserProfile;
  isSupabaseConfigured: boolean;
  onOpenSupabaseConfig: () => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<Props> = ({
  pageTitle,
  subTitle = 'Central operations',
  currentUser,
  isSupabaseConfigured,
  onOpenSupabaseConfig,
  onRefreshData,
  isRefreshing = false,
}) => {
  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 select-none">
      <div className="flex items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-none">
            {subTitle}
          </span>
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight mt-1">
            {pageTitle}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Supabase status button */}
        <button
          onClick={onOpenSupabaseConfig}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            isSupabaseConfigured
              ? 'bg-emerald-50/80 text-emerald-900 border-emerald-300/80 hover:bg-emerald-100'
              : 'bg-amber-50/80 text-amber-900 border-amber-300/80 hover:bg-amber-100'
          }`}
          title="Click to manage Supabase database credentials & SQL schema"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isSupabaseConfigured
                ? 'bg-[#3ECF8E] shadow-[0_0_8px_#3ECF8E] animate-pulse'
                : 'bg-amber-500'
            }`}
          />
          <span>{isSupabaseConfigured ? 'Supabase: Live' : 'Supabase: Offline'}</span>
        </button>

        {/* Global refresh button */}
        <button
          onClick={onRefreshData}
          disabled={isRefreshing}
          className="p-2 text-slate-500 hover:text-[#6366F1] hover:bg-indigo-50/60 rounded-xl border-2 border-slate-100 hover:border-indigo-100 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          title="Refresh data from database"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#6366F1]' : ''}`} />
        </button>

        {/* User location chip */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 border-2 border-slate-100">
          <span className="w-2 h-2 rounded-full bg-[#6366F1]"></span>
          <span>{currentUser.branch || 'Baloy Central Hub'}</span>
        </div>
      </div>
    </header>
  );
};
