
// import React, { useState, useEffect, useMemo } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar.jsx';
// import CategoryNavSection from './components/CategoryNavSection.jsx';
// import MedicineCard from './components/MedicineCard.jsx';
// import MedicineDetailModal from './components/MedicineDetailModal.jsx';
// import PrescriptionUploadModal from './components/PrescriptionUploadModal.jsx';
// import TrackOrderModal from './components/TrackOrderModal.jsx';
// import ContactUsModal from './components/ContactUsModal.jsx';
// import CartDrawer from './components/CartDrawer.jsx';
// import Footer from './components/Footer.jsx';
// import AdminPanel from './components/AdminPanel.jsx';
// import AdminLoginModal from './components/AdminLoginModal.jsx';
// import CategoryPage from './components/category/CategoryPage.jsx';
// import BrandShowcase from './components/BrandShowcase.jsx';
// import OrderConfirmation from './components/OrderConfirmation.jsx';
// import PromoCarousel from './components/PromoCarousel.jsx';
// import LegalModal from './components/LegalModal.jsx';

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
// function StoreFront({
//   cartItems,
//   onAddToCart,
//   onUpdateQuantity,
//   onRemoveFromCart,
//   onClearCart,
//   totalCartCount,
//   isCartOpen,
//   setIsCartOpen,
//   onOpenPrescription,
//   onOpenAdminPortal
// }) {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dataSource, setDataSource] = useState('Loading...');

//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [visibleLimit, setVisibleLimit] = useState(4);

//   // Modals state
//   const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
//   const [isContactUsOpen, setIsContactUsOpen] = useState(false);
//   const [legalModal, setLegalModal] = useState(null);
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

//   useEffect(() => {
//     setVisibleLimit(4);
//   }, [searchQuery, selectedCategory]);

//   // Foolproof filtering for category and search query
//   const filteredMedicines = useMemo(() => {
//     return medicines.filter((item) => {
//       const itemCat = (item.category || '').toLowerCase().trim();
//       const selectedCat = (selectedCategory || '').toLowerCase().trim();

//       const isAllCategory = 
//         selectedCat === 'all' || 
//         selectedCat === 'all products';

//       const isMedicineCategory = selectedCat === 'medicines' && (
//         itemCat.includes('medicine') ||
//         itemCat.includes('drug') ||
//         itemCat.includes('tablet') ||
//         itemCat.includes('capsule') ||
//         itemCat.includes('syrup')
//       );

//       const categoryMatch = 
//         isAllCategory ||
//         isMedicineCategory ||
//         !itemCat ||
//         itemCat === selectedCat ||
//         itemCat.replace(/s$/, '') === selectedCat.replace(/s$/, '') || 
//         itemCat.includes(selectedCat) ||
//         selectedCat.includes(itemCat);

//       const q = searchQuery.toLowerCase().trim();
//       if (!q) return categoryMatch;
//       const nameMatch = (item.name || '').toLowerCase().includes(q);
//       const formulaMatch = (item.formula || '').toLowerCase().includes(q);
//       const genericMatch = (item.genericName || '').toLowerCase().includes(q);
//       const brandMatch = (item.brand || '').toLowerCase().includes(q);
//       const companyMatch = (item.company || '').toLowerCase().includes(q);
//       const manufacturerMatch = (item.manufacturer || '').toLowerCase().includes(q);

//       return categoryMatch && (nameMatch || formulaMatch || genericMatch || brandMatch || companyMatch || manufacturerMatch);
//     });
//   }, [medicines, searchQuery, selectedCategory]);

//   const visibleMedicines = filteredMedicines.slice(0, visibleLimit);
//   const nextVisibleLimit = visibleLimit === 4 ? 20 : filteredMedicines.length;

//   return (
//     <div className="soft-canvas min-h-screen text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">

//       {/* Top Navigation Bar */}
//       <Navbar
//         onOpenPrescription={onOpenPrescription}
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
//         searchQuery={searchQuery}
//         setSearchQuery={setSearchQuery}
//       />

//       <main className="flex-1">

//         <PromoCarousel
//           onOrderNow={() => {
//             const categorySection = document.getElementById('shop-categories');
//             categorySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//           }}
//         />

//         {/* Soft UI Hero Banner */}
//         <section className="hidden relative pt-8 pb-12 overflow-hidden bg-gradient-to-b from-[#eef8f7] via-white to-[#f4f8f8]">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="soft-card clinic-hero p-4 sm:p-10 border border-white/90 relative overflow-hidden">
//               <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">

//                 <div className="lg:col-span-7 space-y-5">
//                   <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-teal-100/80 text-teal-900 soft-badge">
//                     <Sparkles className="w-4 h-4 text-teal-600 fill-teal-500" />
//                     <span>Your Trusted 24/7 Digital Health Partner</span>
//                   </div>

//                   <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
//                     Order Genuine Medicines & <span className="text-teal-700">Generic Formulas</span> Delivered Fast
//                   </h1>

//                   <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
//                     Search top pharmaceutical brands by medicine name or exact chemical formula. Upload your prescription for instant verification by qualified pharmacists.
//                   </p>

//                   <div className="clinic-stagger grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
//                     <div className="p-3 rounded-2xl soft-inset bg-slate-100/80 text-xs font-bold text-slate-800 flex items-center gap-2">
//                       <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
//                       <span>100% Authentic Medicines</span>
//                     </div>

//                     <div className="p-3 rounded-2xl soft-inset bg-slate-100/80 text-xs font-bold text-slate-800 flex items-center gap-2">
//                       <Truck className="w-5 h-5 text-teal-600 shrink-0" />
//                       <span>Express in 12 Hours Delivery</span>
//                     </div>
//                   </div>

//                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
//                     <button
//                       onClick={() => setIsPrescriptionOpen(true)}
//                       className="soft-btn-primary w-full sm:w-auto justify-center px-6 py-3 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2"
//                     >
//                       <FileText className="w-4 h-4" />
//                       <span>Upload Prescription Now</span>
//                     </button>

//                     <button
//                       onClick={() => setIsTrackOrderOpen(true)}
//                       className="soft-btn w-full sm:w-auto justify-center px-5 py-3 rounded-2xl font-bold text-sm text-slate-800 hover:text-teal-700 flex items-center gap-2"
//                     >
//                       <Truck className="w-4 h-4 text-teal-600" />
//                       <span>Track Active Order</span>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="lg:col-span-5 flex justify-center">
//                   <div className="w-full max-w-md p-6 rounded-2xl soft-card bg-white/90 border border-white space-y-4 shadow-2xl relative">
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
//                       <span className="font-black text-teal-700">Rs 65</span>
//                       </div>
//                       <p className="text-[11px] text-slate-500 font-semibold">Paracetamol 500mg + Caffeine 65mg</p>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Category Navigation Section */}
//         <section id="shop-categories" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
//           <CategoryNavSection
//             selectedCategory={selectedCategory}
//             onSelectCategory={setSelectedCategory}
//           />
//         </section>

        
//         {/* All Products & Medicines Grid Section */}
//         <section id="products-grid" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 clinic-hero">
//           <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6">
//             <h2 className="text-lg sm:text-2xl font-black text-slate-900">
//               All Products & Medicines
//             </h2>
//             <div className="flex items-center gap-3">
//               <span className="text-xs font-bold text-slate-500">
//                 ({filteredMedicines.length} items available)
//               </span>
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-center py-12">
//               <p className="text-slate-500 font-semibold">Loading product catalog...</p>
//             </div>
//           ) : filteredMedicines.length === 0 ? (
//             <div className="text-center py-12 soft-card bg-white/50">
//               <p className="text-slate-600 font-bold">No products found matching your criteria.</p>
//               <button 
//                 onClick={() => { setSelectedCategory(''); setSearchQuery(''); }}
//                 className="mt-3 text-sm text-teal-700 font-extrabold underline"
//               >
//                 Reset Filters & View All
//               </button>
//             </div>
//           ) : (
//             <>
//               <div className="clinic-stagger grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
//                 {visibleMedicines.map((medicine) => (
//                   <MedicineCard
//                     key={medicine.id}
//                     medicine={medicine}
//                     onQuickView={(med) => setSelectedMedicine(med)}
//                     onAddToCart={(med) => onAddToCart(med)}
//                   />
//                 ))}
//               </div>
//               {visibleLimit < filteredMedicines.length && (
//                 <div className="mt-8 flex justify-center">
//                   <button
//                     type="button"
//                     onClick={() => setVisibleLimit(nextVisibleLimit)}
//                     className="soft-btn-primary rounded-2xl px-6 py-3 text-sm font-bold shadow-lg"
//                   >
//                     {visibleLimit === 4 ? 'View More' : 'View All Products'}
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </section>

//         <BrandShowcase />

//       </main> 

//       {/* Promotional Offers Section */}
//       <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
//         <h2 className="text-2xl font-black text-slate-900 mb-6">Special Offers & Discounts</h2>
        
//         <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 clinic-stagger">
//           <div className="relative h-[190px] sm:h-[250px] lg:h-[300px] overflow-hidden rounded-2xl group cursor-pointer shadow-[0_14px_32px_rgba(18,48,71,0.12)]">
//             <img
//               src="https://www.dvago.pk/_next/image?url=https%3A%2F%2Fdvago-assets.s3.ap-southeast-1.amazonaws.com%2FBanners%2FSMall%2520Banner%2520Sunscreen.jpeg&w=1400&q=75"
//               alt="Sunscreen and personal care promotion"
//               className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
//               loading="lazy"
//             />
//           </div>

//           <div className="relative h-[190px] sm:h-[250px] lg:h-[300px] overflow-hidden rounded-2xl group cursor-pointer shadow-[0_14px_32px_rgba(18,48,71,0.12)]">
//             <img
//               src="https://www.dvago.pk/_next/image?url=https%3A%2F%2Fdvago-assets.s3.ap-southeast-1.amazonaws.com%2FBanners%2FSmall%2520Banner%2520Multivitamins%2520.jpeg&w=1400&q=75"
//               alt="Over the counter medicines promotion"
//               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//               loading="lazy"
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-[#087f78]/85 via-[#087f78]/30 to-transparent" />
//             <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5 sm:p-8 text-white max-w-[70%]">
//               <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.18em] text-emerald-100"></span>
//               <h3 className="text-xl sm:text-3xl font-black leading-tight mt-1"></h3>
//               <p className="text-xs sm:text-sm font-semibold text-white/85 mt-2"></p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Modals & Drawers */}
//       <MedicineDetailModal
//         medicine={selectedMedicine}
//         onClose={() => setSelectedMedicine(null)}
//         onAddToCart={(med, qty) => onAddToCart(med, qty)}
//       />

//       <TrackOrderModal
//         isOpen={isTrackOrderOpen}
//         onClose={() => setIsTrackOrderOpen(false)}
//       />

//       <ContactUsModal
//         isOpen={isContactUsOpen}
//         onClose={() => setIsContactUsOpen(false)}
//       />

//       <Footer
//         onOpenPrescription={onOpenPrescription}
//         onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
//         onOpenContactUs={() => setIsContactUsOpen(true)}
//         onOpenAdminPortal={onOpenAdminPortal}
//         onOpenLegal={setLegalModal}
//         onCategoryClick={(cat) => setSelectedCategory(cat)}
//       />

//       <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />

//     </div>
//   );
// }

// // Root App Component with Routing and Global Cart Drawer Configuration
// export default function App() {
//   const [cartItems, setCartItems] = useState([]);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
//   const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
//   const [completedOrder, setCompletedOrder] = useState(null);

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

//   // UNIQUE ITEMS COUNT: Bar bar add karne par count nahi barhega, sirf unique items ki ginti aayegi
//   const totalCartCount = cartItems.length;

//   return (
//     /* YAHAN BASENAME ADD KIYA GAYA HAI */
//     <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
//       <Routes>
//         <Route
//           path="/order-confirmation"
//           element={completedOrder ? (
//             <OrderConfirmation
//               order={completedOrder}
//               onContinueShopping={() => setCompletedOrder(null)}
//             />
//           ) : <Navigate to="/" replace />}
//         />
//         <Route 
//           path="/" 
//           element={
//             <StoreFront 
//               cartItems={cartItems}
//               onAddToCart={handleAddToCart}
//               onUpdateQuantity={handleUpdateQuantity}
//               onRemoveFromCart={handleRemoveFromCart}
//               onClearCart={handleClearCart}
//               totalCartCount={totalCartCount}
//               isCartOpen={isCartOpen}
//               setIsCartOpen={setIsCartOpen}
//               onOpenPrescription={() => setIsPrescriptionOpen(true)}
//               onOpenAdminPortal={() => setIsAdminLoginOpen(true)}
//             />
//           } 
//         />
//         {/* Dynamic Route for Categories */}
//         <Route 
//           path="/category/:categoryId" 
//           element={
//             <CategoryPage
//               onAddToCart={handleAddToCart}
//               onOpenPrescription={() => setIsPrescriptionOpen(true)}
//               onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
//               onOpenContactUs={() => setIsContactUsOpen(true)}
//               onOpenCart={() => setIsCartOpen(true)}
//               cartCount={totalCartCount}
//             />
//           }
//         />
//         <Route
//           path="/admin"
//           element={localStorage.getItem('isAdminLoggedIn') === 'true' ? <AdminPanel /> : <Navigate to="/" replace />}
//         />
//       </Routes>

//       {/* Global Cart Drawer available on Category & Routed Pages */}
//       <CartDrawer
//         isOpen={isCartOpen}
//         onClose={() => setIsCartOpen(false)}
//         cartItems={cartItems}
//         onUpdateQuantity={handleUpdateQuantity}
//         onRemoveItem={handleRemoveFromCart}
//         onClearCart={handleClearCart}
//         onOpenPrescription={() => setIsPrescriptionOpen(true)}
//         onOrderCompleted={(order) => {
//           setCompletedOrder(order);
//           setIsCartOpen(false);
//         }}
//       />

//       <PrescriptionUploadModal
//         isOpen={isPrescriptionOpen}
//         onClose={() => setIsPrescriptionOpen(false)}
//       />

//       <AdminLoginModal
//         isOpen={isAdminLoginOpen}
//         onClose={() => setIsAdminLoginOpen(false)}
//       />
//     </Router>
//   );
// }























import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CategoryNavSection from './components/CategoryNavSection.jsx';
import MedicineCard from './components/MedicineCard.jsx';
import MedicineDetailModal from './components/MedicineDetailModal.jsx';
import PrescriptionUploadModal from './components/PrescriptionUploadModal.jsx';
import TrackOrderModal from './components/TrackOrderModal.jsx';
import ContactUsModal from './components/ContactUsModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Footer from './components/Footer.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import AdminLoginModal from './components/AdminLoginModal.jsx';
import CategoryPage from './components/category/CategoryPage.jsx';
import BrandShowcase from './components/BrandShowcase.jsx';
import OrderConfirmation from './components/OrderConfirmation.jsx';
import PromoCarousel from './components/PromoCarousel.jsx';
import LegalModal from './components/LegalModal.jsx';

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

// Main Storefront Component (Homepage Only Content)
function StoreFront({
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  totalCartCount,
  isCartOpen,
  setIsCartOpen,
  onOpenPrescription,
  onOpenAdminPortal
}) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('Loading...');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [visibleLimit, setVisibleLimit] = useState(4);

  // Modals state
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
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

  useEffect(() => {
    setVisibleLimit(4);
  }, [searchQuery, selectedCategory]);

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
      const companyMatch = (item.company || '').toLowerCase().includes(q);
      const manufacturerMatch = (item.manufacturer || '').toLowerCase().includes(q);

      return categoryMatch && (nameMatch || formulaMatch || genericMatch || brandMatch || companyMatch || manufacturerMatch);
    });
  }, [medicines, searchQuery, selectedCategory]);

  const visibleMedicines = filteredMedicines.slice(0, visibleLimit);
  const nextVisibleLimit = visibleLimit === 4 ? 20 : filteredMedicines.length;

  return (
    <div className="soft-canvas min-h-screen text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white relative">

      {/* Top Navigation Bar */}
      <Navbar
        onOpenPrescription={onOpenPrescription}
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="flex-1">

        <PromoCarousel
          onOrderNow={() => {
            const categorySection = document.getElementById('shop-categories');
            categorySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Category Navigation Section */}
        <section id="shop-categories" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4">
          <CategoryNavSection
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {/* All Products & Medicines Grid Section */}
        <section id="products-grid" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 clinic-hero">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900">
              All Products & Medicines
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">
                ({filteredMedicines.length} items available)
              </span>
            </div>
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
            <>
              <div className="clinic-stagger grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {visibleMedicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onQuickView={(med) => setSelectedMedicine(med)}
                    onAddToCart={(med) => onAddToCart(med)}
                  />
                ))}
              </div>
              {visibleLimit < filteredMedicines.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleLimit(nextVisibleLimit)}
                    className="soft-btn-primary rounded-2xl px-6 py-3 text-sm font-bold shadow-lg"
                  >
                    {visibleLimit === 4 ? 'View More' : 'View All Products'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <BrandShowcase />

      </main>

      {/* FULLY RESPONSIVE BANNERS SECTION (NO CROP) */}
    <section className="max-w-5xl mx-auto w-full px-3 sm:px-6 py-3 sm:py-5">
  <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
    {/* Banner 1 */}
    <div className="w-full bg-slate-100 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src="https://www.dvago.pk/_next/image?url=https%3A%2F%2Fdvago-assets.s3.ap-southeast-1.amazonaws.com%2FBanners%2FSMall%2520Banner%2520Sunscreen.jpeg&w=1400&q=75"
        alt="Sunscreen and personal care promotion"
        className="w-full max-h-36 sm:max-h-48 object-cover block hover:scale-[1.01] transition-transform duration-300"
        loading="lazy"
      />
    </div>

    {/* Banner 2 */}
    <div className="w-full bg-slate-100 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img
        src="https://www.dvago.pk/_next/image?url=https%3A%2F%2Fdvago-assets.s3.ap-southeast-1.amazonaws.com%2FBanners%2FSmall%2520Banner%2520Multivitamins%2520.jpeg&w=1400&q=75"
        alt="Over the counter medicines promotion"
        className="w-full max-h-36 sm:max-h-48 object-cover block hover:scale-[1.01] transition-transform duration-300"
        loading="lazy"
      />
    </div>
  </div>
</section>

      {/* ORIGINAL POSITION HOMEPAGE-ONLY WHATSAPP WIDGET */}
      <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex items-center select-none">
        <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping opacity-75 pointer-events-none" />

        <a
          href="https://wa.me/923342850819"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Pharmacy on WhatsApp"
          className="relative group flex items-center gap-1.5 sm:gap-2.5 bg-white/95 hover:bg-emerald-50/95 backdrop-blur-md border border-emerald-200/80 hover:border-emerald-400/90 text-emerald-950 px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-full shadow-[0_8px_20px_-4px_rgba(16,185,129,0.25)] sm:shadow-[0_10px_25px_-5px_rgba(16,185,129,0.25)] hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.35)] transition-all duration-300 ease-out hover:-translate-x-1" >
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-emerald-500 border border-white sm:border-2"></span>
            </span>
          </div>

          {/* <div className="flex flex-col text-left pr-0.5 sm:pr-1">
            <span className="text-[10px] sm:text-sm font-black text-emerald-900 group-hover:text-emerald-700 transition-colors leading-none sm:leading-tight">
              WhatsApp
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold text-emerald-600/90 leading-none mt-0.5">
              Help Desk
            </span>
          </div> */}
        </a>
      </div>

      {/* ===================================================== */}
      {/* Modals & Drawers                                      */}
      {/* ===================================================== */}

      {/* MedicineDetailModal — navbar handlers wired so all buttons work */}
      <MedicineDetailModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onAddToCart={(med, qty) => onAddToCart(med, qty)}
        // Navbar handlers inside the modal
        onOpenPrescription={onOpenPrescription}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenContactUs={() => setIsContactUsOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCategoryClick={(cat) => setSelectedCategory(cat)}
      />

      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      <ContactUsModal
        isOpen={isContactUsOpen}
        onClose={() => setIsContactUsOpen(false)}
      />

    <Footer
  onOpenPrescription={onOpenPrescription}
  onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
  onOpenContactUs={() => setIsContactUsOpen(true)}
  onOpenAdminPortal={onOpenAdminPortal}
  onOpenLegal={setLegalModal}
  onCategoryClick={(cat) => setSelectedCategory(cat)}
/>
      <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />

    </div>
  );
}

// Root App Component
export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Track order & Contact modals (hoisted so category page & modal can use them)
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);

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

  const totalCartCount = cartItems.length;

  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <Routes>
        <Route
          path="/order-confirmation"
          element={completedOrder ? (
            <OrderConfirmation
              order={completedOrder}
              onContinueShopping={() => setCompletedOrder(null)}
            />
          ) : <Navigate to="/" replace />}
        />
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
              onOpenPrescription={() => setIsPrescriptionOpen(true)}
              onOpenAdminPortal={() => setIsAdminLoginOpen(true)}
            />
          }
        />
        <Route
          path="/category/:categoryId"
          element={
            <CategoryPage
              onAddToCart={handleAddToCart}
              onOpenPrescription={() => setIsPrescriptionOpen(true)}
              onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
              onOpenContactUs={() => setIsContactUsOpen(true)}
              onOpenCart={() => setIsCartOpen(true)}
              cartCount={totalCartCount}
            />
          }
        />
        <Route
          path="/admin"
          element={localStorage.getItem('isAdminLoggedIn') === 'true' ? <AdminPanel /> : <Navigate to="/" replace />}
        />
      </Routes>

      {/* Global Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOpenPrescription={() => setIsPrescriptionOpen(true)}
        onOrderCompleted={(order) => {
          setCompletedOrder(order);
          setIsCartOpen(false);
        }}
      />

      <PrescriptionUploadModal
        isOpen={isPrescriptionOpen}
        onClose={() => setIsPrescriptionOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
      />
    </Router>
  );
}