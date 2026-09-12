import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

export default function MedicineCard({ medicine, onAddToCart, onQuickView }) {
  if (!medicine) return null;

  const discount = Math.max(0, Number(medicine.discount) || 0);
  const price = Number(medicine.price) || 0;
  const originalPrice = Number(medicine.originalPrice) || 0;
  const hasDiscount = discount > 0 || originalPrice > price;

  const ratingValue = Number(medicine.rating) || 0;
  const hasRating = ratingValue > 0;

  return (
    <div
      onClick={() => onQuickView && onQuickView(medicine)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative flex h-36 sm:h-44 md:h-48 items-center justify-center bg-white p-2.5 sm:p-4">
        {hasDiscount && (
          <span className="absolute left-0 top-2.5 z-20 rounded-r-full bg-emerald-700 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-black text-white shadow-sm">
            {discount > 0 ? `${discount}% Off` : 'Sale'}
          </span>
        )}
        {medicine.isPopular && (
          <span className="absolute right-0 top-2.5 z-20 rounded-l-full bg-amber-500 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-black text-white">
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
      </div>

      {/* Product Card Details */}
      <div className="mt-auto rounded-b-2xl bg-slate-100 p-2.5 sm:p-3.5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-xs sm:text-sm md:text-base font-bold leading-tight text-slate-900 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
              {medicine.name}
            </h3>
            {hasRating && (
              <span className="flex shrink-0 items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-amber-600">
                <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
                {ratingValue.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Price and Add to Cart Action */}
        <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
              <span className="text-xs sm:text-base font-black text-emerald-700 whitespace-nowrap">
                PKR {price.toLocaleString()}
              </span>
              {hasDiscount && originalPrice > price && (
                <span className="text-[9px] sm:text-xs font-semibold text-slate-400 line-through whitespace-nowrap">
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
            className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm hover:bg-teal-700 active:scale-95 transition"
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}