import React, { useState } from 'react';
import { RefreshCw, Plus, Truck, Trash2, ShieldCheck, MapPin } from 'lucide-react';
import { VehicleCrew } from '../types';

interface Props {
  vehicles: VehicleCrew[];
  onRefresh: () => void;
  onAddVehicle: (v: Omit<VehicleCrew, 'id' | 'created_at'>) => Promise<void>;
  onRemoveVehicle: (id: string) => Promise<void>;
}

export const VehiclesPage: React.FC<Props> = ({
  vehicles,
  onRefresh,
  onAddVehicle,
  onRemoveVehicle,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [vehicleName, setVehicleName] = useState('');
  const [plateNo, setPlateNo] = useState('');
  const [homeLocation, setHomeLocation] = useState('Baloy Central Hub');
  const [capacity, setCapacity] = useState('150');
  const [crewToday, setCrewToday] = useState('');
  const [status, setStatus] = useState<'Active' | 'In Transit' | 'Maintenance' | 'Inactive'>('Active');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddVehicle({
      vehicle: `${vehicleName.trim()} (${plateNo.trim()})`,
      home_location: homeLocation,
      approved_capacity: `${capacity} Cylinders`,
      crew_today: crewToday,
      status,
    });
    setShowAddModal(false);
    setVehicleName('');
    setPlateNo('');
    setCrewToday('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-['Manrope',sans-serif]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">
            ADJUSTABLE FLEET ROSTER
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            Vehicles & crew
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 hover:border-[#6366F1] hover:text-[#6366F1] transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Fleet</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-indigo-600 text-white text-xs font-black transition-all shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Vehicle</span>
          </button>
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900">Vehicle Fleet Overview</h3>
          <p className="text-xs text-slate-500">
            Live vehicle monitoring, home locations, capacity allocations, and crew assignments.
          </p>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                <th className="p-3.5">Vehicle / Plate</th>
                <th className="p-3.5">Home Location</th>
                <th className="p-3.5">Approved Capacity</th>
                <th className="p-3.5">Crew Today</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="p-3.5 font-black text-slate-900">{v.vehicle}</td>
                  <td className="p-3.5 text-slate-600">{v.home_location}</td>
                  <td className="p-3.5 font-bold text-slate-800">{v.approved_capacity}</td>
                  <td className="p-3.5 text-slate-700 font-semibold">{v.crew_today || 'Unassigned'}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        v.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : v.status === 'In Transit'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onRemoveVehicle(v.id)}
                      className="text-slate-400 hover:text-rose-600 p-2 rounded-xl transition-colors cursor-pointer"
                      title="Remove Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200/80">
            <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold text-[#3ECF8E] uppercase tracking-wider block">
                  FLEET MANAGEMENT
                </span>
                <h3 className="text-base font-black">Add New Vehicle to Roster</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Vehicle Name / Model</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Isuzu Elf Truck 05"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Plate Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC 1234"
                  value={plateNo}
                  onChange={(e) => setPlateNo(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Home Location Depot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baloy Central Hub"
                  value={homeLocation}
                  onChange={(e) => setHomeLocation(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Approved Capacity (Cylinders)</label>
                <input
                  type="number"
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Crew Assigned Today</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Driver: Juan Perez, Assistant: Pedro"
                  value={crewToday}
                  onChange={(e) => setCrewToday(e.target.value)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Operational Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 border-2 border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-[#6366F1]"
                >
                  <option value="Active">Active</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
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
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
