import React, { useState } from 'react';
import { RefreshCw, Download, Search, RotateCcw, Filter, CheckCircle2 } from 'lucide-react';
import { SalesTransaction } from '../types';

interface Props {
  transactions: SalesTransaction[];
  onRefresh: () => void;
  onSelectTransaction: (txn: SalesTransaction) => void;
}

export const SalesPage: React.FC<Props> = ({
  transactions,
  onRefresh,
  onSelectTransaction,
}) => {
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterPayment, setFilterPayment] = useState('');

  const filtered = transactions.filter((t) => {
    const matchDate = !filterDate || t.created_at.startsWith(filterDate);
    const matchLoc = !filterLocation || t.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchPay = !filterPayment || t.payment_method === filterPayment;
    return matchDate && matchLoc && matchPay;
  });

  const totalCollected = transactions.reduce((sum, t) => sum + Number(t.total_amount || 0), 0);
  const completedCount = transactions.filter((t) => t.status === 'Completed').length;
  const cashExchanges = transactions.filter((t) => t.payment_method === 'Cash').length;
  const newCylinders = transactions.filter((t) => t.payment_method !== 'Cash').length;

  const resetFilters = () => {
    setFilterDate('');
    setFilterLocation('');
    setFilterPayment('');
  };

  const exportFilteredCSV = () => {
    const headers = ['ID,Date,Location,Customer,Type,Payment,Proof,Amount,Status\n'];
    const rows = filtered.map(
      (t) =>
        `"${t.id}","${t.created_at}","${t.location}","${t.customer_name}","${t.customer_type}","${t.payment_method}","${t.proof_note || ''}","${t.total_amount}","${t.status}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FiestaGas_Sales_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-['Manrope',sans-serif]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            LIVE TRANSACTION LEDGER
          </span>
          <h2 className="text-2xl font-extrabold text-[#112820] tracking-tight">Sales</h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Ledger</span>
          </button>
          <button
            onClick={exportFilteredCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered Sales</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Total Collected (Completed)
            </span>
            <div className="text-2xl font-black text-[#112820] mt-1">
              ₱{totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {completedCount} orders
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Exchanges (Empty Returns)
            </span>
            <div className="text-2xl font-black text-[#112820] mt-1">{cashExchanges}</div>
          </div>
          <div className="px-3 py-1.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Transactions
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              New Cylinders
            </span>
            <div className="text-2xl font-black text-[#112820] mt-1">{newCylinders}</div>
          </div>
          <div className="px-3 py-1.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Transactions
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Sales Date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Location</label>
          <input
            type="text"
            placeholder="e.g. Baloy, BGC"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Payment Method</label>
          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="GCash">GCash</option>
            <option value="Bank transfer">Bank transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetFilters}
            className="p-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="flex-1 py-2 px-3 bg-[#112820] text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            Apply Filters ({filtered.length})
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <p className="text-xs text-slate-500">
          💡 Click any ledger row to open its detailed audit review (quantities, payment evidence, receipt, and audit history).
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-bold uppercase text-slate-600 tracking-wider">
                <th className="p-3">Sales Date</th>
                <th className="p-3">Location</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No sales matching the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTransaction(t)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-semibold text-slate-800">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-slate-700 font-bold">{t.location}</td>
                    <td className="p-3 text-slate-900 font-semibold">{t.customer_name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          t.payment_method === 'Cash'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.payment_method === 'GCash'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {t.payment_method}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-[#112820]">
                      ₱{Number(t.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
