import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { Truck, Save } from 'lucide-react';

export const AdminDeliverySettings: React.FC = () => {
  const { deliverySettings, saveDeliverySettings } = useAdmin();
  const { showToast, formatPKR } = useStore();

  const [standardFee, setStandardFee] = useState(250);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(3500);
  const [estimatedDaysLocal, setEstimatedDaysLocal] = useState('');
  const [estimatedDaysNational, setEstimatedDaysNational] = useState('');
  const [zones, setZones] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (deliverySettings) {
      setStandardFee(deliverySettings.standardFee);
      setFreeShippingThreshold(deliverySettings.freeShippingThreshold);
      setEstimatedDaysLocal(deliverySettings.estimatedDaysLocal);
      setEstimatedDaysNational(deliverySettings.estimatedDaysNational);
      setZones(deliverySettings.zones || []);
    }
  }, [deliverySettings]);

  const handleZoneRateChange = (idx: number, rate: number) => {
    setZones((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], rate };
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveDeliverySettings({
        standardFee: Number(standardFee),
        freeShippingThreshold: Number(freeShippingThreshold),
        estimatedDaysLocal,
        estimatedDaysNational,
        zones,
      });
      showToast('Delivery settings updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save delivery settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
          Delivery & Shipping Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure Pakistan courier rates, free shipping thresholds, and estimated transit times.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Core Rates */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2">
            1. Core Delivery Rates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Standard Shipping Fee (PKR) *
              </label>
              <input
                type="number"
                required
                value={standardFee}
                onChange={(e) => setStandardFee(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono font-bold text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Free Delivery Order Threshold (PKR) *
              </label>
              <input
                type="number"
                required
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-mono font-bold text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Estimated Transit (Islamabad & Rawalpindi)
              </label>
              <input
                type="text"
                value={estimatedDaysLocal}
                onChange={(e) => setEstimatedDaysLocal(e.target.value)}
                placeholder="1-2 Business Days"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Estimated Transit (Nationwide Pakistan)
              </label>
              <input
                type="text"
                value={estimatedDaysNational}
                onChange={(e) => setEstimatedDaysNational(e.target.value)}
                placeholder="3-5 Business Days"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* City Zones */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2">
            2. City & Zone Rates
          </h2>

          <div className="space-y-3">
            {zones.map((zone, idx) => (
              <div key={zone.id || idx} className="p-3 bg-neutral-50 rounded border border-neutral-200 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-neutral-900">{zone.name}</p>
                  <p className="text-[11px] text-neutral-500">{zone.estimatedDays}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-500 text-[11px]">Fee (PKR):</span>
                  <input
                    type="number"
                    value={zone.rate}
                    onChange={(e) => handleZoneRateChange(idx, Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-neutral-300 rounded font-mono text-center font-bold text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Delivery Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
