import React, { useState } from 'react';
import { RefreshCw, Download, Search, CheckCircle2, TrendingUp, CreditCard, ShoppingBag, Database } from 'lucide-react';
import { SalesTransaction } from '../types';

interface Props {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  transactions: SalesTransaction[];
  onRefresh: () => void;
  onSelectTransaction: (txn: SalesTransaction) => void;
  isSupabaseConfigured: boolean;
}

export const OverviewPage: React.FC<Props> = ({
  activeSubTab,
  setActiveSubTab,
  transactions,
  onRefresh,
  onSelectTransaction,
  isSupabaseConfigured,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate stats
  const totalVolume = transactions.reduce((sum, t) => sum + Number(t.total_amount || 0), 0);
  const totalTxns = transactions.length;
  const avgTicket = totalTxns > 0 ? totalVolume / totalTxns : 0;
  const digitalCount = transactions.filter((t) =>
    ['GCash', 'Bank transfer', 'Cheque'].includes(t.payment_method)
  ).length;
  const digitalRatio = totalTxns > 0 ? Math.round((digitalCount / totalTxns) * 100) : 0;

  // Filtered transactions for the ledger stream
  const filtered = transactions.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.customer_name?.toLowerCase().includes(term) ||
      t.location?.toLowerCase().includes(term) ||
      t.payment_method?.toLowerCase().includes(term) ||
      t.proof_note?.toLowerCase().includes(term) ||
      t.id?.toLowerCase().includes(term)
    );
  });

  const exportCSV = () => {
    const headers = ['ID,Date,Location,Customer,Type,Payment,Proof,Amount,Status\n'];
    const rows = transactions.map(
      (t) =>
        `"${t.id}","${t.created_at}","${t.location}","${t.customer_name}","${t.customer_type}","${t.payment_method}","${t.proof_note || ''}","${t.total_amount}","${t.status}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FiestaGas_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">
            {currentDateStr}
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Transaction Monitoring Overview
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-indigo-50/50 hover:text-[#6366F1] hover:border-indigo-200 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Live Stream</span>
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger CSV</span>
          </button>
        </div>
      </div>

      {/* Overview Sub-Tabs */}
      <div className="flex gap-2 border-b border-slate-200/80 pb-2">
        <button
          onClick={() => setActiveSubTab('transaction-monitoring')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'transaction-monitoring'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/25'
              : 'bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
          }`}
        >
          Transaction Monitoring
        </button>
        <button
          onClick={() => setActiveSubTab('live-stream-ledger')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'live-stream-ledger'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/25'
              : 'bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
          }`}
        >
          Live Stream Ledger
        </button>
        <button
          onClick={() => setActiveSubTab('executive-metrics')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'executive-metrics'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/25'
              : 'bg-white border-2 border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200'
          }`}
        >
          Executive Metrics
        </button>
      </div>

      {/* Sub-Section 1: Transaction Monitoring Cards */}
      {activeSubTab === 'transaction-monitoring' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Gross Sales Volume
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ₱{totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isSupabaseConfigured ? 'Supabase Sync' : 'Active Ledger'}
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Total Transactions
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">{totalTxns}</div>
              </div>
              <div className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                Recorded Orders
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Avg Transaction Ticket
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ₱{avgTicket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                Per Sales Order
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  Digital/Cheque Ratio
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">{digitalRatio}%</div>
              </div>
              <div className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                Non-Cash Audit
              </div>
            </div>
          </div>

          {/* Quick preview of recent 4 transactions */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Recent Activity Stream</h3>
                <p className="text-xs text-slate-500">Fast transaction verification across branch terminals</p>
              </div>
              <button
                onClick={() => setActiveSubTab('live-stream-ledger')}
                className="text-xs font-bold text-[#6366F1] hover:text-indigo-700 cursor-pointer"
              >
                View full live ledger →
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-3.5">Date / Time</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Payment</th>
                    <th className="p-3.5 text-right">Amount</th>
                    <th className="p-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.slice(0, 5).map((txn) => (
                    <tr
                      key={txn.id}
                      onClick={() => onSelectTransaction(txn)}
                      className="hover:bg-indigo-50/30 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5 font-semibold text-slate-800">
                        {new Date(txn.created_at).toLocaleString([], {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3.5 text-slate-600">{txn.location}</td>
                      <td className="p-3.5 font-bold text-slate-900">{txn.customer_name}</td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700">
                          {txn.payment_method}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-black text-slate-900">
                        ₱{Number(txn.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            txn.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Section 2: Live Stream Ledger Table */}
      {activeSubTab === 'live-stream-ledger' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Live Monitoring Ledger Stream</h3>
              <p className="text-xs text-slate-500">
                Synchronized in real-time with Supabase Cloud DB tables and POS terminals.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search customer, location, ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border-2 border-slate-200 rounded-xl focus:outline-hidden focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Customer / Account</th>
                  <th className="p-3.5">Payment Details</th>
                  <th className="p-3.5 text-right">Transaction Amount</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No matching transactions found in ledger.
                    </td>
                  </tr>
                ) : (
                  filtered.map((txn) => (
                    <tr
                      key={txn.id}
                      onClick={() => onSelectTransaction(txn)}
                      className="hover:bg-indigo-50/30 cursor-pointer transition-colors"
                    >
                      <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">
                        {new Date(txn.created_at).toLocaleString([], {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-3.5 text-slate-700 whitespace-nowrap">{txn.location}</td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {txn.customer_name}
                        {txn.proof_note && (
                          <div className="text-[11px] font-normal text-slate-500 truncate max-w-xs">
                            {txn.proof_note}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${
                            txn.payment_method === 'Cash'
                              ? 'bg-emerald-100 text-emerald-800'
                              : txn.payment_method === 'GCash'
                              ? 'bg-indigo-100 text-indigo-800'
                              : txn.payment_method === 'Bank transfer'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {txn.payment_method}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-black text-slate-900 whitespace-nowrap">
                        ₱{Number(txn.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                            txn.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Section 3: Executive Metrics */}
      {activeSubTab === 'executive-metrics' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Executive Performance Snapshot</h3>
            <p className="text-xs text-slate-500">High-level database aggregates pulled directly from Supabase tables.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Database Engine Status
              </span>
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#3ECF8E]" />
                <span>
                  {isSupabaseConfigured ? 'Supabase Postgres Live Connection' : 'Offline / In-Memory Demo Active'}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Active tables: <code>sales_transactions</code>, <code>inventory_stock</code>, <code>franchisees</code>, <code>vehicles_and_crew</code>, <code>cheque_deposits</code>.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                Real-Time Sync Engine
              </span>
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Database className="w-4 h-4 text-[#6366F1]" />
                <span>Active Telemetry & POS Feed Listeners</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatic multi-terminal synchronization enabled across BGC, Baloy Hub, and Quezon City outlets.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
