import React from 'react';
import { ShoppingCart, Star, MoveHorizontal } from 'lucide-react';

export default function MedicineCard({ medicine, onAddToCart, onQuickView }) {
  if (!medicine) return null;

  const discount = Math.max(0, Number(medicine.discount) || 0);
  const price = Number(medicine.price) || 0;
  const originalPrice = Number(medicine.originalPrice) || 0;
  const hasDiscount = discount > 0 || originalPrice > price;

  const ratingValue = Number(medicine.rating) || 0;
  const hasRating = ratingValue > 0;

  // X-Axis Length Property (Length in cm / mm / inches)
  const xLength = medicine.length || medicine.lengthCm || medicine.dimensions?.x || null;

  return (
    <div
      onClick={() => onQuickView && onQuickView(medicine)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative flex h-32 sm:h-40 items-center justify-center bg-white p-2 sm:p-3">
        {hasDiscount && (
          <span className="absolute left-0 top-2 z-20 rounded-r-full bg-emerald-700 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-white shadow-sm">
            {discount > 0 ? `${discount}% Off` : 'Sale'}
          </span>
        )}
        {medicine.isPopular && (
          <span className="absolute right-0 top-2 z-20 rounded-l-full bg-amber-500 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-white">
            Best Seller
          </span>
        )}
        <img
          src={medicine.imageUrl || medicine.image || 'https://via.placeholder.com/300'}
          alt={medicine.name}
          className="relative z-0 h-full w-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400';
          }}
        />

        {/* X-Axis Horizontal Dimension Indicator */}
        {xLength && (
          <div className="absolute bottom-1 left-3 right-3 z-10 flex flex-col items-center">
            <div className="flex w-full items-center justify-between gap-1 text-[9px] font-bold text-slate-500">
              <span className="h-1.5 w-0.5 bg-slate-400"></span>
              <div className="flex-1 border-b border-dashed border-slate-400"></div>
              <span className="flex items-center gap-0.5 rounded bg-slate-800/80 px-1 py-0.2 text-white shadow-sm">
                <MoveHorizontal className="h-2.5 w-2.5" />
                {xLength} {typeof xLength === 'number' ? 'cm' : ''}
              </span>
              <div className="flex-1 border-b border-dashed border-slate-400"></div>
              <span className="h-1.5 w-0.5 bg-slate-400"></span>
            </div>
          </div>
        )}
      </div>

      {/* Product Card Details */}
      <div className="mt-auto rounded-b-2xl bg-slate-100 p-2.5 sm:p-3 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-xs sm:text-sm font-bold leading-tight text-slate-900 line-clamp-2">
              {medicine.name}
            </h3>
            {hasRating && (
              <span className="flex shrink-0 items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-amber-600">
                <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
                {ratingValue.toFixed(1)}
              </span>
            )}
          </div>

          <p className="mt-1 text-[11px] sm:text-xs text-slate-600 line-clamp-1 font-medium">
            {medicine.formula || 'Pharmacy product'}
          </p>
        </div>

        {/* Price and Add to Cart Action */}
        <div className="mt-2 pt-1.5 border-t border-slate-200/70 flex items-center justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
              <span className="text-xs sm:text-sm font-black text-emerald-700 whitespace-nowrap">
                PKR {price.toLocaleString()}
              </span>
              {hasDiscount && originalPrice > price && (
                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 line-through whitespace-nowrap">
                  PKR {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label={`Add ${medicine.name} to cart`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(medicine);
            }}
            className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm hover:bg-teal-700 active:scale-95 transition"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}