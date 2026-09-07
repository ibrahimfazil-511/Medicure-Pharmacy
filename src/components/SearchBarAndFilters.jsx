
import React from 'react';
import { Search, X, Zap, Sparkles } from 'lucide-react';
import { getCategoryData } from '../data/categoryData.js';

export default function SearchBarAndFilters({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  resultsCount 
}) { 

  // Category ke mutabiq search placeholder aur subcategory data
  const getCategoryConfig = (category) => {
    const categoryData = getCategoryData(category);
    const subcategoryTags = categoryData?.subcategories?.map((subcategory) => ({
      label: subcategory,
      query: subcategory
    }));

    switch (category) {
      case 'personal-care':
        return {
          placeholder: "Search personal care, razor, facial cream, skincare items...",
          tagTitle: "Shop by Personal Care:",
          icon: Sparkles,
          tags: subcategoryTags
        };

      case 'baby-care':
        return {
          placeholder: "Search baby diapers, formula milk, baby lotion, wipes...",
          tagTitle: "Shop by Baby Care:",
          icon: Sparkles,
          tags: subcategoryTags
        };

      case 'lifestyle-&-fitness':
      case 'lifestyle':
        return {
          placeholder: "Search protein, supplements, gym accessories, fitness items...",
          tagTitle: "Shop by Lifestyle & Fitness:",
          icon: Sparkles,
          tags: subcategoryTags
        };

      case 'organic':
        return {
          placeholder: "Search organic honey, herbal teas, natural oils, seeds...",
          tagTitle: "Shop by Organic:",
          icon: Sparkles,
          tags: subcategoryTags
        };

      case 'healthcare-devices':
      case 'devices':
        return {
          placeholder: "Search bp monitor, thermometer, glucometer, nebulizer...",
          tagTitle: "Shop by Healthcare Devices:",
          icon: Sparkles,
          tags: subcategoryTags
        };

      default: // Medicines & Default
        return {
          placeholder: "Search medicine name, formula, or active ingredient (e.g. Paracetamol, Omeprazole, Risek)...",
          tagTitle: categoryData ? `Shop by ${categoryData.name}:` : "Popular Formulas:",
          icon: Zap,
          tags: subcategoryTags || [
            { label: 'Paracetamol', query: 'Paracetamol' },
            { label: 'Omeprazole', query: 'Omeprazole' },
            { label: 'Ibuprofen', query: 'Ibuprofen' },
            { label: 'Amoxicillin', query: 'Amoxicillin' },
            { label: 'Cetirizine', query: 'Cetirizine' },
            { label: 'Metformin', query: 'Metformin' },
            { label: 'Multivitamins', query: 'Vitamins' }
          ]
        };
    }
  };

  const currentConfig = getCategoryConfig(selectedCategory);
  const TagIcon = currentConfig.icon;

  return (
    <div id="shop-categories" className="space-y-3 clinic-hero">
      
      {/* Soft UI Search Bar */}
      <div className="soft-card p-3 sm:p-4 border border-white/90 relative rounded-2xl">
        <div className="relative flex items-center min-w-0">
          
          <div className="absolute left-4 pointer-events-none text-teal-600">
            <Search className="w-6 h-6" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentConfig.placeholder}
            className="w-full min-w-0 pl-11 pr-12 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-800 placeholder-slate-400 bg-[#e8eef5] rounded-xl soft-inset focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 p-1.5 rounded-full bg-slate-300 text-slate-700 hover:bg-slate-400 transition-all"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dynamic Quick Tags based on Category */}
        <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-extrabold text-slate-500 flex items-center gap-1">
            <TagIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {currentConfig.tagTitle}
          </span>
          {currentConfig.tags.map((item) => (
            <button
              key={item.label}
              onClick={() => setSearchQuery(item.query)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all soft-btn ${
                searchQuery.toLowerCase().includes(item.query.toLowerCase())
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                  : 'text-slate-700 hover:text-teal-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end px-1">
        <span className="text-xs sm:text-sm font-bold text-slate-600 bg-slate-200/80 px-3 py-1 rounded-full soft-inset-sm">
          Showing <strong className="text-teal-700">{resultsCount}</strong> items
        </span>
      </div>

    </div>
  );
}