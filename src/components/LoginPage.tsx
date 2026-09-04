import React, { useState } from 'react';
import { Database, Lock, Mail, User, ShieldCheck, ArrowRight, Eye, EyeOff, Sparkles, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { getSupabaseClient, getSupabaseConfig, DEMO_USERS } from '../lib/supabase';

interface Props {
  onLoginSuccess: (user: UserProfile) => void;
  onOpenSupabaseConfig: () => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess, onOpenSupabaseConfig }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Central Operations');
  const [branch, setBranch] = useState('Baloy Depot');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const { isConfigured, url } = getSupabaseConfig();
  const supabase = getSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your work email and password.');
      return;
    }

    setLoading(true);

    try {
      if (supabase && isConfigured) {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              data: {
                full_name: fullName.trim() || 'Operations Staff',
                role,
                branch,
              },
            },
          });

          if (error) throw error;

          if (data.session && data.user) {
            const initials = (fullName.trim() || email.slice(0, 2))
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            const userProfile: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              fullName: fullName.trim() || 'Operations Staff',
              role,
              branch,
              avatarInitials: initials || 'OP',
            };
            onLoginSuccess(userProfile);
          } else {
            setInfoMsg('Account registered in Supabase! Please check your email inbox if email confirmation is required.');
          }
        } else {
          // Sign In
          const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

          if (error) throw error;

          if (data.user) {
            const userMeta = data.user.user_metadata || {};
            const name = userMeta.full_name || email.split('@')[0] || 'Operations Specialist';
            const initials = name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            const userProfile: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              fullName: name,
              role: userMeta.role || 'Central Operations',
              branch: userMeta.branch || 'Baloy Depot',
              avatarInitials: initials || 'MP',
            };
            onLoginSuccess(userProfile);
          }
        }
      } else {
        // Offline / Demo authentication fallback
        const initials = (fullName || email.split('@')[0] || 'MP')
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

        const userProfile: UserProfile = {
          id: 'user-local-' + Date.now(),
          email: email.trim(),
          fullName: fullName.trim() || (email.includes('maria') ? 'Maria P.' : email.split('@')[0]),
          role: role || 'Central Operations',
          branch: branch || 'Baloy Depot',
          avatarInitials: initials || 'OP',
        };

        // Brief delay for natural UX
        await new Promise((resolve) => setTimeout(resolve, 350));
        onLoginSuccess(userProfile);
      }
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      setErrorMsg(errMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (demo: UserProfile) => {
    onLoginSuccess(demo);
  };

  return (
    <div className="min-h-screen bg-vibrant-gradient flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-['Manrope',sans-serif]">
      {/* Background radial glow accents */}
      <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-purple-500/30 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-96 h-96 bg-rose-500/25 rounded-full blur-[90px] pointer-events-none" />

      {/* Main Frosted Card Container */}
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl lg:rounded-[44px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden border border-white/30 flex flex-col lg:flex-row z-10 my-auto">
        {/* Left Dark Hero Panel */}
        <div className="lg:w-5/12 bg-[#0F172A] p-8 lg:p-10 flex flex-col justify-between text-white relative shrink-0">
          {/* Brand header */}
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 bg-[#3ECF8E] rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(62,207,142,0.4)]">
              <span className="text-slate-950 font-black text-lg">F</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white block leading-tight">
                FiestaGas Hub
              </span>
              <span className="text-[10px] text-[#3ECF8E] font-bold tracking-wider uppercase">
                Distribution Operations
              </span>
            </div>
          </div>

          {/* Center punchy message */}
          <div className="z-10 my-8 lg:my-auto">
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 text-white">
              Power your next <br />
              <span className="text-[#3ECF8E]">distribution shift</span> today.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Real-time POS register, cloud ledger streaming, fleet route dispatching, and inventory governance.
            </p>
          </div>

          {/* Supabase Cloud Connection Box */}
          <div className="z-10 bg-slate-800/60 border border-slate-700/60 p-5 rounded-3xl flex flex-col gap-3.5 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Cloud Connection
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isConfigured
                      ? 'bg-[#3ECF8E] shadow-[0_0_8px_#3ECF8E] animate-pulse'
                      : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    isConfigured ? 'text-[#3ECF8E]' : 'text-amber-300'
                  }`}
                >
                  {isConfigured ? 'Supabase Live' : 'Demo Offline'}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-900/80 rounded-xl p-3 flex items-center justify-between font-mono text-xs text-slate-300 border border-slate-700/40">
              <span className="truncate mr-2">
                {isConfigured ? url : 'https://demo.supabase.co (Mocked)'}
              </span>
              <button
                type="button"
                onClick={onOpenSupabaseConfig}
                className="text-[#3ECF8E] hover:text-emerald-300 text-xs font-bold shrink-0 transition-colors cursor-pointer"
                title="Manage Database Connection"
              >
                Config
              </button>
            </div>
          </div>

          {/* Ambient Glows */}
          <div className="absolute top-[-100px] right-[-100px] w-72 h-72 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-[-50px] left-[-50px] w-60 h-60 bg-rose-500/15 rounded-full blur-[60px] pointer-events-none" />
        </div>

        {/* Right Form Panel */}
        <div className="lg:w-7/12 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Tab switcher: Sign In vs Sign Up */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg(null);
                }}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  !isSignUp
                    ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In to Portal
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg(null);
                }}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isSignUp
                    ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register Staff
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{errorMsg}</span>
                </div>
              )}

              {infoMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-[#3ECF8E] shrink-0 mt-0.5" />
                  <span className="font-medium">{infoMsg}</span>
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maria Perez"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#6366F1] focus:bg-white focus:ring-0 text-slate-900 font-medium text-xs transition-colors outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="maria.p@fiestagas.ph"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#6366F1] focus:bg-white focus:ring-0 text-slate-900 font-medium text-xs transition-colors outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  {!isSignUp && (
                    <span className="text-[11px] text-[#6366F1] font-semibold hover:underline cursor-pointer">
                      Default: any secure key
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#6366F1] focus:bg-white focus:ring-0 text-slate-900 font-medium text-xs transition-colors outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Department
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-800 text-xs font-semibold focus:border-[#6366F1] focus:bg-white outline-none"
                    >
                      <option value="Central Operations">Central Operations</option>
                      <option value="Register Cashier">Register Cashier</option>
                      <option value="Fleet Supervisor">Fleet Supervisor</option>
                      <option value="Franchisee Manager">Franchisee Manager</option>
                      <option value="Inventory Inspector">Inventory Inspector</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Home Branch
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-800 text-xs font-semibold focus:border-[#6366F1] focus:bg-white outline-none"
                    >
                      <option value="Baloy Central Hub">Baloy Central Hub</option>
                      <option value="BGC Branch">BGC Branch</option>
                      <option value="Quezon City Branch">Quezon City Branch</option>
                      <option value="Lapasan Depot">Lapasan Depot</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#6366F1] hover:bg-[#4F46E5] active:scale-[0.98] text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-3"
              >
                {loading ? (
                  <span>Authenticating with Supabase...</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Supabase Staff Account' : 'Sign In to Operations'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 1-Click Fast Operations Presets */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                1-Click Operations Presets
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Instant Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(user)}
                  className="p-2.5 rounded-xl border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 text-left flex items-center justify-between transition-all group cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 text-[#6366F1] font-extrabold flex items-center justify-center text-xs shrink-0 group-hover:bg-[#6366F1] group-hover:text-white transition-colors">
                      {user.avatarInitials}
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {user.fullName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{user.role}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6366F1] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info footer */}
      <div className="mt-5 text-center text-xs text-white/80 font-medium z-10 drop-shadow-xs">
        FiestaGas Operations · Powered by PostgreSQL & Supabase Engine
      </div>
    </div>
  );
};
