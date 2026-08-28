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
  UserCheck,
  ChevronDown,
  Lock,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Admin Login Modal Component
function AdminLoginModal({ isOpen, onClose }) {
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (accountName === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      setError('');
      onClose();
      navigate('/admin');
    } else {
      setError('Invalid credentials! Please check your username and password.');
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 border border-slate-100 my-auto">
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Admin & Staff Portal</h2>
          <p className="text-xs text-slate-500">Sign in securely to access the admin dashboard.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Account Name</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                required
                name="custom_account_name"
                autoComplete="off"
                placeholder="Enter account name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="password" 
                required
                name="custom_password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-slate-800"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg transition"
          >
            Sign In to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Navbar({
  onOpenPrescription,
  onOpenTrackOrder,
  onOpenContactUs,
  onOpenCart,
  cartCount,
  onCategoryClick
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#f0f4f8]/95 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">

            {/* Logo & Brand Name */}
            <div 
              className="flex items-center space-x-2 cursor-pointer min-w-0 shrink-0" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">

              {/* Admin Portal Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-xl bg-slate-900 text-white text-[11px] sm:text-xs font-bold shadow-sm hover:bg-slate-800 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="hidden sm:inline">Portal</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsAdminLoginOpen(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2 transition"
                    >
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      Admin / Staff Sign In
                    </button>
                  </div>
                )}
              </div>

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
                className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-teal-600 shadow-sm transition-all hover:bg-slate-50"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-slate-800" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
                className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-5 bg-white/95 backdrop-blur-md border-b border-slate-200 space-y-2 shadow-xl animate-in slide-in-from-top-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContactUs();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-3 bg-slate-50 md:hidden"
            >
              <PhoneCall className="w-4 h-4 text-teal-600" />
              Contact Us
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                const element = document.getElementById('shop-categories');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
                if (onCategoryClick) onCategoryClick('All');
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-3 bg-slate-50"
            >
              <Pill className="w-4 h-4 text-teal-600" />
              Shop by Category
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrescription();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-3 bg-slate-50"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              Prescription Upload
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackOrder();
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-3 bg-slate-50"
            >
              <Truck className="w-4 h-4 text-blue-600" />
              Track Order
            </button>
          </div>
        )}
      </header>

      {/* Admin Login Modal Integration */}
      <AdminLoginModal 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)} 
      />
    </>
  );
}