import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, X } from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, SUPABASE_SQL_SCHEMA, getSupabaseClient } from '../lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfigChanged: () => void;
}

export const SupabaseConfigModal: React.FC<Props> = ({ isOpen, onClose, onConfigChanged }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [key, setKey] = useState(currentConfig.key);
  const [activeTab, setActiveTab] = useState<'connect' | 'schema'>('connect');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!url.trim() || !key.trim()) {
      setTestStatus('error');
      setStatusMessage('Please enter both Supabase URL and Anon Key.');
      return;
    }

    setTestStatus('testing');
    setStatusMessage('Testing connection to Supabase...');

    try {
      saveSupabaseConfig(url, key);
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Could not create Supabase client with given credentials.');
      }

      // Quick ping test on auth or table
      const { error } = await client.from('sales_transactions').select('id').limit(1);

      if (error && error.code !== 'PGRST116') {
        // Table might not exist yet, check auth session instead
        const { error: authErr } = await client.auth.getSession();
        if (authErr) {
          throw authErr;
        }
      }

      setTestStatus('success');
      setStatusMessage('Connection confirmed! Supabase client is live.');
      onConfigChanged();
    } catch (err: unknown) {
      setTestStatus('error');
      const errMessage = err instanceof Error ? err.message : 'Unknown connection error';
      setStatusMessage(`Connection error: ${errMessage}`);
    }
  };

  const handleSave = () => {
    saveSupabaseConfig(url, key);
    onConfigChanged();
    onClose();
  };

  const handleDisconnect = () => {
    clearSupabaseConfig();
    setUrl('');
    setKey('');
    setTestStatus('idle');
    setStatusMessage('');
    onConfigChanged();
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-['Manrope',sans-serif]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#3ECF8E]/20 border border-[#3ECF8E]/40 flex items-center justify-center text-[#3ECF8E] shadow-[0_0_12px_rgba(62,207,142,0.25)]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-base tracking-tight text-white">Supabase Database Connection</h2>
              <p className="text-xs text-slate-400">Connect your Supabase project or use local fallback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('connect')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'connect'
                ? 'border-[#6366F1] text-[#6366F1] bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Connection Settings
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-[#6366F1] text-[#6366F1] bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            SQL Table Schema Setup
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'connect' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs text-indigo-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#6366F1] shrink-0 mt-0.5" />
                <div>
                  <span className="font-black">Seamless Two-Way Engine:</span> When connected, all POS transactions, inventory stock movements, franchisee accounts, and fleet logs sync directly to your live Supabase project. If disconnected, it runs safely in memory and local storage.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-[#6366F1] outline-hidden transition-all bg-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Found in your Supabase dashboard under <b>Project Settings → API</b>.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Supabase Anon Public API Key
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-[#6366F1] outline-hidden transition-all bg-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Safe client anon key for browser authentication and data querying.
                </span>
              </div>

              {testStatus !== 'idle' && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    testStatus === 'testing'
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      : testStatus === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {testStatus === 'testing' && <span className="animate-spin inline-block">⏳</span>}
                  {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-[#3ECF8E]" />}
                  {testStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span className="font-bold">{statusMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-800">PostgreSQL Table Definitions</h4>
                  <p className="text-[11px] text-slate-500">Paste this into your Supabase SQL Editor to provision all tables.</p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy SQL Schema'}
                </button>
              </div>

              <div className="relative">
                <pre className="p-3.5 bg-[#0F172A] text-[#3ECF8E] font-mono text-[11px] leading-relaxed rounded-xl overflow-x-auto max-h-[320px] select-all border border-slate-800">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentConfig.isConfigured && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Disconnect & Revert to Demo
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-4 py-2 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Test Connection
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-indigo-500/25 cursor-pointer active:scale-95"
            >
              Save Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
