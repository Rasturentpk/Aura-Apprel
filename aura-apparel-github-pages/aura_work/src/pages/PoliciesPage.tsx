import React, { useState } from 'react';

export const PoliciesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'returns' | 'privacy' | 'terms'>('returns');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="border-b border-neutral-200 pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Store Guidelines & Customer Protections
        </span>
        <h1 className="font-display text-3xl font-bold text-neutral-900 mt-1">
          Store Policies
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 gap-6 text-xs font-semibold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('returns')}
          className={`pb-3 transition-colors ${
            activeTab === 'returns'
              ? 'border-b-2 border-neutral-900 text-neutral-950 font-bold'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          Return & Exchange Policy
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 transition-colors ${
            activeTab === 'privacy'
              ? 'border-b-2 border-neutral-900 text-neutral-950 font-bold'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`pb-3 transition-colors ${
            activeTab === 'terms'
              ? 'border-b-2 border-neutral-900 text-neutral-950 font-bold'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          Terms & Conditions
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 sm:p-8 rounded border border-neutral-200 text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4">
        {activeTab === 'returns' && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-neutral-900">
              7-Day Return & Exchange Policy
            </h2>
            <p>
              At <strong>Aura Apparel</strong>, customer satisfaction is our top priority. We understand that sizing across different European and American export cuts can vary.
            </p>
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider pt-2">
              Eligibility for Exchange:
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li>Articles must be unworn, unwashed, and in their original packaging with tags intact.</li>
              <li>Exchanges must be requested within 7 days of receiving the delivery or in-store purchase.</li>
              <li>You may exchange for an alternate size, another color, or store credit equal to the purchase value.</li>
              <li>In-store exchanges can be completed instantly at Shop 14/15, Zakki Plaza, I-8 Markaz, Islamabad.</li>
            </ul>
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider pt-2">
              Courier Returns:
            </h3>
            <p className="text-xs text-neutral-600">
              For online orders outside Islamabad/Rawalpindi, send parcel tracking details to our WhatsApp team at +92 314 0855 651. Once the returned item is inspected at our I-8 showroom, the replacement article will be dispatched immediately.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-neutral-900">
              Customer Data Privacy Policy
            </h2>
            <p>
              Aura Apparel is dedicated to safeguarding your personal information. When you place an order, we collect only necessary delivery and contact details:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li>Full Name, Contact Phone Number, and Email Address.</li>
              <li>Complete Residential or Office Shipping Address.</li>
              <li>Order records, delivery statuses, and payment preferences.</li>
            </ul>
            <h3 className="font-bold text-neutral-900 text-xs uppercase tracking-wider pt-2">
              Data Security & Sharing:
            </h3>
            <p className="text-xs text-neutral-600">
              Your personal information is strictly used for order fulfillment, courier delivery dispatches (e.g. TCS, Leopards), and WhatsApp order status updates. We never sell, lease, or share customer data with third-party advertisers.
            </p>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold text-neutral-900">
              Store Terms & Conditions
            </h2>
            <p>
              By accessing Aura Apparel's online catalog or purchasing from our I-8 Markaz retail outlets, you agree to our standard terms of service:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600">
              <li><strong>Pricing & Availability:</strong> All prices are displayed in Pakistani Rupees (PKR) and include applicable taxes. Due to our limited stock model, inventory is allocated on a first-confirmed basis.</li>
              <li><strong>Export Surplus Lot Characteristics:</strong> Garments are authentic Grade-A export overruns. Slight variations in wash or international labeling format may occur as characteristic of overseas surplus lots.</li>
              <li><strong>Order Confirmation:</strong> Orders placed via Cash on Delivery or Bank Transfer may be verified by our retail team via phone call or WhatsApp message prior to courier dispatch.</li>
            </ul>
          </div>
        )}
      </div>

    </div>
  );
};
