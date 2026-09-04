import React, { useState } from 'react';
import { RefreshCw, Download, FileText, CheckCircle2 } from 'lucide-react';
import { SalesTransaction } from '../types';

interface Props {
  transactions: SalesTransaction[];
  onRefresh: () => void;
}

export const ReportsPage: React.FC<Props> = ({ transactions, onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('route-reconciliation');

  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.total_amount || 0), 0);
  const totalCommissions = totalRevenue * 0.05;

  const mockRoutes = [
    { id: 'R-101', area: 'Nazareth', driver: 'Juanito M. (Isuzu Elf)', loaded: 150, returned: 22, variance: '0 (Matched)', status: 'Balanced' },
    { id: 'R-102', area: 'Carmen', driver: 'Roberto S. (Canter)', loaded: 200, returned: 35, variance: '0 (Matched)', status: 'Balanced' },
    { id: 'R-103', area: 'Cugman', driver: 'Mario B. (L300 Van)', loaded: 80, returned: 80, variance: 'Pending Return', status: 'In Transit' }
  ];

  const mockStock = [
    { custodian: 'Baloy Central Hub', item: 'Refill Cylinders (Filled)', initial: 500, moved: 230, balance: 270, status: 'Verified Audit' },
    { custodian: 'Isuzu Elf (Truck 01)', item: 'Refill Cylinders (Filled)', initial: 150, moved: 128, balance: 22, status: 'On Delivery' },
    { custodian: 'Canter (Truck 04)', item: 'Crates & Bottles', initial: 200, moved: 165, balance: 35, status: 'On Delivery' },
    { custodian: 'BGC Register Branch', item: 'New Cylinder Stock', initial: 100, moved: 12, balance: 88, status: 'Verified Audit' }
  ];

  const mockCommissions = [
    { account: 'Delos Reyes Trading', method: 'Bank transfer', amount: 60000, rate: '5%', accrued: 3000, status: 'Logged' },
    { account: 'Quezon Gas Depot', method: 'Cheque', amount: 35000, rate: '4%', accrued: 1400, status: 'Awaiting Clearing' },
    { account: 'Northway Retail Hub', method: 'GCash', amount: 15000, rate: '3%', accrued: 450, status: 'Logged' }
  ];

  const exportSummary = () => {
    const content = `FiestaGas Operations Report
Generated: ${new Date().toISOString()}
Total Revenue: PHP ${totalRevenue.toFixed(2)}
Commissions Accrued: PHP ${totalCommissions.toFixed(2)}
Active Fleet Routes: 3
Total Stock Custody: 430 Cylinders
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FiestaGas_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-['Manrope',sans-serif]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">
            DATA MODEL V1 INTEGRATION
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Operations & Financial Reports
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 hover:border-[#6366F1] hover:text-[#6366F1] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Reports Data</span>
          </button>
          <button
            onClick={exportSummary}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 hover:border-[#6366F1] hover:text-[#6366F1] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Summary CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Total Revenue
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
            Daily Gross
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Active Routes
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">3</div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Reconciled: 2
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Total Stock Custody
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">430</div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            Cylinders
          </span>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Commissions Accrued
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              ₱{totalCommissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            Pending Payout
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveSubTab('route-reconciliation')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'route-reconciliation'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Route Reconciliation
        </button>
        <button
          onClick={() => setActiveSubTab('stock-custody')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'stock-custody'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Stock Custody
        </button>
        <button
          onClick={() => setActiveSubTab('payments-commissions')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'payments-commissions'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Payments & Commissions
        </button>
      </div>

      {/* Sub-Tab 1: Route Reconciliation */}
      {activeSubTab === 'route-reconciliation' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">
            Automated comparison between loaded inventory dispatched versus returning stock and payment collection.
          </p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Route ID / Area</th>
                  <th className="p-3.5">Driver / Vehicle</th>
                  <th className="p-3.5">Dispatched Qty</th>
                  <th className="p-3.5">Returned Qty</th>
                  <th className="p-3.5">Variance</th>
                  <th className="p-3.5 text-right">Reconciliation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockRoutes.map((r) => (
                  <tr key={r.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3.5 font-black text-slate-900">{r.id} · {r.area}</td>
                    <td className="p-3.5 text-slate-700 font-semibold">{r.driver}</td>
                    <td className="p-3.5 text-slate-700 font-semibold">{r.loaded} units</td>
                    <td className="p-3.5 text-slate-600">{r.returned} units</td>
                    <td className="p-3.5 font-bold text-emerald-600">{r.variance}</td>
                    <td className="p-3.5 text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Stock Custody */}
      {activeSubTab === 'stock-custody' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">
            Custody distribution log connecting hub warehouses to assigned vehicles and branch registers.
          </p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Location / Custodian</th>
                  <th className="p-3.5">Item Type</th>
                  <th className="p-3.5">Initial Stock</th>
                  <th className="p-3.5">Transferred / Sold</th>
                  <th className="p-3.5">Current Balance</th>
                  <th className="p-3.5 text-right">Custody Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockStock.map((s, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3.5 font-black text-slate-900">{s.custodian}</td>
                    <td className="p-3.5 text-slate-700 font-semibold">{s.item}</td>
                    <td className="p-3.5 text-slate-600">{s.initial}</td>
                    <td className="p-3.5 text-slate-600">{s.moved}</td>
                    <td className="p-3.5 font-black text-slate-900">{s.balance}</td>
                    <td className="p-3.5 text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Payments & Commissions */}
      {activeSubTab === 'payments-commissions' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">
            Data model mapping across payment methods, franchisee accounts, and dynamic commission structures.
          </p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Account Name</th>
                  <th className="p-3.5">Payment Method</th>
                  <th className="p-3.5 text-right">Transaction Amount</th>
                  <th className="p-3.5 text-right">Commission Rate</th>
                  <th className="p-3.5 text-right">Accrued Commission</th>
                  <th className="p-3.5 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockCommissions.map((c, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3.5 font-black text-slate-900">{c.account}</td>
                    <td className="p-3.5 text-slate-700 font-semibold">{c.method}</td>
                    <td className="p-3.5 text-right font-black text-slate-900">
                      ₱{c.amount.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right text-slate-600 font-semibold">{c.rate}</td>
                    <td className="p-3.5 text-right font-black text-emerald-600">
                      ₱{c.accrued.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
