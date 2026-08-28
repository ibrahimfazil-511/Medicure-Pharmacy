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
      <div className="soft-card w-full max-w-2xl bg-[#f0f4f8] p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative border border-white">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl soft-btn text-slate-600 hover:text-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
          
          {/* Left Column: Image */}
          <div className="sm:col-span-5 flex flex-col items-center">
            <div className="w-full h-56 rounded-2xl soft-inset overflow-hidden p-3 bg-white/60 flex items-center justify-center">
              <img 
                src={medicine.imageUrl || medicine.image} 
                alt={medicine.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="w-full mt-4 space-y-2">
              {isMedicine ? (
                medicine.requiresPrescription ? (
                  <div className="p-3 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-2 soft-inset-sm">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Doctor Prescription (Rx) Required for this medicine</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 soft-inset-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Over-The-Counter (OTC) Safe Medicine</span>
                  </div>
                )
              ) : (
                <div className="p-3 rounded-xl bg-teal-100 text-teal-900 text-xs font-bold flex items-center gap-2 soft-inset-sm">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verified Personal Care / General Product</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="sm:col-span-7 space-y-4">
            
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                  {medicine.category || 'General'}
                </span>
                <span className="flex items-center text-xs font-bold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 mr-1" />
                  {medicine.rating || '4.8'} ({medicine.reviewsCount || 50} reviews)
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {medicine.name}
              </h2>

              {/* Company / Brand Display (Sirf tabhi dikhega jab database mein available ho) */}
              {companyName && (
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Company: <strong className="text-slate-700">{companyName}</strong>
                </p>
              )}
            </div>

            {/* Dynamic Formula / Product Type Block */}
            {isMedicine ? (
              <div className="p-3.5 rounded-2xl soft-inset bg-teal-50/70 border border-teal-200/50 space-y-1">
                <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5" /> Chemical Composition & Formula
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {medicine.formula || medicine.genericName}
                </p>
                <p className="text-xs font-medium text-slate-600">
                  Generic Name: {medicine.genericName || 'Standard'} ({medicine.strength || medicine.packSize || 'Tablet'})
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl soft-inset bg-teal-50/70 border border-teal-200/50 space-y-1">
                <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Product Type & Specifications
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {medicine.formula || medicine.type || medicine.itemType || 'Personal Care Item'}
                </p>
                <p className="text-xs font-medium text-slate-600">
                  Size / Volume: {medicine.packSize || medicine.size || medicine.volume || 'Standard Pack'}
                </p>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-teal-600" /> Description
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {medicine.description || 'High quality product designed for everyday care and best results.'}
              </p>
            </div>

            {/* Dosage & Side Effects vs Usage & Benefits */}
            <div className="grid grid-cols-1 gap-2 text-xs">
              {isMedicine ? (
                <>
                  <div className="p-3 rounded-xl bg-slate-200/50 soft-inset-sm">
                    <strong className="text-slate-800 block mb-0.5">Usage & Dosage Instructions:</strong>
                    <p className="text-slate-600">{medicine.usageInstructions || 'Take as directed by doctor.'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-200/50 soft-inset-sm">
                    <strong className="text-slate-800 block mb-0.5">Precautions & Side Effects:</strong>
                    <p className="text-slate-600">{medicine.sideEffects || 'None specified.'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-slate-200/50 soft-inset-sm">
                    <strong className="text-slate-800 block mb-0.5">How to Use:</strong>
                    <p className="text-slate-600">{medicine.usageInstructions || medicine.directions || 'Apply or use as needed for daily routine care.'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-200/50 soft-inset-sm">
                    <strong className="text-slate-800 block mb-0.5">Key Benefits:</strong>
                    <p className="text-slate-600">{medicine.sideEffects || medicine.benefits || 'Safe for daily use, dermatologically tested.'}</p>
                  </div>
                </>
              )}
            </div>

            {/* Quantity and Price */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Price ({medicine.unit || 'Pack'})</span>
                <span className="text-2xl font-black text-slate-900">PKR {Number((medicine.price || 0) * quantity).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center rounded-xl soft-inset p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg soft-btn font-bold text-slate-700 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-slate-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg soft-btn font-bold text-slate-700 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`soft-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    added ? 'bg-emerald-600' : ''
                  }`}
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}