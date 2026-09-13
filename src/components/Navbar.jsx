
import React, { useState } from 'react';
import logoImg from '../assets/images/medicure_pharmacy_logo_1786426208570.jpg';
import {
  Pill,
  FileText,
  Truck,
  PhoneCall,
  ShoppingBag,
  Menu,
  X,
  ShieldCheck,
  Search,
  ArrowLeft
} from 'lucide-react';

export default function Navbar({
  onOpenPrescription,
  onOpenTrackOrder,
  onOpenContactUs,
  onOpenCart,
  cartCount,
  onCategoryClick,
  searchQuery,
  setSearchQuery,
  showBackToHome = false,
  hideSearch = false
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#d9e6e7] shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">

            {/* Logo & Brand Name (With optional Back Button) */}
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              {showBackToHome && (
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = import.meta.env.BASE_URL || '/';
                  }}
                  aria-label="Back to Home"
                  title="Back to Home"
                  className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-700 transition active:scale-95 shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              <div
                className="flex items-center space-x-2 cursor-pointer min-w-0 shrink-0"
                onClick={() => {
                  if (showBackToHome) {
                    window.location.href = import.meta.env.BASE_URL || '/';
                    return;
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white shadow-sm shadow-teal-500/10 overflow-hidden border border-slate-100 p-0.5 shrink-0">
                  <img src={logoImg} alt="MediCure Pharmacy Logo" className="w-full h-full object-cover rounded-lg" referrerPolicy="no-referrer" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-lg font-black tracking-tight text-slate-900 truncate">
                      Medi<span className="text-teal-600">Cure</span>
                    </span>
                    <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                      <ShieldCheck className="w-2.5 h-2.5 mr-1 text-teal-600" /> Rx
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[11px] font-semibold text-slate-500 tracking-tight truncate leading-none">
                    24/7 Verified Store
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-200/60 p-1 rounded-xl border border-slate-300/40 shadow-inner shrink-0">
              <button
                onClick={() => {
                  const element = document.getElementById('shop-categories');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                  if (onCategoryClick) onCategoryClick('All');
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 rounded-lg transition-all hover:bg-white flex items-center gap-1.5"
              >
                <Pill className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Shop by Category</span>
              </button>

              <button
                onClick={onOpenPrescription}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 rounded-lg transition-all hover:bg-white flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Prescription Upload</span>
              </button>

              <button
                onClick={onOpenTrackOrder}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-teal-700 rounded-lg transition-all hover:bg-white flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Track Order</span>
              </button>
            </nav>

            {/* Product Search and Right Action Buttons */}
            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              {!hideSearch && (
                <>
                  <label className="hidden md:flex w-40 lg:w-60 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-teal-400 focus-within:bg-white transition-colors">
                    <Search className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      type="search"
                      value={searchQuery || ''}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search medicines..."
                      aria-label="Search products"
                      className="w-full bg-transparent text-xs font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    aria-label="Search"
                    className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-600 shadow-sm transition active:scale-95"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Contact Us Button */}
              <button
                onClick={onOpenContactUs}
                className="hidden md:flex px-3 py-1.5 sm:py-2 text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 rounded-xl items-center gap-1.5 hover:bg-teal-100 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Contact Us</span>
              </button>

              {/* Cart Drawer Toggle Button */}
              <button
                onClick={onOpenCart}
                className="relative p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-slate-800" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
                className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm active:scale-95 transition"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Quick Search Bar (When search icon is clicked) */}
        {!hideSearch && mobileSearchOpen && (
          <div className="md:hidden px-3 py-2.5 bg-slate-50 border-t border-slate-200 animate-in slide-in-from-top-1">
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-teal-400 shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-teal-600" />
              <input
                type="search"
                autoFocus
                value={searchQuery || ''}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by brand, medicine or formula..."
                aria-label="Search all products"
                className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </label>
          </div>
        )}

        {/* Mobile Drawer Menu (Cleaned Up) */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-3 pt-3 pb-5 bg-white/98 backdrop-blur-md border-b border-slate-200 space-y-2 shadow-xl animate-in slide-in-from-top-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const element = document.getElementById('shop-categories');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
                if (onCategoryClick) onCategoryClick('All');
              }}
              className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-3 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              <Pill className="w-4 h-4 text-teal-600" />
              <span>Shop by Category</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrescription();
              }}
              className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-3 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Prescription Upload</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackOrder();
              }}
              className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-3 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Track Order Status</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContactUs();
              }}
              className="w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-3 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 transition"
            >
              <PhoneCall className="w-4 h-4 text-teal-600" />
              <span>Contact Us & Helpline</span>
            </button>
          </div>
        )}
      </header>
    </>
  );
}