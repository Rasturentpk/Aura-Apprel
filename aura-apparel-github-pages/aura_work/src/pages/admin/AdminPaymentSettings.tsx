import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { CreditCard, Banknote, Building, Save } from 'lucide-react';

export const AdminPaymentSettings: React.FC = () => {
  const { paymentSettings, savePaymentSettings } = useAdmin();
  const { showToast } = useStore();

  const [codEnabled, setCodEnabled] = useState(true);
  const [codInstructions, setCodInstructions] = useState('');

  const [bankTransferEnabled, setBankTransferEnabled] = useState(true);
  const [bankName, setBankName] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [branch, setBranch] = useState('');
  const [bankInstructions, setBankInstructions] = useState('');

  const [manualPaymentEnabled, setManualPaymentEnabled] = useState(true);
  const [manualPaymentInstructions, setManualPaymentInstructions] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (paymentSettings) {
      setCodEnabled(paymentSettings.codEnabled);
      setCodInstructions(paymentSettings.codInstructions || '');

      setBankTransferEnabled(paymentSettings.bankTransferEnabled);
      if (paymentSettings.bankDetails) {
        setBankName(paymentSettings.bankDetails.bankName || '');
        setAccountTitle(paymentSettings.bankDetails.accountTitle || '');
        setAccountNumber(paymentSettings.bankDetails.accountNumber || '');
        setIban(paymentSettings.bankDetails.iban || '');
        setBranch(paymentSettings.bankDetails.branch || '');
        setBankInstructions(paymentSettings.bankDetails.instructions || '');
      }

      setManualPaymentEnabled(paymentSettings.manualPaymentEnabled);
      setManualPaymentInstructions(paymentSettings.manualPaymentInstructions || '');
    }
  }, [paymentSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await savePaymentSettings({
        codEnabled,
        codInstructions,
        bankTransferEnabled,
        bankDetails: {
          bankName,
          accountTitle,
          accountNumber,
          iban,
          branch,
          instructions: bankInstructions,
        },
        manualPaymentEnabled,
        manualPaymentInstructions,
      });
      showToast('Payment settings updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save payment settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
          Payment Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Enable or disable payment options, configure Meezan Raast account info, and courier COD terms.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Cash on Delivery (COD) */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-neutral-800" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900">
                1. Cash on Delivery (COD)
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="accent-neutral-900"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1">
              Customer Instructions
            </label>
            <textarea
              rows={2}
              value={codInstructions}
              onChange={(e) => setCodInstructions(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
            />
          </div>
        </div>

        {/* Bank Transfer / Meezan Raast */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-neutral-800" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900">
                2. Bank Transfer / Meezan Raast
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
              <input
                type="checkbox"
                checked={bankTransferEnabled}
                onChange={(e) => setBankTransferEnabled(e.target.checked)}
                className="accent-neutral-900"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Meezan Bank Limited"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Account Title</label>
              <input
                type="text"
                value={accountTitle}
                onChange={(e) => setAccountTitle(e.target.value)}
                placeholder="AURA APPAREL RETAIL"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="02010108920194"
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">IBAN / Raast ID</label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="PK45MEZN0002010108920194"
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono text-neutral-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-bold mb-1">Branch Name</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="I-8 Markaz Branch, Islamabad"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-bold mb-1">Payment Instructions to Customer</label>
              <textarea
                rows={2}
                value={bankInstructions}
                onChange={(e) => setBankInstructions(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Manual Payment / In-Store Pickup */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-neutral-800" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900">
                3. In-Store Pickup / JazzCash / EasyPaisa
              </h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
              <input
                type="checkbox"
                checked={manualPaymentEnabled}
                onChange={(e) => setManualPaymentEnabled(e.target.checked)}
                className="accent-neutral-900"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1">
              Instructions
            </label>
            <textarea
              rows={2}
              value={manualPaymentInstructions}
              onChange={(e) => setManualPaymentInstructions(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Payment Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
