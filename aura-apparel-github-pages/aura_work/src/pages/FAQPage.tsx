import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const FAQPage: React.FC = () => {
  const { storeSettings } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What exactly is "Export Leftover" & Overstock apparel?',
      a: 'Export leftovers are authentic, Grade-A garments manufactured in certified textile mills across Pakistan for renowned European and North American fashion brands. Mills produce extra buffer pieces (overruns) to ensure order compliance. Once the foreign shipment leaves, these surplus garments remain—brand new, high thread-count, with identical fabrics and stitching.',
    },
    {
      q: 'Why do you operate under a "Limited Stock / No-Restock" model?',
      a: 'Because we purchase real factory surplus lots and cancelled order runs rather than mass-producing cheap fast fashion. Each consignment brings a fixed quantity (often just 6 to 25 units per style). Once a lot sells out in our I-8 Markaz stores or online, it is permanently sold out.',
    },
    {
      q: 'How does shipping and delivery work across Pakistan?',
      a: 'We dispatch daily from our I-8 Markaz Islamabad fulfillment desk using trusted couriers (TCS, Leopards, Trax). Orders to Islamabad & Rawalpindi usually arrive in 1 to 2 business days. Other major cities (Lahore, Karachi, Peshawar, Faisalabad, Multan) arrive in 2 to 4 business days. Free delivery applies to orders above Rs. 3,500.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes! Cash on Delivery is available across all major cities and towns throughout Pakistan. You can pay cash to the courier upon parcel delivery.',
    },
    {
      q: 'How do I pay via Bank Transfer / Meezan Raast?',
      a: 'Select Bank Transfer at checkout. Our Meezan Bank account and Raast ID will be displayed. Transfer the amount through your mobile banking app or ATM, and send the payment screenshot on WhatsApp (+92 314 0855 651) with your Order ID for immediate priority dispatch.',
    },
    {
      q: 'Can I visit and try on clothes in Islamabad?',
      a: 'Absolutely! We operate two physical branches in I-8 Markaz: Shop 14/15, Zakki Plaza and Shop 20, Plaza 2000. You are welcome to try on sizes, inspect the fabric weights, and purchase in person. We are open 7 days a week from 11:30 AM to 11:00 PM.',
    },
    {
      q: 'What is your Exchange & Return policy?',
      a: 'We offer a 7-day exchange window. If a size does not fit or you wish to exchange an item, you can swap it at our I-8 Markaz store or return it via courier in original unused condition with tags attached.',
    },
  ];

  const whatsappNum = (storeSettings?.whatsapp || '+92 314 0855 651').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-neutral-200 pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Knowledge Base
        </span>
        <h1 className="font-display text-3xl font-bold text-neutral-900 mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-neutral-600 mt-1">
          Everything you need to know about our export surplus curation, I-8 Markaz stores, and nationwide delivery.
        </p>
      </div>

      <div className="bg-white rounded border border-neutral-200 divide-y divide-neutral-200/80 shadow-2xs">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="p-5">
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left flex items-center justify-between gap-4 font-semibold text-sm text-neutral-900 focus:outline-none"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-xs text-neutral-600 leading-relaxed pr-6">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help Box */}
      <div className="p-6 bg-[#FAF9F5] border border-neutral-300 rounded flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-neutral-900 text-sm">Still have a question?</h3>
          <p className="text-xs text-neutral-600 mt-0.5">
            Our retail specialists at I-8 Markaz are live on WhatsApp to assist with garment measurements.
          </p>
        </div>
        <a
          href={`https://wa.me/${whatsappNum}`}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-emerald-800 text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 flex items-center gap-2 shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
