import React, { useState } from 'react';
import { Plus, Minus, Trash2, Printer, CheckCircle, Upload, Store, User, Sparkles } from 'lucide-react';
import { CartItem, SalesTransaction } from '../types';

interface Props {
  onSaveOrder: (transactionData: Omit<SalesTransaction, 'id' | 'created_at'>, shouldPrint: boolean) => Promise<SalesTransaction | null>;
  recentTransactions: SalesTransaction[];
  onSelectTransaction: (txn: SalesTransaction) => void;
  onPrintPreview: (receiptData: any) => void;
}

export const PosPage: React.FC<Props> = ({
  onSaveOrder,
  recentTransactions,
  onSelectTransaction,
  onPrintPreview,
}) => {
  const [customerType, setCustomerType] = useState<'walkin' | 'franchisee'>('walkin');
  const [franchiseeAccount, setFranchiseeAccount] = useState('Delos Reyes Trading');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'GCash' | 'Bank transfer' | 'Cheque'>('Cash');
  const [proofNote, setProofNote] = useState('');
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState(() => `FG-${Date.now().toString().slice(-6)}`);
  const [isSaving, setIsSaving] = useState(false);
  const [showRefillPicker, setShowRefillPicker] = useState(false);
  const [showNewCylPicker, setShowNewCylPicker] = useState(false);
  const [showCratePicker, setShowCratePicker] = useState(false);

  // Add Refill: following user's original logic, add both variants to cart
  const handleRefillClick = () => {
    addItemToCart('Refill (Filled)', 35);
    addItemToCart('Refill (Empty Return)', 0);
    hideSubPickers();
  };

  const handleNewCylinderClick = () => {
    addItemToCart('New Cylinder (Filled)', 60);
    hideSubPickers();
  };

  const handleCrateOption = (type: 'Filled' | 'Empty Return') => {
    addItemToCart(`Crate (${type})`, 450);
    hideSubPickers();
  };

  const hideSubPickers = () => {
    setShowRefillPicker(false);
    setShowNewCylPicker(false);
    setShowCratePicker(false);
  };

  const addItemToCart = (name: string, price: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.name === name);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { name, price, qty: 1 }];
    });
  };

  const updateQty = (index: number, change: number) => {
    setCart((prev) => {
      const item = prev[index];
      if (!item) return prev;
      const newQty = item.qty + change;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const next = [...prev];
      next[index] = { ...item, qty: newQty };
      return next;
    });
  };

  const removeItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
    setProofNote('');
    setProofFileName(null);
    setInvoiceNumber(`FG-${Date.now().toString().slice(-6)}`);
    hideSubPickers();
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
    }
  };

  const handleCompleteSale = async (shouldPrint: boolean) => {
    if (cart.length === 0) {
      alert('Please add at least one item before recording transaction.');
      return;
    }

    setIsSaving(true);
    const customerName =
      customerType === 'franchisee' ? franchiseeAccount : 'Walk-in Customer';

    const fullProof = proofFileName
      ? `${proofNote.trim() ? proofNote.trim() + ' | ' : ''}Attachment: ${proofFileName}`
      : proofNote.trim() || 'POS Register Direct Order';

    const newTxnData: Omit<SalesTransaction, 'id' | 'created_at'> = {
      location: 'BGC Branch',
      customer_name: customerName,
      customer_type: customerType === 'franchisee' ? 'Franchisee' : 'Walk-in end user',
      payment_method: paymentMethod,
      proof_note: fullProof,
      total_amount: cartTotal,
      status: paymentMethod === 'Cheque' ? 'Pending Deposit' : 'Completed',
    };

    const saved = await onSaveOrder(newTxnData, shouldPrint);
    setIsSaving(false);

    if (saved) {
      if (shouldPrint) {
        onPrintPreview({
          invoiceNo: invoiceNumber,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          customerType: customerType === 'franchisee' ? 'Franchisee' : 'Walk-in end user',
          customerName,
          items: cart,
          paymentMethod,
          proofNote: fullProof,
          totalAmount: cartTotal,
        });
      }
      clearCart();
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-['Manrope',sans-serif]">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">
            BGC BRANCH · REGISTER 01
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">Point of sale</h2>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
          <span className="w-2 h-2 rounded-full bg-[#3ECF8E] shadow-[0_0_8px_#3ECF8E] animate-pulse"></span>
          <span>REGISTER OPEN</span>
        </div>
      </div>

      {/* 2-Column POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input & Item Selection */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              POS REGISTER · BGC BRANCH
            </span>
            <h3 className="text-lg font-black text-slate-900">New sale</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose customer type, pick gas products, designate payment method, then save and print.
            </p>
          </div>

          {/* Customer Type Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Customer type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCustomerType('walkin')}
                className={`py-2.5 px-4 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                  customerType === 'walkin'
                    ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-md shadow-indigo-500/25'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Walk-in end user
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('franchisee')}
                className={`py-2.5 px-4 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
                  customerType === 'franchisee'
                    ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-md shadow-indigo-500/25'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Franchisee
              </button>
            </div>

            {customerType === 'franchisee' && (
              <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 animate-in fade-in duration-200">
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Franchisee account
                </label>
                <select
                  value={franchiseeAccount}
                  onChange={(e) => setFranchiseeAccount(e.target.value)}
                  className="w-full p-2.5 text-xs border-2 border-slate-200 rounded-xl bg-white font-semibold text-slate-800 focus:outline-hidden focus:border-[#6366F1]"
                >
                  <option value="Delos Reyes Trading">Delos Reyes Trading · Gold package</option>
                  <option value="Northway Retail Hub">Northway Retail Hub · Starter package</option>
                  <option value="Quezon Gas Depot">Quezon Gas Depot · Silver package</option>
                </select>
              </div>
            )}
          </div>

          {/* Item Picker */}
          <div>
            <span className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              ADD AN ITEM
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleRefillClick}
                className="p-4 rounded-2xl border-2 border-slate-100 hover:border-[#6366F1] bg-white hover:bg-indigo-50/20 text-center transition-all cursor-pointer group shadow-2xs active:scale-95"
              >
                <div className="font-black text-sm text-slate-900 group-hover:scale-105 transition-transform">
                  Refill
                </div>
                <div className="text-xs font-black text-[#6366F1] mt-1">₱35</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Adds Filled & Empty</div>
              </button>

              <button
                type="button"
                onClick={handleNewCylinderClick}
                className="p-4 rounded-2xl border-2 border-slate-100 hover:border-[#6366F1] bg-white hover:bg-indigo-50/20 text-center transition-all cursor-pointer group shadow-2xs active:scale-95"
              >
                <div className="font-black text-sm text-slate-900 group-hover:scale-105 transition-transform">
                  New Cylinder
                </div>
                <div className="text-xs font-black text-[#6366F1] mt-1">₱60</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Complete Tank</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCratePicker(!showCratePicker);
                  setShowRefillPicker(false);
                  setShowNewCylPicker(false);
                }}
                className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer group shadow-2xs active:scale-95 ${
                  showCratePicker
                    ? 'border-[#6366F1] bg-indigo-50/30'
                    : 'border-slate-100 hover:border-[#6366F1] bg-white hover:bg-indigo-50/20'
                }`}
              >
                <div className="font-black text-sm text-slate-900 group-hover:scale-105 transition-transform">
                  Crate
                </div>
                <div className="text-xs font-black text-[#6366F1] mt-1">₱450</div>
                <div className="text-[10px] text-slate-400 mt-0.5">24 Cylinders</div>
              </button>
            </div>

            {/* Crate Sub Options */}
            {showCratePicker && (
              <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
                <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Select Crate Type:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCrateOption('Filled')}
                    className="py-2 text-xs font-bold bg-white hover:bg-indigo-50/40 hover:text-[#6366F1] border border-slate-200 rounded-lg cursor-pointer"
                  >
                    Filled (₱450)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCrateOption('Empty Return')}
                    className="py-2 text-xs font-bold bg-white hover:bg-indigo-50/40 hover:text-[#6366F1] border border-slate-200 rounded-lg cursor-pointer"
                  >
                    Empty Return (₱450)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Payment method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full p-2.5 text-xs font-bold border-2 border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:border-[#6366F1]"
            >
              <option value="Cash">Cash</option>
              <option value="GCash">GCash</option>
              <option value="Bank transfer">Bank transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Proof of Payment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Proof of payment / Note
            </label>
            <input
              type="text"
              placeholder="Reference / cheque no. / transaction note"
              value={proofNote}
              onChange={(e) => setProofNote(e.target.value)}
              className="w-full p-2.5 text-xs border-2 border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#6366F1]"
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="file"
                id="posProofFile"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-[#6366F1] hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
            {proofFileName && (
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                Selected: {proofFileName}
              </span>
            )}
          </div>
        </div>

        {/* Right: Live Cart & Sales Invoice Panel */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  SALES INVOICE
                </span>
                <h3 className="text-base font-black text-slate-900">New sale</h3>
                <span className="text-xs font-mono font-bold text-indigo-600">
                  Invoice #{invoiceNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={clearCart}
                className="px-2.5 py-1 text-xs font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                Clear cart
              </button>
            </div>

            {/* Cart Items List */}
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider text-[10px]">Live cart items</span>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  No items added yet. Click Refill, New Cylinder, or Crate on the left.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-extrabold text-slate-800">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          ₱{item.price} each · Total ₱{item.price * item.qty}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(idx, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(idx, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-700 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Total and Actions */}
          <div className="border-t border-slate-200/80 pt-4 mt-4 space-y-4">
            <div className="flex items-center justify-between text-base">
              <span className="font-bold text-slate-500">Total due</span>
              <span className="font-black text-2xl text-slate-900">
                ₱{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleCompleteSale(true)}
                disabled={isSaving || cart.length === 0}
                className="py-3 px-4 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Save & Print</span>
              </button>
              <button
                type="button"
                onClick={() => handleCompleteSale(false)}
                disabled={isSaving || cart.length === 0}
                className="py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-800 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <CheckCircle className="w-4 h-4 text-[#3ECF8E]" />
                <span>Save Only</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Register Sales Log */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Recent Register Sales Log</h3>
            <p className="text-xs text-slate-500">Live stream of transactions completed at this station.</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-bold uppercase text-slate-500 tracking-wider">
                <th className="p-3.5">Time</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentTransactions.slice(0, 5).map((t) => (
                <tr
                  key={t.id}
                  onClick={() => onSelectTransaction(t)}
                  className="hover:bg-indigo-50/30 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 font-semibold text-slate-800">
                    {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3.5 text-slate-600">{t.location}</td>
                  <td className="p-3.5 font-bold text-slate-900">{t.customer_name}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-700">
                      {t.payment_method}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-black text-slate-900">
                    ₱{Number(t.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
