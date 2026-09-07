import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchMedicines, fetchMedicineByName } from '../../services/supabaseClient';
import MedicineCard from '../MedicineCard';
import MedicineDetailModal from '../MedicineDetailModal';
import SearchBarAndFilters from '../SearchBarAndFilters';
import { Pill } from 'lucide-react';
import Navbar from '../Navbar.jsx';
import { getCategoryData } from '../../data/categoryData.js';

export default function CategoryPage({
  onAddToCart,
  onOpenPrescription,
  onOpenTrackOrder,
  onOpenContactUs,
  onOpenCart,
  cartCount
}) {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const categoryData = getCategoryData(categoryId);
  const selectedBrand = searchParams.get('brand')?.trim() || '';

  const categoryTitles = {
    'all': 'All Products',
    'medicines': 'Medicines',
    'diseases': 'Diseases',
    'personal-care': 'Personal Care',
    'baby-care': 'Baby Care',
    'lifestyle': 'Lifestyle & Fitness',
    'organic': 'Organic',
    'devices': 'Healthcare Devices'
  };

  useEffect(() => {
    const loadMedicines = async () => {
      setLoading(true);
      const result = await fetchMedicines();
      setMedicines(result.data || []);
      setLoading(false);
    };
    loadMedicines();
  }, []);

  const handleQuickView = async (medicine) => {
    setSelectedMedicine(medicine);
    if (!medicine.name) return;

    const result = await fetchMedicineByName(medicine.name);
    if (result.data) {
      setSelectedMedicine(result.data);
    }
  };

  // Add button click handler: Adds item to cart and automatically opens global CartDrawer
  const handleAddAndCheckout = (medicine, qty = 1) => {
    onAddToCart(medicine, qty);
  };

  // Category + Search Query Combined Filtering Logic
  const filteredMedicines = medicines.filter(item => {
    let matchesCategory = true;
    if (categoryId && categoryId !== 'all') {
      const itemCategory = (item.category || '').toLowerCase().trim();
      const currentSlug = categoryId.toLowerCase().trim();

      if (itemCategory) {
        if (currentSlug === 'medicines') {
          matchesCategory = (
            itemCategory === 'tablet' || 
            itemCategory.includes('medicine') || 
            itemCategory.includes('drug') ||
            itemCategory.includes('capsule')
          );
        } else {
          matchesCategory = (
            itemCategory === currentSlug ||
            itemCategory.replace(/\s+/g, '-') === currentSlug ||
            itemCategory.includes(currentSlug) ||
            currentSlug.includes(itemCategory) ||
            itemCategory.replace(/s$/, '') === currentSlug.replace(/s$/, '')
          );
        }
      }
    }

    const q = searchQuery.toLowerCase().trim();
    const brandQuery = selectedBrand.toLowerCase();
    const brandMatch = !brandQuery || [item.brand, item.company, item.manufacturer]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(brandQuery));

    if (!brandMatch) return false;
    if (!q) return matchesCategory;

    const nameMatch = (item.name || '').toLowerCase().includes(q);
    const formulaMatch = (item.formula || '').toLowerCase().includes(q);
    const searchBrandMatch = (item.brand || '').toLowerCase().includes(q);
    const companyMatch = (item.company || '').toLowerCase().includes(q);
    const manufacturerMatch = (item.manufacturer || '').toLowerCase().includes(q);

    return matchesCategory && (nameMatch || formulaMatch || searchBrandMatch || companyMatch || manufacturerMatch);
  });

  return (
    <div className="soft-canvas min-h-screen text-slate-800 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      <Navbar
        onOpenPrescription={onOpenPrescription}
        onOpenTrackOrder={onOpenTrackOrder}
        onOpenContactUs={onOpenContactUs}
        onOpenCart={onOpenCart}
        cartCount={cartCount}
        onCategoryClick={() => {}}
        searchQuery=""
        setSearchQuery={() => {}}
        showBackToHome
        hideSearch
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1 space-y-4">
        {/* Category Header Banner */}
        <div className="soft-card p-5 sm:p-6 bg-gradient-to-r from-teal-50/80 via-[#e6edf5] to-[#f0f4f8] border border-white/90 shadow-lg rounded-2xl">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 capitalize tracking-tight">
            {categoryTitles[categoryId] || 'Category Products'}
          </h1>
        </div>

        <SearchBarAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={categoryId}
          setSelectedCategory={() => {}}
          categories={[]}
          resultsCount={filteredMedicines.length}
        />

        {/* Products Grid or Loading State */}
        {loading ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-12 h-12 rounded-2xl soft-inset flex items-center justify-center mx-auto text-teal-600 animate-spin bg-slate-100">
              <Pill className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-600">Loading products catalog...</p>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <div className="soft-card p-8 text-center max-w-md mx-auto space-y-4 bg-white/90 border border-slate-200 rounded-2xl">
            <Pill className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No products found matching your search</h3>
            <p className="text-xs text-slate-500">Try searching with a different formula name or keyword.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="inline-block soft-btn-primary px-4 py-2 rounded-xl text-xs font-bold text-teal-900 bg-teal-100 hover:bg-teal-200"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onAddToCart={(med) => handleAddAndCheckout(med, 1)}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      <MedicineDetailModal
        medicine={selectedMedicine}
        onClose={() => setSelectedMedicine(null)}
        onAddToCart={(med, qty) => handleAddAndCheckout(med, qty)}
      />

    </div>
  );
}