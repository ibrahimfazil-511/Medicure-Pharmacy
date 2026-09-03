// import React, { useState } from 'react';
// import { X, Pill, AlertTriangle, ShieldCheck, ShoppingBag, Check, FileText, Building2, Info, Star } from 'lucide-react';

// export default function MedicineDetailModal({ medicine, onClose, onAddToCart }) {
//   const [quantity, setQuantity] = useState(1);
//   const [added, setAdded] = useState(false);

//   if (!medicine) return null;

//   const handleAdd = () => {
//     onAddToCart(medicine, quantity);
//     setAdded(true);
//     setTimeout(() => setAdded(false), 1500);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
//       <div className="soft-card w-full max-w-2xl bg-[#f0f4f8] p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative border border-white">
        
//         {/* Close Button */}
//         <button 
//           onClick={onClose}
//           className="absolute top-5 right-5 p-2 rounded-xl soft-btn text-slate-600 hover:text-slate-900"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          
//           {/* Left Column: Image */}
//           <div className="sm:col-span-5 flex flex-col items-center">
//             <div className="w-full h-56 rounded-2xl soft-inset overflow-hidden p-3 bg-white/60 flex items-center justify-center">
//               <img 
//                 src={medicine.imageUrl} 
//                 alt={medicine.name}
//                 className="w-full h-full object-cover rounded-xl"
//               />
//             </div>

//             <div className="w-full mt-4 space-y-2">
//               {medicine.requiresPrescription ? (
//                 <div className="p-3 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-2 soft-inset-sm">
//                   <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
//                   <span>Doctor Prescription (Rx) Required for this medicine</span>
//                 </div>
//               ) : (
//                 <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 soft-inset-sm">
//                   <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
//                   <span>Over-The-Counter (OTC) Safe Medicine</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column: Details */}
//           <div className="sm:col-span-7 space-y-4">
            
//             <div>
//               <div className="flex items-center justify-between">
//                 <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
//                   {medicine.category}
//                 </span>
//                 <span className="flex items-center text-xs font-bold text-amber-600">
//                   <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
//                   {medicine.rating} ({medicine.reviewsCount} reviews)
//                 </span>
//               </div>

//               <h2 className="text-xl font-extrabold text-slate-900 mt-1">
//                 {medicine.name}
//               </h2>

//               <p className="text-xs font-medium text-slate-500 mt-0.5">
//                 Brand: <strong className="text-slate-700">{medicine.brand}</strong> | Mfg: {medicine.manufacturer}
//               </p>
//             </div>

//             {/* Formula Block */}
//             <div className="p-3.5 rounded-2xl soft-inset bg-teal-50/70 border border-teal-200/50 space-y-1">
//               <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1">
//                 <Pill className="w-3.5 h-3.5" /> Chemical Composition & Formula
//               </span>
//               <p className="text-sm font-bold text-slate-800">
//                 {medicine.formula}
//               </p>
//               <p className="text-xs font-medium text-slate-600">
//                 Generic Name: {medicine.genericName} ({medicine.strength})
//               </p>
//             </div>

//             {/* Description */}
//             <div>
//               <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1">
//                 <Info className="w-3.5 h-3.5 text-teal-600" /> Description
//               </h4>
//               <p className="text-xs text-slate-600 leading-relaxed">
//                 {medicine.description}
//               </p>
//             </div>

//             {/* Dosage & Side Effects */}
//             <div className="grid grid-cols-1 gap-2 text-xs">
//               <div className="p-3 rounded-xl bg-slate-200/50 soft-inset-sm">
//                 <strong className="text-slate-800 block mb-0.5">Usage & Dosage Instructions:</strong>
//                 <p className="text-slate-600">{medicine.usageInstructions}</p>
//               </div>

//               {medicine.sideEffects && (
//                 <div className="p-3 rounded-xl bg-slate-200/50 soft-inset-sm">
//                   <strong className="text-slate-800 block mb-0.5">Precautions & Side Effects:</strong>
//                   <p className="text-slate-600">{medicine.sideEffects}</p>
//                 </div>
//               )}
//             </div>

//             {/* Quantity and Price */}
//             <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
//               <div>
//                 <span className="text-xs text-slate-500 font-semibold block">Price ({medicine.unit})</span>
//                 <span className="text-2xl font-black text-slate-900">${(medicine.price * quantity).toFixed(2)}</span>
//               </div>

//               <div className="flex items-center gap-3">
//                 {/* Quantity Controls */}
//                 <div className="flex items-center rounded-xl soft-inset p-1">
//                   <button 
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="w-8 h-8 rounded-lg soft-btn font-bold text-slate-700 flex items-center justify-center"
//                   >
//                     -
//                   </button>
//                   <span className="w-8 text-center text-sm font-bold text-slate-800">{quantity}</span>
//                   <button 
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="w-8 h-8 rounded-lg soft-btn font-bold text-slate-700 flex items-center justify-center"
//                   >
//                     +
//                   </button>
//                 </div>

//                 <button
//                   onClick={handleAdd}
//                   className={`soft-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
//                     added ? 'bg-emerald-600' : ''
//                   }`}
//                 >
//                   {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
//                   <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
//                 </button>
//               </div>
//             </div>

//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { X, Pill, AlertTriangle, ShieldCheck, ShoppingBag, Check, Info, Star, Sparkles } from 'lucide-react';

export default function MedicineDetailModal({ medicine, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!medicine) return null;

  // Check karna ke item medicine hai ya general/personal care item
  const categoryStr = (medicine.category || '').toLowerCase();
  const isMedicine = categoryStr.includes('medicine') || categoryStr.includes('otc') || categoryStr.includes('prescription');

  // Company Name Priority Check (Supabase columns mapping)
  const companyName = medicine.company || medicine.manufacturer || medicine.brand || medicine.supplier || null;

  const handleAdd = () => {
    onAddToCart(medicine, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="soft-card w-full max-w-3xl bg-[#f4f8f8] p-5 max-h-[90vh] overflow-y-auto relative border border-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl soft-btn text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Left Column: Image & Status */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Image */}
            <div className="w-full aspect-square rounded-2xl soft-inset overflow-hidden bg-white/60 flex items-center justify-center p-4">
              <img 
                src={medicine.imageUrl || medicine.image} 
                alt={medicine.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Status Badge */}
            <div className="w-full">
              {isMedicine ? (
                medicine.requiresPrescription ? (
                  <div className="p-3 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-2 soft-inset-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Doctor Prescription Required</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 soft-inset-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>OTC Safe Medicine</span>
                  </div>
                )
              ) : (
                <div className="p-3 rounded-xl bg-teal-100 text-teal-900 text-xs font-bold flex items-center gap-2 soft-inset-sm">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verified Product</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="md:col-span-3 space-y-5">
            
            {/* Header: Category & Rating */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 bg-teal-100/80 px-3 py-1.5 rounded-full soft-badge border border-teal-200/60">
                  {medicine.category || 'General'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-2 rounded-xl soft-inset border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="text-sm font-black text-amber-900">{medicine.rating || '4.8'}</span>
                <span className="text-xs font-semibold text-amber-700">({medicine.reviewsCount || 50} reviews)</span>
              </div>

              <h1 className="text-3xl font-black text-slate-900 leading-tight">
                {medicine.name}
              </h1>

              {companyName && (
                <p className="text-sm font-semibold text-slate-600">
                  By <strong className="text-slate-800">{companyName}</strong>
                </p>
              )}
            </div>

            {/* Formula/Type Section */}
            {isMedicine ? (
              <div className="p-4 rounded-xl soft-inset bg-teal-50/60 border border-teal-200/50 space-y-2">
                <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5" /> Chemical Formula
                </span>
                <p className="text-base font-bold text-slate-800">
                  {medicine.formula || medicine.genericName || 'Standard'}
                </p>
                <p className="text-xs font-medium text-slate-600">
                  {medicine.genericName || 'Standard'} · {medicine.strength || medicine.packSize || 'Tablet'}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl soft-inset bg-teal-50/60 border border-teal-200/50 space-y-2">
                <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Product Specifications
                </span>
                <p className="text-base font-bold text-slate-800">
                  {medicine.formula || medicine.type || 'Personal Care'}
                </p>
                <p className="text-xs font-medium text-slate-600">
                  Size: {medicine.packSize || medicine.size || 'Standard'} · {medicine.volume || ''}
                </p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {medicine.description || 'High quality product designed for everyday care.'}
              </p>
            </div>

            {/* Usage Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-100/60 soft-inset">
                <h5 className="text-xs font-bold text-slate-800 mb-1">
                  {isMedicine ? 'Usage' : 'How to Use'}
                </h5>
                <p className="text-xs text-slate-600">
                  {medicine.usageInstructions || medicine.directions || (isMedicine ? 'As directed by doctor' : 'Use as needed')}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100/60 soft-inset">
                <h5 className="text-xs font-bold text-slate-800 mb-1">
                  {isMedicine ? 'Precautions' : 'Benefits'}
                </h5>
                <p className="text-xs text-slate-600">
                  {medicine.sideEffects || medicine.benefits || (isMedicine ? 'Consult doctor if needed' : 'Safe for daily use')}
                </p>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              <span className="text-xs font-semibold text-slate-500">Price</span>
              
              <div className="flex items-center justify-between gap-4">
                <span className="text-2xl font-bold text-slate-900">
                  PKR {Number((medicine.price || 0) * quantity).toLocaleString()}
                </span>

                <div className="flex items-center gap-2">
                  {/* Quantity Controls */}
                  <div className="flex items-center rounded-lg soft-inset p-0.5 gap-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-md soft-btn font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200/50"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-slate-800">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-md soft-btn font-bold text-slate-700 flex items-center justify-center hover:bg-slate-200/50"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className={`soft-btn-primary px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                      added ? 'bg-emerald-600' : ''
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    <span>{added ? 'Added!' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}