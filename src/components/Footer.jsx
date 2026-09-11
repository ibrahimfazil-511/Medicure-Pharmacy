import React from 'react';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaWhatsapp, 
  FaTwitter, 
  FaLinkedinIn, 
  FaGithub, 
  FaShieldAlt 
} from 'react-icons/fa';

export default function Footer({ onOpenAdminPortal, onOpenPrescription, onOpenTrackOrder, onOpenContactUs, onOpenLegal }) {
  return (
    <footer className="bg-[#eaf3f3] text-slate-700 pt-8 sm:pt-16 pb-8 border-t border-[#d9e6e7]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Top Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 pb-8 sm:pb-12 border-b border-slate-300 items-start">
          
          {/* Column 1: Brand Info & License Badge */}
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
                <span className="text-teal-600 font-bold text-xl">+</span>
              </div>
              <div className="flex items-baseline text-xl font-bold tracking-tight">
                <span className="text-slate-900">Medi</span>
                <span className="text-teal-600">Cure</span>
                <span className="ml-2 font-normal text-slate-700 text-lg">Pharmacy</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Your licensed online health & wellness partner. Delivering genuine prescription medicines, OTC remedies, and health devices with temperature-controlled express delivery.
            </p>

            {/* Ministry Registered Badge Box */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mt-2 max-w-sm">
              <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1">
                <FaShieldAlt className="text-teal-600 text-base" />
                <span>Ministry Registered Pharmacy</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Drug License No: <span className="text-slate-700">05-42-2024-Rx</span>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Navigation (Connected via section IDs) */}
          <div className="md:mx-auto">
            <h3 className="text-xs font-extrabold tracking-wider text-slate-900 uppercase mb-4">
              QUICK NAVIGATION
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button type="button" onClick={onOpenAdminPortal} className="text-teal-600 hover:text-teal-700 hover:underline transition-all flex items-center gap-1 font-semibold">
                  <span className="text-teal-500">›</span> Admin / Staff Portal
                </button>
              </li>
              <li>
                <a href="/" className="text-teal-600 hover:text-teal-700 hover:underline transition-all flex items-center gap-1 font-semibold">
                  <span className="text-teal-500">›</span> Shop by Category
                </a>
              </li>
              <li>
                <button type="button" onClick={onOpenPrescription} className="text-teal-600 hover:text-teal-700 hover:underline transition-all flex items-center gap-1 font-semibold">
                  <span className="text-teal-500">›</span> Prescription Upload
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenTrackOrder} className="text-teal-600 hover:text-teal-700 hover:underline transition-all flex items-center gap-1 font-semibold">
                  <span className="text-teal-500">›</span> Track Order Status
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenContactUs} className="text-teal-600 hover:text-teal-700 hover:underline transition-all flex items-center gap-1 font-semibold">
                  <span className="text-teal-500">›</span> Contact Us & Hotline
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect With Us & Social Grid */}
          <div>
            <h3 className="text-xs font-extrabold tracking-wider text-slate-900 uppercase mb-2">
              CONNECT WITH US
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Follow our social channels for health tips, medicine advice & exclusive wellness offers:
            </p>

            {/* Social Button Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-sm">
              
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 hover:border-teal-500 hover:shadow-sm py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition group"
              >
                <FaFacebookF className="text-blue-600 text-base group-hover:scale-110 transition" />
                <span className="text-[11px] font-semibold text-slate-700">Facebook</span>
              </a>

              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 hover:border-teal-500 hover:shadow-sm py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition group"
              >
                <FaInstagram className="text-pink-600 text-base group-hover:scale-110 transition" />
                <span className="text-[11px] font-semibold text-slate-700">Instagram</span>
              </a>

              <a 
                href="https://whatsapp.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 hover:border-teal-500 hover:shadow-sm py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition group"
              >
                <FaWhatsapp className="text-emerald-500 text-base group-hover:scale-110 transition" />
                <span className="text-[11px] font-semibold text-slate-700">WhatsApp</span>
              </a>

              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 hover:border-teal-500 hover:shadow-sm py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition group"
              >
                <FaTwitter className="text-sky-500 text-base group-hover:scale-110 transition" />
                <span className="text-[11px] font-semibold text-slate-700">Twitter / X</span>
              </a>

              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 hover:border-teal-500 hover:shadow-sm py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition group"
              >
                <FaLinkedinIn className="text-blue-700 text-base group-hover:scale-110 transition" />
                <span className="text-[11px] font-semibold text-slate-700">LinkedIn</span>
              </a>

              <a 
                href="https://github.com/ibrahimfazil-511" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white border border-slate-200 hover:border-teal-500 hover:shadow-sm py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1 transition group"
              >
                <FaGithub className="text-slate-900 text-base group-hover:scale-110 transition" />
                <span className="text-[11px] font-semibold text-slate-700">GitHub</span>
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>© 2026 MediCure Pharmacy Ltd. All Rights Reserved.</p>
          <div className="flex items-center gap-4 font-medium">
            <button type="button" onClick={() => onOpenLegal('privacy')} className="hover:text-teal-600 transition">Privacy Policy</button>
            <span className="text-slate-300">•</span>
            <button type="button" onClick={() => onOpenLegal('terms')} className="hover:text-teal-600 transition">Terms of Service</button>
          </div>
        </div>

      </div>
    </footer>
  );
}