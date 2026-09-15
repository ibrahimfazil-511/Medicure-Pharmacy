import React from 'react';
import { FileText, ShieldCheck, X , Info } from 'lucide-react';

const policyContent = {
  privacy: {
    title: 'Privacy Policy',
    icon: ShieldCheck,
    sections: [
      ['Information we collect', 'We collect information you provide when placing an order, including your name, phone number, email address, delivery address, and order details.'],
      ['How we use your information', 'We use this information to process orders, arrange delivery, verify prescriptions, provide order support, and improve our pharmacy services.'],
      ['Information security', 'We limit access to customer information to the people and services needed to operate MediCure Pharmacy. We do not sell customer information.'],
      ['Your choices', 'You may contact us to ask about, correct, or remove your personal information, subject to records we must keep for legal or operational reasons.'],
      ['Contact', 'For privacy questions, please contact MediCure Pharmacy through the Contact Us option on this website.']
    ]
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    sections: [
      ['Using our service', 'You agree to provide accurate customer and delivery information and to use this website only for lawful purposes.'],
      ['Orders and availability', 'An order is subject to product availability and pharmacist review where required. We may contact you to confirm an order or clarify its details.'],
      ['Prescription medicines', 'Prescription medicines are supplied only after the required prescription has been reviewed and approved by our pharmacy team.'],
      ['Cash on delivery', 'Our current payment method is Cash on Delivery. Payment is collected when the order is delivered, unless we communicate another arrangement.'],
      ['Delivery and support', 'Delivery times are estimates and can change because of location, traffic, weather, or product verification. Please contact us if there is a problem with your order.']
    ]
  },
  about: {
    title: 'About Us',
    icon: Info, // ya UserCheck / HeartHandshake / Info icon import kar lein
    sections: [
      ['Who we are', 'MediCure Pharmacy is your trusted online partner for genuine medicines, health products, and daily wellness needs.'],
      ['Our mission', 'We aim to make healthcare simple and affordable by delivering original medicines directly to your doorstep with care.'],
      ['Quality guaranteed', 'All our products come from verified suppliers, and prescription medicines are checked by qualified pharmacy staff before delivery.'],
      ['Fast & safe delivery', 'We pack your orders safely and deliver them quickly with temperature-controlled handling for sensitive medicines.'],
      ['Customer care', 'Our support team is always here to help you with product details, order updates, and healthcare guidance whenever you need it.']
    ]
  }
};

export default function LegalModal({ type, onClose }) {
  if (!type || !policyContent[type]) return null;

  const policy = policyContent[type];
  const Icon = policy.icon;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 p-2.5 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      <section role="dialog" aria-modal="true" aria-labelledby="legal-modal-title" className="relative z-10 max-h-[92dvh] w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3.5 sm:px-7 sm:py-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <h2 id="legal-modal-title" className="text-base sm:text-lg font-black text-slate-900">{policy.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:text-slate-900 active:scale-95">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="max-h-[calc(92dvh-76px)] space-y-4 sm:space-y-5 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6 no-scrollbar">
          <p className="text-xs sm:text-sm leading-6 text-slate-600">MediCure Pharmacy values clear, responsible, and secure healthcare service.</p>
          {policy.sections.map(([heading, text]) => (
            <div key={heading}>
              <h3 className="text-xs sm:text-sm font-black text-slate-900">{heading}</h3>
              <p className="mt-1 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}