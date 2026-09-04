import React, { useState } from 'react';
import { Navigation, RefreshCw, Radio, CheckCircle, AlertTriangle, Truck } from 'lucide-react';

interface RouteItem {
  id: string;
  name: string;
  area: string;
  driver: string;
  vehicle: string;
  progress: number;
  status: 'En Route' | 'Unloading' | 'Pending';
  statusColor: string;
  gps: string;
  signedIn: boolean;
  pinX: string;
  pinY: string;
}

export const DispatchPage: React.FC = () => {
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);
  const [telemetryMessage, setTelemetryMessage] = useState<string | null>(null);

  const routes: RouteItem[] = [
    {
      id: 'R-101',
      name: 'Route #101',
      area: 'Nazareth',
      driver: 'Juanito M.',
      vehicle: 'Isuzu Elf',
      progress: 75,
      status: 'En Route',
      statusColor: 'bg-emerald-100 text-emerald-800',
      gps: '8.4821° N, 124.6471° E',
      signedIn: true,
      pinX: '22%',
      pinY: '28%',
    },
    {
      id: 'R-102',
      name: 'Route #102',
      area: 'Carmen',
      driver: 'Roberto S.',
      vehicle: 'Canter',
      progress: 90,
      status: 'Unloading',
      statusColor: 'bg-blue-100 text-blue-800',
      gps: '8.4712° N, 124.6289° E',
      signedIn: true,
      pinX: '72%',
      pinY: '62%',
    },
    {
      id: 'R-103',
      name: 'Route #103',
      area: 'Cugman',
      driver: 'Mario B.',
      vehicle: 'L300 Van',
      progress: 0,
      status: 'Pending',
      statusColor: 'bg-red-100 text-red-800',
      gps: 'GPS Signal: Inactive',
      signedIn: false,
      pinX: '58%',
      pinY: '22%',
    },
  ];

  const handleVerifyDrivers = () => {
    setTelemetryMessage('GPS Telemetry verified. 2 drivers active on Supabase fleet streaming.');
    setTimeout(() => setTelemetryMessage(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-['Manrope',sans-serif]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">
            FLEET CONTROL & DRIVER TELEMETRY
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Dispatch & routes</h2>
        </div>
        <button
          type="button"
          onClick={handleVerifyDrivers}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-xs font-bold text-slate-800 hover:border-[#6366F1] hover:text-[#6366F1] transition-all shadow-2xs cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Verify Driver Dashboard Sign-Ins</span>
        </button>
      </div>

      {telemetryMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-[#3ECF8E]" />
          <span>{telemetryMessage}</span>
        </div>
      )}

      {/* Grid: Map on Left, Route Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Map Container */}
        <div className="lg:col-span-8 bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[520px] relative shadow-xl">
          {/* Map Header */}
          <div className="px-5 py-3.5 bg-[#0F172A]/90 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between z-10 text-white">
            <div>
              <div className="font-black text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#3ECF8E] animate-pulse" />
                <span>Live GPS Tracking Radar</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Baloy Central Hub · Real-time Fleet Session Telemetry
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#3ECF8E]/20 text-[#3ECF8E] border border-[#3ECF8E]/40 shadow-[0_0_10px_rgba(62,207,142,0.2)]">
              ● Telemetry Active
            </span>
          </div>

          {/* Interactive Radar Stage */}
          <div className="flex-1 relative bg-radial from-slate-900 to-[#020617] overflow-hidden flex items-center justify-center">
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            {/* Simulated Vector Route Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="50%" y1="50%" x2="22%" y2="28%" stroke="#3ECF8E" strokeWidth="2.5" strokeDasharray="4" />
              <line x1="50%" y1="50%" x2="72%" y2="62%" stroke="#6366F1" strokeWidth="2.5" strokeDasharray="4" />
              <line x1="50%" y1="50%" x2="58%" y2="22%" stroke="#64748b" strokeWidth="2" strokeDasharray="3" opacity="0.4" />
            </svg>

            {/* Center Hub Pin */}
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-rose-500 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-black border-2 border-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.45)] flex items-center gap-1.5 z-10"
              style={{ left: '50%', top: '50%' }}
            >
              <span>📍</span>
              <span>Baloy Central Hub</span>
            </div>

            {/* Truck Pins */}
            {routes.map((r, idx) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRouteIndex(idx)}
                style={{ left: r.pinX, top: r.pinY }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-[11px] font-black border-2 shadow-xl flex items-center gap-1.5 transition-all cursor-pointer z-10 ${
                  activeRouteIndex === idx ? 'scale-110 ring-4 ring-indigo-500/40' : 'hover:scale-105'
                } ${
                  !r.signedIn
                    ? 'bg-slate-800/90 text-slate-400 border-slate-700 opacity-80'
                    : idx === 0
                    ? 'bg-[#0F172A] text-white border-[#3ECF8E] shadow-[0_0_12px_rgba(62,207,142,0.35)]'
                    : 'bg-[#0F172A] text-white border-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.35)]'
                }`}
              >
                <span>🚚</span>
                <span>{r.name} ({r.area})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Route Cards Column */}
        <div className="lg:col-span-4 space-y-3.5 max-h-[520px] overflow-y-auto pr-1">
          {routes.map((r, idx) => (
            <div
              key={r.id}
              onClick={() => setActiveRouteIndex(idx)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                activeRouteIndex === idx
                  ? 'bg-white border-[#6366F1] shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                  : 'bg-white/90 backdrop-blur-sm border-slate-200/80 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-black text-sm text-slate-900">
                  {r.name} · {r.area}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  r.status === 'En Route'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : r.status === 'Unloading'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {r.status}
                </span>
              </div>

              <div className="text-xs text-slate-500 mb-2">
                Driver: {r.driver} · {r.vehicle}
              </div>

              <div
                className={`p-2.5 rounded-xl text-[11px] font-bold mb-3 flex items-center gap-2 ${
                  r.signedIn
                    ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50/70 border border-rose-200 text-rose-800'
                }`}
              >
                <span className="text-xs">{r.signedIn ? '🟢' : '🔴'}</span>
                <span>{r.signedIn ? 'Driver Dashboard: Signed In & Streaming' : 'Driver App: Awaiting Sign-In'}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                <span>{r.gps}</span>
                <span className="font-black text-slate-900">{r.progress}%</span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    idx === 0 ? 'bg-[#3ECF8E]' : idx === 1 ? 'bg-[#6366F1]' : 'bg-slate-300'
                  }`}
                  style={{ width: `${r.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
