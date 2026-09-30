import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { Store, Save, ExternalLink } from 'lucide-react';

export const AdminStoreSettings: React.FC = () => {
  const { storeSettings, saveStoreSettings } = useAdmin();
  const { showToast } = useStore();

  const [brandName, setBrandName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  
  // Hours
  const [hoursWeekdays, setHoursWeekdays] = useState('');
  const [hoursFriday, setHoursFriday] = useState('');
  const [hoursWeekends, setHoursWeekends] = useState('');
  const [hoursNotes, setHoursNotes] = useState('');

  // Top banner text
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (storeSettings) {
      setBrandName(storeSettings.brandName);
      setBusinessType(storeSettings.businessType);
      setPhone(storeSettings.phone);
      setWhatsapp(storeSettings.whatsapp);
      setEmail(storeSettings.email);
      setMapsUrl(storeSettings.mapsUrl);

      setHoursWeekdays(storeSettings.hours?.weekdays || '11:30 AM - 11:00 PM');
      setHoursFriday(storeSettings.hours?.friday || '02:30 PM - 11:30 PM');
      setHoursWeekends(storeSettings.hours?.weekends || '11:30 AM - 11:30 PM');
      setHoursNotes(storeSettings.hours?.notes || '');

      setAnnouncementText(storeSettings.announcementBar?.text || '');
      setAnnouncementEnabled(storeSettings.announcementBar?.enabled ?? true);
    }
  }, [storeSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveStoreSettings({
        brandName,
        businessType,
        phone,
        whatsapp,
        email,
        mapsUrl,
        hours: {
          weekdays: hoursWeekdays,
          friday: hoursFriday,
          weekends: hoursWeekends,
          notes: hoursNotes,
        },
        announcementBar: {
          enabled: announcementEnabled,
          text: announcementText,
          link: '/shop',
        },
      });
      showToast('Store settings updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save store settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
          Store Information & Operating Hours
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Manage business contact, WhatsApp numbers, I-8 Markaz addresses, and opening hours.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Contact Info */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2">
            1. Brand Identity & Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Business Type</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">WhatsApp Support Number *</label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+92 314 0855 651"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 314 0855 651"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-bold mb-1">Contact Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@auraapparel.pk"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-700 font-bold mb-1">Google Maps Direct URL *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={mapsUrl}
                  onChange={(e) => setMapsUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/6SozQkfxZtNGyNcr5"
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded text-neutral-900 font-mono text-[11px]"
                />
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-neutral-100 border border-neutral-300 rounded flex items-center gap-1 text-neutral-700 hover:text-black"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours (Managed from Admin - Mandatory) */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2">
            2. Retail Store Hours (Islamabad Outlets)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">Mon - Thu Hours</label>
              <input
                type="text"
                value={hoursWeekdays}
                onChange={(e) => setHoursWeekdays(e.target.value)}
                placeholder="11:30 AM - 11:00 PM"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Friday Hours</label>
              <input
                type="text"
                value={hoursFriday}
                onChange={(e) => setHoursFriday(e.target.value)}
                placeholder="02:30 PM - 11:30 PM"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Saturday - Sunday Hours</label>
              <input
                type="text"
                value={hoursWeekends}
                onChange={(e) => setHoursWeekends(e.target.value)}
                placeholder="11:30 AM - 11:30 PM"
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-neutral-700 font-bold mb-1">Opening Hours Footnote</label>
              <input
                type="text"
                value={hoursNotes}
                onChange={(e) => setHoursNotes(e.target.value)}
                placeholder="Open 7 days a week in I-8 Markaz Islamabad."
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Top Announcement Bar */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900">
              3. Top Announcement Bar
            </h2>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
              <input
                type="checkbox"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="accent-neutral-900"
              />
              <span>Enabled</span>
            </label>
          </div>

          <div>
            <label className="block text-neutral-700 font-bold mb-1">Announcement Text</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Export Leftovers & Overstock Drops · Limited Stock No-Restock Model"
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
            <span>{saving ? 'Saving...' : 'Save Store Information'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
