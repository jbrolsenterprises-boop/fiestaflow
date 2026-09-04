import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Settings, History, Calendar, CheckCircle2, AlertTriangle, Boxes } from 'lucide-react';
import { InventoryStock, InventoryMovement, DailyCountLog } from '../types';

interface Props {
  inventory: InventoryStock[];
  movements: InventoryMovement[];
  dailyLogs: DailyCountLog[];
  onTransferStock: (from: string, to: string, qty: number, handler: string) => Promise<void>;
  onPlantExchange: (plant: string, emptyQty: number, filledQty: number) => Promise<void>;
}

export const InventoryPage: React.FC<Props> = ({
  inventory,
  movements,
  dailyLogs,
  onTransferStock,
  onPlantExchange,
}) => {
  const [multiplier, setMultiplier] = useState(3);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showDailyLogsModal, setShowDailyLogsModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);

  // Form states
  const [fromLocation, setFromLocation] = useState('Main warehouse');
  const [toLocation, setToLocation] = useState('BGC Branch');
  const [transferQty, setTransferQty] = useState(24);
  const [transferHandler, setTransferHandler] = useState('Ramon D. (WH-01)');

  const [plantName, setPlantName] = useState('Baloy Bottling Plant');
  const [plantEmpty, setPlantEmpty] = useState(100);
  const [plantFilled, setPlantFilled] = useState(100);

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLocation === toLocation) {
      alert('Origin and destination locations must be different.');
      return;
    }
    await onTransferStock(fromLocation, toLocation, Number(transferQty), transferHandler);
    setShowTransferModal(false);
  };

  const handlePlantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onPlantExchange(plantName, Number(plantEmpty), Number(plantFilled));
    setShowPlantModal(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-['Manrope',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">
            ALL LOCATIONS
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Inventory & custody
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 hover:border-[#6366F1] hover:text-[#6366F1] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transfer Stock</span>
          </button>
          <button
            onClick={() => setShowPlantModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-indigo-600 text-white text-xs font-black transition-all shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plant Exchange</span>
          </button>
        </div>
      </div>

      {/* Reorder Logic Banner */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3ECF8E] shadow-[0_0_8px_#3ECF8E] animate-pulse"></span>
            <h3 className="text-sm font-black text-slate-900">Reorder logic active</h3>
          </div>
          <p className="text-xs text-slate-600">
            Target = <b className="text-slate-900">{multiplier}×</b> rolling daily sales volume.{' '}
            <span className="text-rose-700 font-black">BGC is 27 crates below target.</span>
          </p>
        </div>
        <button
          onClick={() => setShowRuleModal(true)}
          className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          Adjust rule
        </button>
      </div>

      {/* Stock by Location Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Filled stock by location</h3>
            <p className="text-xs text-slate-500">170g cylinders · 24 cylinders per crate</p>
          </div>
          <button
            onClick={() => setShowDailyLogsModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Daily count log →
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Filled</th>
                <th className="p-3.5">Empty</th>
                <th className="p-3.5">Damaged</th>
                <th className="p-3.5">Target</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-black text-slate-900">{item.location}</div>
                    <div className="text-[11px] text-slate-500">{item.description}</div>
                  </td>
                  <td className="p-3.5 font-black text-slate-900">{item.filled_crates} crates</td>
                  <td className="p-3.5 text-slate-600 font-semibold">{item.empty_crates} crates</td>
                  <td className="p-3.5 text-slate-500">{item.damaged_units} units</td>
                  <td className="p-3.5 font-bold text-slate-700">
                    {Math.round(item.target_crates * (multiplier / 3))} crates
                  </td>
                  <td className="p-3.5 text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'ON TARGET'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'LOW STOCK'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custody Chain Timeline */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Custody chain</h3>
            <p className="text-xs text-slate-500">Latest stock movements & handoffs</p>
          </div>
          <button
            onClick={() => setShowMovementModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Open movement history
          </button>
        </div>

        <div className="relative pl-6 border-l-2 border-indigo-200 space-y-4 my-2">
          {movements.slice(0, 3).map((m, idx) => (
            <div key={m.id || idx} className="relative">
              <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#6366F1] border-2 border-white ring-2 ring-indigo-400"></span>
              <div className="font-black text-xs text-slate-900">
                {idx + 1}. {m.to_location}
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {m.note || `Transferred ${m.quantity} crates from ${m.from_location} (${m.handler})`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Transfer Stock Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200/80">
            <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold text-[#3ECF8E] uppercase tracking-wider block">
                  INVENTORY CONTROL
                </span>
                <h3 className="text-base font-black">Transfer Stock Between Locations</h3>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Origin Location</label>
                <select
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-[#6366F1]"
                >
                  <option value="Main warehouse">Main warehouse</option>
                  <option value="BGC Branch">BGC Branch</option>
                  <option value="Quezon City Branch">Quezon City Branch</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Destination Location</label>
                <select
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-[#6366F1]"
                >
                  <option value="BGC Branch">BGC Branch</option>
                  <option value="Quezon City Branch">Quezon City Branch</option>
                  <option value="Main warehouse">Main warehouse</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Quantity (Crates)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Handler / Driver</label>
                <input
                  type="text"
                  required
                  value={transferHandler}
                  onChange={(e) => setTransferHandler(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl font-black transition-all shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plant Exchange Modal */}
      {showPlantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200/80">
            <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold text-[#3ECF8E] uppercase tracking-wider block">
                  PLANT REPLENISHMENT
                </span>
                <h3 className="text-base font-black">Log Refill Plant Exchange</h3>
              </div>
              <button
                onClick={() => setShowPlantModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlantSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Refill Plant Depot</label>
                <input
                  type="text"
                  required
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Empty Crates Dispatched</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={plantEmpty}
                  onChange={(e) => setPlantEmpty(Number(e.target.value))}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Filled Crates Received Back</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={plantFilled}
                  onChange={(e) => setPlantFilled(Number(e.target.value))}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPlantModal(false)}
                  className="px-4 py-2 border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl font-black transition-all shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
                >
                  Record Exchange
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200/80 p-6 space-y-4">
            <div>
              <h3 className="font-black text-sm text-slate-900">Adjust Target Multiplier</h3>
              <p className="text-xs text-slate-500">Configure safety stock calculation rule</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                Target Sales Multiplier
              </label>
              <select
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className="w-full p-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-[#6366F1]"
              >
                <option value={2}>2× Rolling Sales Volume</option>
                <option value={3}>3× Rolling Sales Volume (Default)</option>
                <option value={4}>4× Rolling Sales Volume</option>
                <option value={5}>5× Rolling Sales Volume</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRuleModal(false)}
                className="px-4 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setShowRuleModal(false)}
                className="px-4 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-indigo-500/25"
              >
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Count Log Modal */}
      {showDailyLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/80 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-sm text-slate-900">Daily Physical Count History</h3>
                <p className="text-xs text-slate-500">Audited inventory balances by station</p>
              </div>
              <button
                onClick={() => setShowDailyLogsModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3">Date</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Filled</th>
                    <th className="p-3">Empty</th>
                    <th className="p-3">Audited By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-indigo-50/20">
                      <td className="p-3 font-semibold text-slate-800">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 font-black text-slate-900">{log.location}</td>
                      <td className="p-3 text-slate-700 font-bold">{log.filled_crates} crates</td>
                      <td className="p-3 text-slate-600">{log.empty_crates} crates</td>
                      <td className="p-3 text-slate-500">{log.audited_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowDailyLogsModal(false)}
                className="px-4 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movement History Modal */}
      {showMovementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200/80 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-black text-sm text-slate-900">Stock Movement & Custody Ledger</h3>
                <p className="text-xs text-slate-500">Historical custody transfers across all locations</p>
              </div>
              <button
                onClick={() => setShowMovementModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">From</th>
                    <th className="p-3">To</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Handler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-indigo-50/20">
                      <td className="p-3 font-semibold text-slate-800">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-slate-700">{m.from_location}</td>
                      <td className="p-3 font-black text-slate-900">{m.to_location}</td>
                      <td className="p-3 text-slate-700 font-bold">{m.quantity} crates</td>
                      <td className="p-3 text-slate-500">{m.handler}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowMovementModal(false)}
                className="px-4 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
