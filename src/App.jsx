
// import React, { useState, useEffect, useMemo } from 'react';
// import CategoryNavSection from './components/CategoryNavSection.jsx';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar.jsx';
// import SearchBarAndFilters from './components/SearchBarAndFilters.jsx';
// import MedicineCard from './components/MedicineCard.jsx';
// import MedicineDetailModal from './components/MedicineDetailModal.jsx';
// import PrescriptionUploadModal from './components/PrescriptionUploadModal.jsx';
// import TrackOrderModal from './components/TrackOrderModal.jsx';
// import ContactUsModal from './components/ContactUsModal.jsx';
// import CartDrawer from './components/CartDrawer.jsx';
// import Footer from './components/Footer.jsx';
// import AdminPanel from './components/AdminPanel.jsx';

// import { CATEGORIES } from './data/initialMedicines.js';
// import { fetchMedicines } from './services/supabaseClient.js';
// import {
//   Pill,
//   ShieldCheck,
//   Truck,
//   FileText,
//   Search,
//   Sparkles
// } from 'lucide-react';

// // Main Storefront Component
// function StoreFront() {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dataSource, setDataSource] = useState('Loading...');

//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [cartItems, setCartItems] = useState([]);

//   // Modals state
//   const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
//   const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
//   const [isContactUsOpen, setIsContactUsOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [selectedMedicine, setSelectedMedicine] = useState(null);

//   // Load medicines on mount
//   const loadCatalog = async () => {
//     setLoading(true);
//     const result = await fetchMedicines();
//     setMedicines(result.data || []);
//     setDataSource(result.source || 'Supabase / Client Database');
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadCatalog();
//   }, []);

//   // Filter medicines by search query (name or formula) and category
//   const filteredMedicines = useMemo(() => {
//     return medicines.filter((item) => {
//       const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;

//       const q = searchQuery.toLowerCase().trim();
//       if (!q) return categoryMatch;

//       const nameMatch = item.name.toLowerCase().includes(q);
//       const formulaMatch = (item.formula || '').toLowerCase().includes(q);
//       const genericMatch = (item.genericName || '').toLowerCase().includes(q);
//       const brandMatch = (item.brand || '').toLowerCase().includes(q);

//       return categoryMatch && (nameMatch || formulaMatch || genericMatch || brandMatch);
//     });
//   }, [medicines, searchQuery, selectedCategory]);

//   // Cart operations (Added setIsCartOpen(true) so cart drawer opens automatically when item is added)
//   const handleAddToCart = (medicine, qty = 1) => {
//     setCartItems((prev) => {
//       const existingIndex = prev.findIndex((i) => i.medicine.id === medicine.id);
//       if (existingIndex > -1) {
//         const updated = [...prev];
//         updated[existingIndex].quantity += qty;
//         return updated;
//       }
//       return [...prev, { medicine, quantity: qty }];
//     });
//     setIsCartOpen(true);
//   };

//   const handleUpdateQuantity = (medicineId, newQty) => {
//     if (newQty <= 0) {
//       handleRemoveFromCart(medicineId);
//       return;
//     }
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.medicine.id === medicineId ? { ...item, quantity: newQty } : item
//       )
//     );
//   };

//   const handleRemoveFromCart = (medicineId) => {
//     setCartItems((prev) => prev.filter((item) => item.medicine.id !== medicineId));
//   };

//   const handleClearCart = () => {
//     setCartItems([]);
//   };

//   const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <div className="min-h-screen bg-[#f0f4f8] text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">

//       {/* Top Navigation Bar */}
//       <Navbar
//         onOpenPrescription={() => setIsPrescriptionOpen(true)}
//         onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
//         onOpenContactUs={() => setIsContactUsOpen(true)}
//         onOpenCart={() => setIsCartOpen(true)}
//         cartCount={totalCartCount}
//         supabaseStatus={{ connected: true, source: dataSource }}
//         onOpenSupabaseConfig={() => {
//           const el = document.getElementById('shop-categories');
//           if (el) el.scrollIntoView({ behavior: 'smooth' });
//         }}
//         onCategoryClick={(cat) => setSelectedCategory(cat)}
//       />


    

//       <main className="flex-1">

//         {/* Soft UI Hero Banner */}
//         <section className="relative pt-8 pb-12 overflow-hidden bg-gradient-to-b from-[#f0f4f8] via-[#e6edf5] to-[#f0f4f8]">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="soft-card p-6 sm:p-10 border border-white/90 relative overflow-hidden">

//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

//                 {/* Hero Left Content */}
//                 <div className="lg:col-span-7 space-y-5">

//                   <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-100/80 text-teal-900 soft-badge">
//                     <Sparkles className="w-4 h-4 text-teal-600 fill-teal-500" />
//                     <span>Your Trusted 24/7 Digital Health Partner</span>
//                   </div>

//                   <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
//                     Order Genuine Medicines & <span className="text-teal-700">Generic Formulas</span> Delivered Fast
//                   </h1>

//                   <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
//                     Search top pharmaceutical brands by medicine name or exact chemical formula. Upload your prescription for instant verification by qualified pharmacists.
//                   </p>

//                   {/* Feature Badges - Responsive Fixed */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
//                     <div className="p-3 rounded-2xl soft-inset bg-slate-100/80 text-xs font-bold text-slate-800 flex items-center gap-2">
//                       <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
//                       <span>100% Authentic Medicines</span>
//                     </div>

//                     <div className="p-3 rounded-2xl soft-inset bg-slate-100/80 text-xs font-bold text-slate-800 flex items-center gap-2">
//                       <Truck className="w-5 h-5 text-teal-600 shrink-0" />
//                       <span>Express 45-Min Delivery</span>
//                     </div>
//                   </div>

//                   <div className="p-3 rounded-2xl soft-inset bg-slate-100/80 text-xs font-bold text-slate-800 flex items-center gap-2 w-full">
//                     <FileText className="w-5 h-5 text-blue-600 shrink-0" />
//                     <span>Easy Rx Upload</span>
//                   </div>

//                   {/* CTA Buttons */}
//                   <div className="flex flex-wrap items-center gap-3 pt-3">
//                     <button
//                       onClick={() => setIsPrescriptionOpen(true)}
//                       className="soft-btn-primary px-6 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2"
//                     >
//                       <FileText className="w-4 h-4" />
//                       <span>Upload Prescription Now</span>
//                     </button>

//                     <button
//                       onClick={() => setIsTrackOrderOpen(true)}
//                       className="soft-btn px-5 py-3 rounded-2xl font-bold text-sm text-slate-800 hover:text-teal-700 flex items-center gap-2"
//                     >
//                       <Truck className="w-4 h-4 text-teal-600" />
//                       <span>Track Active Order</span>
//                     </button>
//                   </div>

//                 </div>

//                 {/* Hero Right Visual Card */}
//                 <div className="lg:col-span-5 flex justify-center">
//                   <div className="w-full max-w-md p-6 rounded-3xl soft-card bg-slate-100/90 border border-white space-y-4 shadow-2xl relative">

//                     <div className="flex items-center justify-between">
//                       <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
//                         <Pill className="w-4 h-4 text-teal-600" /> Instant Medicine Finder
//                       </span>
//                       <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
//                     </div>

//                     <div className="p-4 rounded-2xl soft-inset bg-[#e8eef5] space-y-2">
//                       <p className="text-xs font-bold text-slate-700">Search by formula or brand:</p>
//                       <div className="flex items-center gap-2">
//                         <Search className="w-4 h-4 text-teal-600" />
//                         <span className="text-xs font-mono font-bold text-slate-900">"Paracetamol 500mg"</span>
//                       </div>
//                     </div>

//                     <div className="p-3.5 rounded-2xl soft-card bg-white/80 space-y-1.5">
//                       <div className="flex items-center justify-between text-xs">
//                         <span className="font-extrabold text-slate-800">Panadol Extra</span>
//                         <span className="font-black text-teal-700">$4.50</span>
//                       </div>
//                       <p className="text-[11px] text-slate-500 font-semibold">Paracetamol 500mg + Caffeine 65mg</p>
//                       <div className="flex items-center justify-between text-[10px] text-emerald-700 font-bold pt-1">
//                         <span>Available in Stock</span>
//                         <span className="px-2 py-0.5 rounded bg-emerald-100">OTC Safe</span>
//                       </div>
//                     </div>

//                     <div className="text-center pt-1">
//                       <span className="text-[11px] text-slate-500 font-semibold">
//                         Over 2,500+ formulas and brand medicines stocked in database
//                       </span>
//                     </div>

//                   </div>
//                 </div>

//               </div>

//             </div>
//           </div>
//         </section>
         

//           <CategoryNavSection
//         selectedCategory={selectedCategory}
//         onSelectCategory={setSelectedCategory}
//       />


//         {/* Search Bar & Category Filter Pills */}
//         <div id="shop-categories">
//           <SearchBarAndFilters
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             selectedCategory={selectedCategory}
//             setSelectedCategory={setSelectedCategory}
//             categories={CATEGORIES}
//             resultsCount={filteredMedicines.length}
//           />
//         </div>

//         {/* Medicine Product Grid */}
//         <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

//           {loading ? (
//             <div className="text-center py-20 space-y-4">
//               <div className="w-12 h-12 rounded-2xl soft-inset flex items-center justify-center mx-auto text-teal-600 animate-spin">
//                 <Pill className="w-6 h-6" />
//               </div>
//               <p className="text-sm font-bold text-slate-600">Loading medicine catalog...</p>
//             </div>
//           ) : filteredMedicines.length === 0 ? (
//             <div className="soft-card p-12 text-center max-w-lg mx-auto space-y-4">
//               <Pill className="w-12 h-12 text-slate-400 mx-auto" />
//               <h3 className="text-lg font-bold text-slate-800">No medicines found matching "{searchQuery}"</h3>
//               <p className="text-xs text-slate-500">
//                 Try searching by chemical formula name (e.g. Paracetamol, Omeprazole, Ibuprofen, Amoxicillin) or switch category filters.
//               </p>
//               <button
//                 onClick={() => {
//                   setSearchQuery('');
//                   setSelectedCategory('All');
//                 }}
//                 className="soft-btn-primary px-4 py-2 rounded-xl text-xs font-bold"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {filteredMedicines.map((medicine) => (
//                 <MedicineCard
//                   key={medicine.id}
//                   medicine={medicine}
//                   onAddToCart={(med) => handleAddToCart(med, 1)}
//                   onQuickView={(med) => setSelectedMedicine(med)}
//                 />
//               ))}
//             </div>
//           )}

//         </section>

//       </main>

//       {/* Modals & Drawers */}
//       <MedicineDetailModal
//         medicine={selectedMedicine}
//         onClose={() => setSelectedMedicine(null)}
//         onAddToCart={(med, qty) => handleAddToCart(med, qty)}
//       />

//       <PrescriptionUploadModal
//         isOpen={isPrescriptionOpen}
//         onClose={() => setIsPrescriptionOpen(false)}
//         onPrescriptionUploaded={(rx) => {
//           console.log('Prescription logged:', rx);
//         }}
//       />

//       <TrackOrderModal
//         isOpen={isTrackOrderOpen}
//         onClose={() => setIsTrackOrderOpen(false)}
//       />

//       <ContactUsModal
//         isOpen={isContactUsOpen}
//         onClose={() => setIsContactUsOpen(false)}
//       />

//       <CartDrawer
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         cartItems={cartItems}
//         onUpdateQuantity={handleUpdateQuantity}
//         onRemoveItem={handleRemoveFromCart}
//         onClearCart={handleClearCart}
//         onOpenPrescription={() => setIsPrescriptionOpen(true)}
//       />

//       {/* Soft UI Footer */}
//       <Footer
//         onOpenPrescription={() => setIsPrescriptionOpen(true)}
//         onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
//         onOpenContactUs={() => setIsContactUsOpen(true)}
//         onCategoryClick={(cat) => setSelectedCategory(cat)}
//       />

//     </div>
//   );
// }

// // Root App Component with Routing
// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<StoreFront />} />
//         <Route path="/admin" element={<AdminPanel />} />
//       </Routes>
//     </Router>
//   );
// }
import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CategoryNavSection from './components/CategoryNavSection.jsx';
import SearchBarAndFilters from './components/SearchBarAndFilters.jsx';
import MedicineCard from './components/MedicineCard.jsx';
import MedicineDetailModal from './components/MedicineDetailModal.jsx';
import PrescriptionUploadModal from './components/PrescriptionUploadModal.jsx';
import TrackOrderModal from './components/TrackOrderModal.jsx';
import ContactUsModal from './components/ContactUsModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Footer from './components/Footer.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import CategoryPage from './components/category/CategoryPage.jsx';

import { CATEGORIES } from './data/initialMedicines.js';
import { fetchMedicines } from './services/supabaseClient.js';
import {
  Pill,
  ShieldCheck,
  Truck,
  FileText,
  Search,
  Sparkles
} from 'lucide-react';

// Main Storefront Component
function StoreFront({
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  totalCartCount,
  isCartOpen,
  setIsCartOpen
}) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('Loading...');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals state
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Load medicines on mount
  const loadCatalog = async () => {
    setLoading(true);
    const result = await fetchMedicines();
    setMedicines(result.data || []);
    setDataSource(result.source || 'Supabase / Client Database');
    setLoading(false);
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  // Foolproof filtering for category and search query
  const filteredMedicines = useMemo(() => {
    return medicines.filter((item) => {
      const itemCat = (item.category || '').toLowerCase().trim();
      const selectedCat = (selectedCategory || '').toLowerCase().trim();

      const isAllCategory = 
        selectedCat === 'all' || 
        selectedCat === 'all products';

      const isMedicineCategory = selectedCat === 'medicines' && (
        itemCat.includes('medicine') ||
        itemCat.includes('drug') ||
        itemCat.includes('tablet') ||
        itemCat.includes('capsule') ||
        itemCat.includes('syrup')
      );

      const categoryMatch = 
        isAllCategory ||
        isMedicineCategory ||
        !itemCat ||
        itemCat === selectedCat ||
        itemCat.replace(/s$/, '') === selectedCat.replace(/s$/, '') || 
        itemCat.includes(selectedCat) ||
        selectedCat.includes(itemCat);

      const q = searchQuery.toLowerCase().trim();
      if (!q) return categoryMatch;

      const nameMatch = (item.name || '').toLowerCase().includes(q);
      const formulaMatch = (item.formula || '').toLowerCase().includes(q);
      const genericMatch = (item.genericName || '').toLowerCase().includes(q);
      const brandMatch = (item.brand || '').toLowerCase().includes(q);

      return categoryMatch && (nameMatch || formulaMatch || genericMatch || brandMatch);
    });
  }, [medicines, searchQuery, selectedCategory]);

  return (
    <div className="soft-canvas min-h-screen text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">

      {/* Top Navigation Bar */}
      <Navbar
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenContactUs={() => setIsContactUsOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        supabaseStatus={{ connected: true, source: dataSource }}
        onOpenSupabaseConfig={() => {
          const el = document.getElementById('shop-categories');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onCategoryClick={(cat) => setSelectedCategory(cat)}
      />

      <main className="flex-1">

        {/* Soft UI Hero Banner */}
        <section className="relative pt-8 pb-12 overflow-hidden bg-gradient-to-b from-[#eef8f7] via-white to-[#f4f8f8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="soft-card clinic-hero p-4 sm:p-10 border border-white/90 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">

                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-100/80 text-teal-900 soft-badge">
                    <Sparkles className="w-4 h-4 text-teal-600 fill-teal-500" />
                    <span>Your Trusted 24/7 Digital Health Partner</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                    Order Genuine Medicines & <span className="text-teal-700">Generic Formulas</span> Delivered Fast
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                    Search top pharmaceutical brands by medicine name or exact chemical formula. Upload your prescription for instant verification by qualified pharmacists.
                  </p>

                  <div className="clinic-stagger grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-2xl soft-inset bg-slate-100/80 text-xs font-bold text-slate-800 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>100% Authentic Medicines</span>
                    </div>

                    <div className="p-3 rounded-2xl soft-inset bg-slate-100/80 text-xs font-bold text-slate-800 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-teal-600 shrink-0" />
                      <span>Express in 12 Hours Delivery</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
                    <button
                      onClick={() => setIsPrescriptionOpen(true)}
                      className="soft-btn-primary w-full sm:w-auto justify-center px-6 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Upload Prescription Now</span>
                    </button>

                    <button
                      onClick={() => setIsTrackOrderOpen(true)}
                      className="soft-btn w-full sm:w-auto justify-center px-5 py-3 rounded-2xl font-bold text-sm text-slate-800 hover:text-teal-700 flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4 text-teal-600" />
                      <span>Track Active Order</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-md p-6 rounded-2xl soft-card bg-white/90 border border-white space-y-4 shadow-2xl relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Pill className="w-4 h-4 text-teal-600" /> Instant Medicine Finder
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>

                    <div className="p-4 rounded-2xl soft-inset bg-[#e8eef5] space-y-2">
                      <p className="text-xs font-bold text-slate-700">Search by formula or brand:</p>
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-teal-600" />
                        <span className="text-xs font-mono font-bold text-slate-900">"Paracetamol 500mg"</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl soft-card bg-white/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-slate-800">Panadol Extra</span>
                      <span className="font-black text-teal-700">Rs 65</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold">Paracetamol 500mg + Caffeine 65mg</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Category Navigation Section */}
        <section id="shop-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <CategoryNavSection
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {/* All Products & Medicines Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 clinic-hero">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {selectedCategory ? `Showing: ${selectedCategory}` : 'All Products & Medicines'}
            </h2>
            <span className="text-xs font-bold text-slate-500">
              ({filteredMedicines.length} items available)
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500 font-semibold">Loading product catalog...</p>
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="text-center py-12 soft-card bg-white/50">
              <p className="text-slate-600 font-bold">No products found matching your criteria.</p>
              <button 
                onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
                className="mt-3 text-sm text-teal-700 font-extrabold underline"
              >
                Reset Filters & View All
              </button>
            </div>
          ) : (
            <div className="clinic-stagger grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMedicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onQuickView={(med) => setSelectedMedicine(med)}
                  onAddToCart={(med) => onAddToCart(med)}
                />
              ))}
            </div>
          )}
        </section>

      </main> 

      {/* Promotional Offers Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Special Offers & Discounts</h2>
        
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 clinic-stagger">
          <div className="relative h-[190px] sm:h-[250px] lg:h-[300px] overflow-hidden rounded-2xl group cursor-pointer shadow-[0_14px_32px_rgba(18,48,71,0.12)]">
            <img
              src="https://www.dvago.pk/_next/image?url=https%3A%2F%2Fdvago-assets.s3.ap-southeast-1.amazonaws.com%2FBanners%2FSMall%2520Banner%2520Sunscreen.jpeg&w=1400&q=75"
              alt="Sunscreen and personal care promotion"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
          </div>

          <div className="relative h-[190px] sm:h-[250px] lg:h-[300px] overflow-hidden rounded-2xl group cursor-pointer shadow-[0_14px_32px_rgba(18,48,71,0.12)]">
            <img
              src="https://www.dvago.pk/_next/image?url=https%3A%2F%2Fdvago-assets.s3.ap-southeast-1.amazonaws.com%2FBanners%2FSmall%2520Banner%2520Multivitamins%2520.jpeg&w=1400&q=75"
              alt="Over the counter medicines promotion"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#087f78]/85 via-[#087f78]/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5 sm:p-8 text-white max-w-[70%]">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-emerald-100"></span>
              <h3 className="text-xl sm:text-3xl font-black leading-tight mt-1"></h3>
              <p className="text-xs sm:text-sm font-semibold text-white/85 mt-2"></p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals & Drawers */}
      <MedicineDetailModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onAddToCart={(med, qty) => onAddToCart(med, qty)}
      />

      <PrescriptionUploadModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
        onPrescriptionUploaded={(rx) => {
          console.log('Prescription logged:', rx);
        }}
      />

      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      <ContactUsModal
        isOpen={isContactUsOpen}
        onClose={() => setIsContactUsOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveFromCart}
        onClearCart={onClearCart}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      <Footer
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenContactUs={() => setIsContactUsOpen(true)}
        onCategoryClick={(cat) => setSelectedCategory(cat)}
      />

    </div>
  );
}

// Root App Component with Routing and Global Cart Drawer Configuration
export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

  const handleAddToCart = (medicine, qty = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.medicine.id === medicine.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { medicine, quantity: qty }];
    });
    setIsCartOpen(true); 
  };

  const handleUpdateQuantity = (medicineId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(medicineId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (medicineId) => {
    setCartItems((prev) => prev.filter((item) => item.medicine.id !== medicineId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // UNIQUE ITEMS COUNT: Bar bar add karne par count nahi barhega, sirf unique items ki ginti aayegi
  const totalCartCount = cartItems.length;

  return (
    /* YAHAN BASENAME ADD KIYA GAYA HAI */
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <Routes>
        <Route 
          path="/" 
          element={
            <StoreFront 
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
              onClearCart={handleClearCart}
              totalCartCount={totalCartCount}
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
            />
          } 
        />
        {/* Dynamic Route for Categories */}
        <Route 
          path="/category/:categoryId" 
          element={<CategoryPage onAddToCart={handleAddToCart} />} 
        />
        <Route
          path="/admin"
          element={localStorage.getItem('isAdminLoggedIn') === 'true' ? <AdminPanel /> : <Navigate to="/" replace />}
        />
      </Routes>

      {/* Global Cart Drawer available on Category & Routed Pages */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
      />

      <PrescriptionUploadModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
      />
    </Router>
  );
}