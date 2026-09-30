import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext.tsx';
import { useStore } from '../../context/StoreContext.tsx';
import { Save, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

export const AdminCMS: React.FC = () => {
  const { homepageCms, saveHomepageCMS } = useAdmin();
  const { showToast } = useStore();

  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [primaryCtaText, setPrimaryCtaText] = useState('');
  const [secondaryCtaText, setSecondaryCtaText] = useState('');

  // Promo Banner
  const [promoActive, setPromoActive] = useState(true);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoSubtitle, setPromoSubtitle] = useState('');
  const [promoButtonText, setPromoButtonText] = useState('');
  const [promoLink, setPromoLink] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (homepageCms) {
      setHeroHeadline(homepageCms.heroHeadline);
      setHeroSubheadline(homepageCms.heroSubheadline);
      setHeroImage(homepageCms.heroImage);
      setPrimaryCtaText(homepageCms.primaryCtaText);
      setSecondaryCtaText(homepageCms.secondaryCtaText);

      setPromoActive(homepageCms.promoBanner?.active ?? true);
      setPromoTitle(homepageCms.promoBanner?.title || '');
      setPromoSubtitle(homepageCms.promoBanner?.subtitle || '');
      setPromoButtonText(homepageCms.promoBanner?.buttonText || '');
      setPromoLink(homepageCms.promoBanner?.link || '/limited-stock');
    }
  }, [homepageCms]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveHomepageCMS({
        heroHeadline,
        heroSubheadline,
        heroImage,
        primaryCtaText,
        secondaryCtaText,
        promoBanner: {
          active: promoActive,
          title: promoTitle,
          subtitle: promoSubtitle,
          buttonText: promoButtonText,
          link: promoLink,
        },
      });
      showToast('Homepage CMS updated successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to save CMS updates', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-neutral-900 uppercase">
          Homepage CMS & Visual Banners
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Update the hero copy, imagery, and promotional overstock announcements without editing code.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Hero Section Card */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2">
            1. Hero Campaign Banner
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Hero Campaign Headline *
              </label>
              <input
                type="text"
                required
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-display font-bold text-neutral-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Hero Subheading / Brand Message *
              </label>
              <textarea
                rows={3}
                required
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Hero Campaign Image Asset Path / URL *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded font-mono text-[11px] text-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Primary CTA Button Label
                </label>
                <input
                  type="text"
                  value={primaryCtaText}
                  onChange={(e) => setPrimaryCtaText(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Secondary CTA Button Label
                </label>
                <input
                  type="text"
                  value={secondaryCtaText}
                  onChange={(e) => setSecondaryCtaText(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Promotional Overstock Banner */}
        <div className="bg-white p-6 rounded border border-neutral-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neutral-900">
              2. Promotional Overstock Banner
            </h2>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-800">
              <input
                type="checkbox"
                checked={promoActive}
                onChange={(e) => setPromoActive(e.target.checked)}
                className="accent-neutral-900"
              />
              <span>Banner Active</span>
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Banner Headline
              </label>
              <input
                type="text"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded font-semibold text-neutral-900"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">
                Banner Description
              </label>
              <input
                type="text"
                value={promoSubtitle}
                onChange={(e) => setPromoSubtitle(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={promoButtonText}
                  onChange={(e) => setPromoButtonText(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">
                  Button Target Link
                </label>
                <input
                  type="text"
                  value={promoLink}
                  onChange={(e) => setPromoLink(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-neutral-900 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-neutral-900 text-white rounded font-semibold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish CMS'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
