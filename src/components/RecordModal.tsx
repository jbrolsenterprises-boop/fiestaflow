import React from 'react';
import { X, CheckCircle2, Receipt, Calendar, MapPin, User, CreditCard, FileText } from 'lucide-react';
import { SalesTransaction } from '../types';

interface Props {
  transaction: SalesTransaction | null;
  onClose: () => void;
}

export const RecordModal: React.FC<Props> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-['Manrope',sans-serif]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="bg-[#112820] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
              TRANSACTION AUDIT REVIEW
            </span>
            <h3 className="text-base font-extrabold">Audit #{transaction.id.slice(0, 8)}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-2.5">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Timestamp:</span>
              <span className="font-extrabold text-slate-800">
                {new Date(transaction.created_at).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Location / Branch:</span>
              <span className="font-bold text-slate-800">{transaction.location}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Customer Name:</span>
              <span className="font-bold text-slate-900">{transaction.customer_name}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Customer Type:</span>
              <span className="font-bold text-slate-800">{transaction.customer_type}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Payment Method:</span>
              <span className="font-extrabold text-[#112820]">{transaction.payment_method}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Payment Evidence / Note:</span>
              <span className="font-medium text-slate-700 max-w-[220px] text-right truncate">
                {transaction.proof_note || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500 font-semibold">Status:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  transaction.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {transaction.status}
              </span>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-200 flex justify-between items-center text-sm">
            <span className="font-bold text-slate-700">Total Amount:</span>
            <span className="font-black text-xl text-[#112820]">
              ₱{Number(transaction.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
