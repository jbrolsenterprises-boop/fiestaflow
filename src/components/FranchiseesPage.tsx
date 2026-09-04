import React, { useState } from 'react';
import { RefreshCw, Plus, Check, X, Users, Award, BookOpen, ShieldCheck } from 'lucide-react';
import { Franchisee } from '../types';

interface Props {
  activeSubTab: string;
  setActiveSubTab: (tab: string) => void;
  franchisees: Franchisee[];
  onRefresh: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onAddAccount: (franchisee: Omit<Franchisee, 'id' | 'created_at'>) => Promise<void>;
}

export const FranchiseesPage: React.FC<Props> = ({
  activeSubTab,
  setActiveSubTab,
  franchisees,
  onRefresh,
  onApprove,
  onReject,
  onAddAccount,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [packagePricing, setPackagePricing] = useState('Starter Package - ₱150,000');
  const [accountOwnership, setAccountOwnership] = useState('Sole Proprietorship');
  const [territory, setTerritory] = useState('');
  const [contact, setContact] = useState('');
  const [initialStatus, setInitialStatus] = useState<'Active' | 'Pending Verification'>('Pending Verification');

  const activeFranchisees = franchisees.filter((f) => f.status === 'Active');
  const pendingFranchisees = franchisees.filter((f) => f.status === 'Pending Verification');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddAccount({
      account_name: accountName,
      owner_name: ownerName,
      package_pricing: packagePricing,
      account_ownership: accountOwnership,
      territory,
      contact,
      status: initialStatus,
      current_volume: 100,
      target_milestone: 500,
      commission_rate: '3%',
      last_purchase: new Date().toISOString().slice(0, 10),
    });
    setShowAddModal(false);
    setAccountName('');
    setOwnerName('');
    setTerritory('');
    setContact('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-['Manrope',sans-serif]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">
            CUSTOMER RELATIONSHIPS & NETWORK
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Franchisee Accounts
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 hover:border-[#6366F1] hover:text-[#6366F1] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Franchisees</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-indigo-600 text-white text-xs font-black transition-all shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Account</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveSubTab('active-franchisees')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'active-franchisees'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Active Franchisees ({activeFranchisees.length})
        </button>
        <button
          onClick={() => setActiveSubTab('pending-verification')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'pending-verification'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Pending Verification ({pendingFranchisees.length})
        </button>
        <button
          onClick={() => setActiveSubTab('commission-milestones')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'commission-milestones'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Commission Milestones
        </button>
        <button
          onClick={() => setActiveSubTab('account-directory')}
          className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'account-directory'
              ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 font-bold'
          }`}
        >
          Account Directory
        </button>
      </div>

      {/* Sub-Tab 1: Active Franchisees */}
      {activeSubTab === 'active-franchisees' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">Currently operational franchisee accounts in good standing.</p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Account / Owner</th>
                  <th className="p-3.5">Package Tier</th>
                  <th className="p-3.5">Account Ownership</th>
                  <th className="p-3.5">Last Purchase</th>
                  <th className="p-3.5">Package Pricing</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeFranchisees.map((f) => (
                  <tr key={f.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3.5">
                      <div className="font-black text-slate-900">{f.account_name}</div>
                      <div className="text-[11px] text-slate-500">{f.owner_name}</div>
                    </td>
                    <td className="p-3.5 text-slate-700 font-semibold">{f.package_pricing}</td>
                    <td className="p-3.5 text-slate-600">{f.account_ownership}</td>
                    <td className="p-3.5 text-slate-600">{f.last_purchase}</td>
                    <td className="p-3.5 font-black text-slate-900">{f.package_pricing}</td>
                    <td className="p-3.5 text-right">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Pending Verification */}
      {activeSubTab === 'pending-verification' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">Franchisee onboardings awaiting documentation clearance or operational setup.</p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Applicant / Owner</th>
                  <th className="p-3.5">Package Selected</th>
                  <th className="p-3.5">Account Ownership</th>
                  <th className="p-3.5">Submission Date</th>
                  <th className="p-3.5">Package Pricing</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingFranchisees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No pending franchisee verifications.
                    </td>
                  </tr>
                ) : (
                  pendingFranchisees.map((f) => (
                    <tr key={f.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="p-3.5">
                        <div className="font-black text-slate-900">{f.account_name}</div>
                        <div className="text-[11px] text-slate-500">{f.owner_name}</div>
                      </td>
                      <td className="p-3.5 text-slate-700 font-semibold">{f.package_pricing}</td>
                      <td className="p-3.5 text-slate-600">{f.account_ownership}</td>
                      <td className="p-3.5 text-slate-600">
                        {f.created_at ? new Date(f.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="p-3.5 font-black text-slate-900">{f.package_pricing}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onApprove(f.id)}
                            className="px-3 py-1.5 bg-[#3ECF8E] hover:bg-emerald-600 text-white rounded-lg text-[11px] font-black transition-colors cursor-pointer shadow-xs active:scale-95"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onReject(f.id)}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-black transition-colors cursor-pointer shadow-xs active:scale-95"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Commission Milestones */}
      {activeSubTab === 'commission-milestones' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">Sales milestone achievements and reward tier progress tracking.</p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Account Name</th>
                  <th className="p-3.5">Current Volume</th>
                  <th className="p-3.5">Target Milestone</th>
                  <th className="p-3.5">Commission Rate</th>
                  <th className="p-3.5">Milestone Bonus</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {franchisees.map((f) => {
                  const bonus = (f.current_volume || 450) * 12;
                  const achieved = (f.current_volume || 450) >= (f.target_milestone || 500);
                  return (
                    <tr key={f.id} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="p-3.5 font-black text-slate-900">{f.account_name}</td>
                      <td className="p-3.5 text-slate-700 font-bold">{f.current_volume || 450} Cylinders</td>
                      <td className="p-3.5 text-slate-600">{f.target_milestone || 500} Cylinders</td>
                      <td className="p-3.5 font-black text-indigo-600">{f.commission_rate || '3%'}</td>
                      <td className="p-3.5 font-black text-slate-900">₱{bonus.toLocaleString()}</td>
                      <td className="p-3.5 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            achieved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {achieved ? 'Achieved' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Account Directory */}
      {activeSubTab === 'account-directory' && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
          <p className="text-xs text-slate-500">
            Comprehensive master directory including Package Pricing, Account Ownership, and Last Purchase records.
          </p>
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                  <th className="p-3.5">Account Name</th>
                  <th className="p-3.5">Account Ownership</th>
                  <th className="p-3.5">Package Pricing</th>
                  <th className="p-3.5">Last Purchase</th>
                  <th className="p-3.5">Territory</th>
                  <th className="p-3.5 text-right">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {franchisees.map((f) => (
                  <tr key={f.id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="p-3.5">
                      <div className="font-black text-slate-900">{f.account_name}</div>
                      <div className="text-[11px] text-slate-500">Owner: {f.owner_name}</div>
                    </td>
                    <td className="p-3.5 text-slate-700">{f.account_ownership}</td>
                    <td className="p-3.5 font-black text-slate-900">{f.package_pricing}</td>
                    <td className="p-3.5 text-slate-600">{f.last_purchase}</td>
                    <td className="p-3.5 text-slate-600">{f.territory}</td>
                    <td className="p-3.5 text-right font-black text-indigo-600">{f.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200/80">
            <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold text-[#3ECF8E] uppercase tracking-wider block">
                  NETWORK EXPANSION
                </span>
                <h3 className="text-base font-black">Add New Franchisee Account</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Company / Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Northern Mindanao Gas Hub"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Account Owner / Representative</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Juan Perez"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Package Pricing Tier</label>
                  <select
                    value={packagePricing}
                    onChange={(e) => setPackagePricing(e.target.value)}
                    className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-[#6366F1]"
                  >
                    <option value="Starter Package - ₱150,000">Starter Package - ₱150,000</option>
                    <option value="Silver Package - ₱350,000">Silver Package - ₱350,000</option>
                    <option value="Gold Package - ₱600,000">Gold Package - ₱600,000</option>
                    <option value="Platinum Hub - ₱1,200,000">Platinum Hub - ₱1,200,000</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Ownership Structure</label>
                  <select
                    value={accountOwnership}
                    onChange={(e) => setAccountOwnership(e.target.value)}
                    className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-[#6366F1]"
                  >
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Cooperative">Cooperative</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Territory / Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lapasan, Cagayan de Oro"
                  value={territory}
                  onChange={(e) => setTerritory(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone / Email</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +63 917 123 4567"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Initial Status</label>
                <select
                  value={initialStatus}
                  onChange={(e) => setInitialStatus(e.target.value as any)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-[#6366F1]"
                >
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Active">Active</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl font-black transition-all shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
