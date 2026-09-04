import React from 'react';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle, FileText, Landmark } from 'lucide-react';
import { UnplannedStop, Franchisee, ChequeDeposit } from '../types';

interface Props {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  stops: UnplannedStop[];
  pendingFranchisees: Franchisee[];
  cheques: ChequeDeposit[];
  onRefresh: () => void;
  onClearStop: (id: string) => Promise<void>;
  onApproveFranchisee: (id: string) => Promise<void>;
  onDepositCheque: (id: string) => Promise<void>;
}

export const ApprovalsPage: React.FC<Props> = ({
  activeSubTab,
  setActiveSubTab,
  stops,
  pendingFranchisees,
  cheques,
  onRefresh,
  onClearStop,
  onApproveFranchisee,
  onDepositCheque,
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-['Manrope',sans-serif]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">
            COMPLIANCE & VERIFICATION QUEUE
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Approvals & Audits
          </h2>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 hover:border-[#6366F1] hover:text-[#6366F1] transition-all shadow-2xs cursor-pointer active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Approvals</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveSubTab('unplanned-stops')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'unplanned-stops'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Unplanned Account-Acquisition Stop ({stops.length})
        </button>
        <button
          onClick={() => setActiveSubTab('pending-verification')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'pending-verification'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Pending Franchisee Verification ({pendingFranchisees.length})
        </button>
        <button
          onClick={() => setActiveSubTab('cheque-monitoring')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'cheque-monitoring'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Cheque Awaiting Deposit Monitoring ({cheques.length})
        </button>
      </div>

      {/* Sub-Tab 1: Unplanned Stops */}
      {activeSubTab === 'unplanned-stops' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">
            Flagged accounts requiring immediate verification before granting new acquisition rights or territory access.
          </p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Date Flagged</th>
                  <th className="p-3.5">Account Name</th>
                  <th className="p-3.5">Territory / Location</th>
                  <th className="p-3.5">Reason for Stop</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stops.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No account acquisition stops currently flagged.
                    </td>
                  </tr>
                ) : (
                  stops.map((s) => (
                    <tr key={s.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="p-3.5 font-semibold text-slate-800">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 font-black text-slate-900">{s.account_name}</td>
                      <td className="p-3.5 text-slate-600">{s.territory}</td>
                      <td className="p-3.5 text-slate-700">{s.reason}</td>
                      <td className="p-3.5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onClearStop(s.id)}
                          className="px-3.5 py-1.5 bg-[#3ECF8E] hover:bg-emerald-600 text-white rounded-lg text-[11px] font-black transition-colors cursor-pointer shadow-xs active:scale-95"
                        >
                          Clear Stop
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Pending Franchisee Verification */}
      {activeSubTab === 'pending-verification' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">
            New franchisee applications and credential submissions pending administrative clearance.
          </p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Application Date</th>
                  <th className="p-3.5">Franchisee / Owner</th>
                  <th className="p-3.5">Business Package</th>
                  <th className="p-3.5">Submitted Documents</th>
                  <th className="p-3.5">Verification Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingFranchisees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No pending franchisee applications in review queue.
                    </td>
                  </tr>
                ) : (
                  pendingFranchisees.map((f) => (
                    <tr key={f.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="p-3.5 font-semibold text-slate-800">
                        {f.created_at ? new Date(f.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="p-3.5">
                        <div className="font-black text-slate-900">{f.account_name}</div>
                        <div className="text-[11px] text-slate-500">{f.owner_name}</div>
                      </td>
                      <td className="p-3.5 text-slate-700 font-semibold">{f.package_pricing}</td>
                      <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                        Business Permit, DTI/SEC, Tax ID
                      </td>
                      <td className="p-3.5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                          Pending Review
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onApproveFranchisee(f.id)}
                          className="px-3.5 py-1.5 bg-[#3ECF8E] hover:bg-emerald-600 text-white rounded-lg text-[11px] font-black transition-colors cursor-pointer shadow-xs active:scale-95"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Cheque Monitoring */}
      {activeSubTab === 'cheque-monitoring' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">
            Post-dated and OTC payment cheques awaiting bank deposit confirmation and ledger posting.
          </p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Cheque Date</th>
                  <th className="p-3.5">Issuing Bank & No.</th>
                  <th className="p-3.5">Account / Customer</th>
                  <th className="p-3.5 text-right">Amount</th>
                  <th className="p-3.5">Deposit Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cheques.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No cheques awaiting deposit in ledger.
                    </td>
                  </tr>
                ) : (
                  cheques.map((c) => (
                    <tr key={c.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="p-3.5 font-semibold text-slate-800">{c.cheque_date}</td>
                      <td className="p-3.5 font-black text-slate-900">{c.issuing_bank}</td>
                      <td className="p-3.5 text-slate-700">{c.customer_name}</td>
                      <td className="p-3.5 text-right font-black text-slate-900">
                        ₱{Number(c.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            c.status === 'Deposited & Cleared'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {c.status !== 'Deposited & Cleared' && (
                          <button
                            onClick={() => onDepositCheque(c.id)}
                            className="px-3.5 py-1.5 bg-[#3ECF8E] hover:bg-emerald-600 text-white rounded-lg text-[11px] font-black transition-colors cursor-pointer shadow-xs active:scale-95"
                          >
                            Mark Deposited
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
