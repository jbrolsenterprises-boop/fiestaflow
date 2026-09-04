import React from 'react';
import { CartItem } from '../types';

interface ReceiptProps {
  receiptData: {
    invoiceNo: string;
    date: string;
    time: string;
    customerType: string;
    customerName: string;
    items: CartItem[];
    paymentMethod: string;
    proofNote: string;
    totalAmount: number;
    cashierName: string;
  } | null;
}

export const PrintableReceipt: React.FC<ReceiptProps> = ({ receiptData }) => {
  if (!receiptData) return null;

  return (
    <div id="printableReceipt">
      <div style={{ textAlign: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>FiestaGas</h3>
        <p style={{ margin: 0, fontSize: '11px' }}>
          Baloy, Cagayan de Oro City<br />
          Official Sales Invoice / Cash Voucher
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
        <span>Date: {receiptData.date}</span>
        <span>Time: {receiptData.time}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
        <span>Receipt No:</span>
        <b>#{receiptData.invoiceNo}</b>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
        <span>Cashier:</span>
        <span>{receiptData.cashierName || 'Maria P.'}</span>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

      <div style={{ margin: '4px 0', fontWeight: 'bold' }}>CUSTOMER DETAILS:</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
        <span>Type:</span>
        <span>{receiptData.customerType}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
        <span>Name:</span>
        <b>{receiptData.customerName}</b>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

      <div style={{ margin: '4px 0', fontWeight: 'bold' }}>ORDER DETAILS:</div>
      {receiptData.items.map((i, idx) => (
        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
          <span>
            {i.name} (x{i.qty})
          </span>
          <span>₱{(i.price * i.qty).toFixed(2)}</span>
        </div>
      ))}

      <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
        <span>Payment Method:</span>
        <b>{receiptData.paymentMethod}</b>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
        <span>Proof / Reference:</span>
        <span>{receiptData.proofNote || 'POS Cash Register'}</span>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '10px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold', margin: '6px 0' }}>
        <span>TOTAL AMOUNT:</span>
        <span>₱{receiptData.totalAmount.toFixed(2)}</span>
      </div>

      <div style={{ borderTop: '1px dashed #000', margin: '12px 0 6px 0' }} />

      <div style={{ textAlign: 'center', marginTop: '12px' }}>
        <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Thank you for your business!</p>
        <p style={{ margin: '2px 0 0 0', fontSize: '10px' }}>FiestaGas Distribution Network</p>
      </div>
    </div>
  );
};
