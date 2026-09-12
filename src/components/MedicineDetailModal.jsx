import React, { useState } from 'react';
import { X, Pill, AlertTriangle, ShieldCheck, ShoppingBag, Check, Star } from 'lucide-react';

export default function MedicineDetailModal({ medicine, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!medicine) return null;

  const categoryStr = (medicine.category || '').toLowerCase();
  const isMedicine = categoryStr.includes('medicine') || categoryStr.includes('otc') || categoryStr.includes('prescription');
  const companyName = medicine.company || medicine.manufacturer || medicine.brand || medicine.supplier || null;

  const handleAdd = () => {
    onAddToCart(medicine, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 p-0 sm:p-4 md:p-6 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="medicine-modal-scroll relative flex max-h-[90dvh] sm:max-h-[88vh] w-full max-w-4xl flex-col overflow-y-auto rounded-t-3xl sm:rounded-[1.75rem] border border-white/80 bg-white shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close product details"
          className="absolute right-3 top-3 z-30 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-600 shadow-md transition-all hover:bg-teal-50 hover:text-teal-700 sm:right-5 sm:top-5"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.1fr)]">
          
          {/* Left Column: Image & Status */}
          <div className="flex flex-col gap-3 sm:gap-4 bg-[#eff9f7] p-4 sm:p-6 md:p-8">
            <div className="relative flex aspect-[4/3] sm:aspect-square w-full items-center justify-center rounded-2xl border border-teal-100 bg-white p-6 pt-10 shadow-sm sm:p-8 sm:pt-10">
              <span className="absolute left-3 top-3 z-10 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 ring-1 ring-inset ring-teal-200">
                Product view
              </span>
              <img 
                src={medicine.imageUrl || medicine.image} 
                alt={medicine.name}
                className="h-full w-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Status Badge */}
            {(isMedicine && medicine.requiresPrescription) || !isMedicine ? (
              <div className="w-full rounded-xl border border-teal-100 bg-white/85 p-2.5 sm:p-3 shadow-sm">
                {isMedicine && medicine.requiresPrescription ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>Doctor Prescription Required</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />
                    <span>Verified Authentic Medicine</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Right Column: Details & Order Controls */}
          <div className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 md:p-8">
            
            {/* Header: Category & Rating */}
            <div className="space-y-2 pr-8 sm:pr-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-teal-700 ring-1 ring-inset ring-teal-200">
                  {medicine.category || 'General'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-amber-800 ring-1 ring-inset ring-amber-200">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {medicine.rating || '4.8'} <span className="font-medium text-amber-600">({medicine.reviewsCount || 50})</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tight text-slate-950">
                {medicine.name}
              </h1>

              {companyName && (
                <p className="text-xs sm:text-sm text-slate-500">
                  Manufactured by <strong className="font-bold text-slate-800">{companyName}</strong>
                </p>
              )}
            </div>

            {/* Medicine-specific details */}
            {isMedicine && (
              <div className="rounded-xl sm:rounded-2xl border border-teal-100 bg-teal-50/70 p-3 sm:p-4">
                <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-teal-800">
                  <Pill className="h-3.5 w-3.5 text-teal-600" /> Chemical Composition & Formula
                </span>
                <p className="mt-1.5 text-sm sm:text-base font-black text-slate-900">
                  {medicine.formula || medicine.genericName || 'Standard'}
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-600">
                  {medicine.genericName || 'Standard'} · {medicine.strength || medicine.packSize || 'Tablet'}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="border-l-2 border-teal-300 pl-3 sm:pl-4">
              <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-teal-700">About this product</h4>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-600">
                {medicine.description || 'High quality pharmaceutical medicine stored in temperature-controlled facilities.'}
              </p>
            </div>

            {/* Usage & Precautions (if medicine) */}
            {isMedicine && (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5">
                  <h5 className="text-[11px] font-black uppercase tracking-wide text-slate-800">Usage Instructions</h5>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {medicine.usageInstructions || medicine.directions || 'As directed by physician.'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5">
                  <h5 className="text-[11px] font-black uppercase tracking-wide text-slate-800">Precautions</h5>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {medicine.sideEffects || 'Keep out of reach of children. Consult pharmacist.'}
                  </p>
                </div>
              </div>
            )}

            {/* Sticky Action Footer Bar */}
            <div className="mt-auto sticky bottom-0 z-20 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 rounded-2xl bg-[#06645f] p-3 sm:p-4 text-white shadow-xl shadow-teal-950/20">
              <div className="shrink-0 min-w-0">
                <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-teal-200">Total Price</span>
                <span className="text-sm sm:text-lg md:text-xl font-black tracking-tight whitespace-nowrap block">
                  PKR {Number((medicine.price || 0) * quantity).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
                {/* Quantity Controls */}
                <div className="flex items-center gap-0.5 rounded-xl bg-white/15 p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-sm sm:text-base font-bold text-white hover:bg-white/20 active:scale-95 transition"
                  >
                    −
                  </button>
                  <span className="w-6 sm:w-7 text-center text-xs sm:text-sm font-bold text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-sm sm:text-base font-bold text-white hover:bg-white/20 active:scale-95 transition"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAdd}
                  className={`flex items-center gap-1 rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold shadow-md transition-all active:scale-95 shrink-0 ${
                    added ? 'bg-emerald-500 text-white' : 'bg-white text-teal-900 hover:bg-teal-50'
                  }`}
                >
                  {added ? <Check className="h-3.5 w-3.5 shrink-0" /> : <ShoppingBag className="h-3.5 w-3.5 shrink-0" />}
                  <span className="whitespace-nowrap">{added ? 'Added!' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}