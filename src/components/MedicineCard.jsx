// import React from 'react';
// import { Plus, Star, ShieldCheck } from 'lucide-react';

// export default function MedicineCard({ medicine, onAddToCart, onQuickView }) {
//   if (!medicine) return null;

//   return (
//     <div
//       onClick={() => onQuickView && onQuickView(medicine)}
//       className="soft-card p-4 sm:p-5 flex flex-col justify-between bg-white/90 border border-white relative group transition-all hover:shadow-lg cursor-pointer"
//     >
      
//       {/* Top Section: Badge & Image */}
//       <div>
//         {/* OTC / Prescription Badge */}
//         <div className="flex items-center justify-between mb-3">
//           <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 soft-badge border border-teal-100">
//             <ShieldCheck className="w-3 h-3 text-teal-600" />
//             <span>{medicine.category || 'OTC Medicine'}</span>
//           </span>

//           {medicine.rating && (
//             <div className="flex items-center gap-1 text-xs font-black text-amber-500">
//               <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
//               <span>{medicine.rating}</span>
//             </div>
//           )}
//         </div>

//         {/* Medicine Image Container - Enhanced for Sharp Pixels */}
//         <div 
//           className="w-full h-44 rounded-2xl soft-inset bg-[#f4f7fb] flex items-center justify-center p-4 mb-4 cursor-pointer overflow-hidden relative"
//         >
//           <img 
//             src={medicine.imageUrl || medicine.image || 'https://via.placeholder.com/300'} 
//             alt={medicine.name}
//             className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast] drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
//             loading="lazy"
//             onError={(e) => {
//               e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400';
//             }}
//           />
//         </div>

//         {/* Manufacturer / Brand */}
//         <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
//           {medicine.brand || medicine.manufacturer || 'MediCure Health'}
//         </p>

//         {/* Medicine Name */}
//         <h3 
//           className="text-base font-black text-slate-900 leading-snug mb-2 cursor-pointer hover:text-teal-700 transition-colors line-clamp-1"
//         >
//           {medicine.name}
//         </h3>

//         {/* Formula Box */}
//         <div className="p-2.5 rounded-xl soft-inset bg-slate-50 mb-3 space-y-1">
//           <div className="flex items-center justify-between text-xs">
//             <span className="font-bold text-slate-500 text-[11px]">Formula:</span>
//             <span className="font-extrabold text-slate-800 text-[11px] truncate max-w-[140px]">
//               {medicine.formula || medicine.genericName || 'Standard Formula'}
//             </span>
//           </div>
//           <div className="flex items-center justify-between text-xs">
//             <span className="font-bold text-slate-500 text-[11px]">Pack:</span>
//             <span className="font-extrabold text-slate-700 text-[10px] px-2 py-0.5 rounded bg-slate-200/60">
//               {medicine.packSize || medicine.pack || 'Tablet'}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section: Price & Add Button */}
//       <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
//         <div>
//           <span className="text-xs font-bold text-slate-400 block">Price</span>
//           <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
//             Rs {Number(medicine.price || 0).toLocaleString()}
//           </span>
//           <span className="text-[10px] font-extrabold text-emerald-600 block">
//             {medicine.stock > 0 ? `In Stock (${medicine.stock})` : 'Out of Stock'}
//           </span>
//         </div>

//         <button
//           onClick={(e) => {
//             e.stopPropagation(); // Prevent card click from triggering detail modal
//             if (onAddToCart) {
//               onAddToCart(medicine); // This will add to cart AND open CartDrawer
//             }
//           }}
//           className="soft-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
//         >
//           <Plus className="w-4 h-4" />
//           <span>Add</span>
//         </button>
//       </div>

//     </div>
//   );
// }



















import React from 'react';
import { Plus, Star, ShieldCheck } from 'lucide-react';

export default function MedicineCard({ medicine, onAddToCart, onQuickView }) {
  if (!medicine) return null;

  // Check karna ke item medicine hai ya general/personal care item
  const categoryStr = (medicine.category || '').toLowerCase();
  const isMedicine = categoryStr.includes('medicine') || categoryStr.includes('otc') || categoryStr.includes('prescription');

  return (
    <div
      onClick={() => onQuickView && onQuickView(medicine)}
      className="soft-card soft-card-hover p-4 sm:p-5 flex flex-col justify-between bg-white/95 relative group cursor-pointer"
    >
      
      {/* Top Section: Badge & Image */}
      <div>
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 soft-badge border border-teal-100">
            <ShieldCheck className="w-3 h-3 text-teal-600" />
            <span>{medicine.category || 'General Item'}</span>
          </span>

          {medicine.rating && (
            <div className="flex items-center gap-1 text-xs font-black text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{medicine.rating}</span>
            </div>
          )}
        </div>

        {/* Image Container */}
        <div 
          className="w-full h-44 rounded-xl soft-inset bg-[#f3f9f8] flex items-center justify-center p-4 mb-4 overflow-hidden relative"
        >
          <img 
            src={medicine.imageUrl || medicine.image || 'https://via.placeholder.com/300'} 
            alt={medicine.name}
            className="w-full h-full object-contain [image-rendering:-webkit-optimize-contrast] drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400';
            }}
          />
        </div>

        {/* Manufacturer / Brand */}
        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
          {medicine.company || medicine.manufacturer || 'MediCure Health'}
        </p>

        {/* Item Name */}
        <h3 
          className="text-base font-black text-slate-900 leading-snug mb-2 transition-colors line-clamp-1"
        >
          {medicine.name}
        </h3>

        {/* Dynamic Details Box (Medicine vs Personal Care) */}
        <div className="p-2.5 rounded-xl soft-inset bg-slate-50 mb-3 space-y-1">
          {isMedicine ? (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 text-[11px]">Formula:</span>
                <span className="font-extrabold text-slate-800 text-[11px] truncate max-w-[140px]">
                  {medicine.formula || medicine.genericName || 'Standard Formula'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 text-[11px]">Pack:</span>
                <span className="font-extrabold text-slate-700 text-[10px] px-2 py-0.5 rounded bg-slate-200/60">
                  {medicine.packSize || medicine.pack || 'Tablet'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 text-[11px]">Type:</span>
                <span className="font-extrabold text-slate-800 text-[11px] truncate max-w-[140px]">
                  {medicine.formula || medicine.type || medicine.itemType || 'Personal Care'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 text-[11px]">Size/Volume:</span>
                <span className="font-extrabold text-slate-700 text-[10px] px-2 py-0.5 rounded bg-slate-200/60">
                  {medicine.packSize || medicine.size || medicine.volume || 'Standard'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Section: Price & Add Button */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div>
          <span className="text-xs font-bold text-slate-400 block">Price</span>
          <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            PKR {Number(medicine.price || 0).toLocaleString()}
          </span>
          <span className="text-[10px] font-extrabold text-emerald-600 block">
            {medicine.stock > 0 ? `In Stock (${medicine.stock})` : 'Out of Stock'}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation(); // Card click event ko rokne ke liye taake double trigger na ho
            if (onAddToCart) {
              onAddToCart(medicine);
            }
          }}
          className="soft-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

    </div>
  );
}