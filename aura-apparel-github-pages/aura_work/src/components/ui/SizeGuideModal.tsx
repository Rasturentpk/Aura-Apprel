import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext.tsx';
import { X, Ruler } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [tab, setTab] = useState<'tops' | 'bottoms'>('tops');

  if (!isSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-neutral-300 rounded shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-neutral-800" />
            <h2 className="font-display text-lg font-bold text-neutral-900 uppercase">
              Aura Apparel Sizing Guide
            </h2>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1 text-neutral-500 hover:text-black rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Unit selector */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded bg-neutral-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setTab('tops')}
              className={`px-3 py-1 rounded transition-colors ${
                tab === 'tops' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Shirts, Tees & Jackets
            </button>
            <button
              onClick={() => setTab('bottoms')}
              className={`px-3 py-1 rounded transition-colors ${
                tab === 'bottoms' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Trousers & Denim
            </button>
          </div>

          <div className="flex rounded bg-neutral-100 p-1 text-xs font-semibold">
            <button
              onClick={() => setUnit('inches')}
              className={`px-2.5 py-1 rounded ${
                unit === 'inches' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-1 rounded ${
                unit === 'cm' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          {tab === 'tops' ? (
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-y border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest</th>
                  <th className="py-2.5 px-3">Length</th>
                  <th className="py-2.5 px-3">Shoulder</th>
                  <th className="py-2.5 px-3">Sleeve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono tabular-nums text-neutral-800">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold">Small (S)</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '38 - 40"' : '96 - 101 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '27"' : '68 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '18"' : '46 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '24.5"' : '62 cm'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold">Medium (M)</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '41 - 43"' : '104 - 109 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '28"' : '71 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '19"' : '48 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '25"' : '63.5 cm'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold">Large (L)</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '44 - 46"' : '112 - 117 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '29"' : '74 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '20"' : '51 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '25.5"' : '65 cm'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold">X-Large (XL)</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '47 - 49"' : '119 - 124 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '30"' : '76 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '21"' : '53 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '26"' : '66 cm'}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-50 text-neutral-600 uppercase font-semibold border-y border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Waist Tag</th>
                  <th className="py-2.5 px-3">Actual Waist</th>
                  <th className="py-2.5 px-3">Hip</th>
                  <th className="py-2.5 px-3">Thigh</th>
                  <th className="py-2.5 px-3">Inseam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono tabular-nums text-neutral-800">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold">30</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '31"' : '78.5 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '38"' : '96.5 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '23"' : '58 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '32"' : '81 cm'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold">32</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '33"' : '84 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '40"' : '101.5 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '24"' : '61 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '32"' : '81 cm'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold">34</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '35"' : '89 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '42"' : '106.5 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '25"' : '63.5 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '32"' : '81 cm'}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-bold">36</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '37"' : '94 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '44"' : '112 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '26"' : '66 cm'}</td>
                  <td className="py-2.5 px-3">{unit === 'inches' ? '32"' : '81 cm'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Note on Export Sizes */}
        <div className="mt-5 p-3 bg-neutral-50 rounded border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
          <span className="font-semibold text-neutral-900">Note on Export Sizing:</span> Since our apparel consists of export leftovers manufactured for European and North American brand orders, sizing typically follows a true-to-size Western cut rather than tight Asian cuts. If you are between sizes, we recommend taking your usual size for a relaxed drape.
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
          >
            Close Sizing Guide
          </button>
        </div>

      </div>
    </div>
  );
};
