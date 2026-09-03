import React from 'react';
import { Search, X, Filter, Pill, Zap, Sparkles } from 'lucide-react';

export default function SearchBarAndFilters({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  categories, 
  resultsCount 
}) { 

  // Category ke mutabiq tags aur placeholders ka data
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'personal-care':
        return {
          placeholder: "Search personal care, razor, facial cream, skincare items...",
          tagTitle: "Popular Personal Care:",
          icon: Sparkles,
          tags: [
            { label: 'Razor & Shaving', query: 'razor' },
            { label: 'Facial Cream', query: 'facial cream' },
            { label: 'Skincare', query: 'skincare' },
            { label: 'Face Wash', query: 'face wash' },
            { label: 'Hair Care', query: 'hair' },
            { label: 'Oral Care', query: 'oral' }
          ]
        };

      case 'baby-care':
        return {
          placeholder: "Search baby diapers, formula milk, baby lotion, wipes...",
          tagTitle: "Popular Baby Care:",
          icon: Sparkles,
          tags: [
            { label: 'Diapers', query: 'diaper' },
            { label: 'Baby Milk', query: 'formula milk' },
            { label: 'Baby Wipes', query: 'wipes' },
            { label: 'Baby Lotion', query: 'lotion' },
            { label: 'Baby Soap', query: 'soap' },
            { label: 'Feeding Bottle', query: 'bottle' }
          ]
        };

      case 'lifestyle-&-fitness':
      case 'lifestyle':
        return {
          placeholder: "Search protein, supplements, gym accessories, fitness items...",
          tagTitle: "Popular Fitness:",
          icon: Sparkles,
          tags: [
            { label: 'Protein', query: 'protein' },
            { label: 'Vitamins', query: 'vitamins' },
            { label: 'Energy Drinks', query: 'energy' },
            { label: 'Shakers', query: 'shaker' },
            { label: 'Supplements', query: 'supplement' }
          ]
        };

      case 'organic':
        return {
          placeholder: "Search organic honey, herbal teas, natural oils, seeds...",
          tagTitle: "Popular Organic:",
          icon: Sparkles,
          tags: [
            { label: 'Honey', query: 'honey' },
            { label: 'Herbal Tea', query: 'tea' },
            { label: 'Natural Oils', query: 'oil' },
            { label: 'Seeds', query: 'seeds' },
            { label: 'Organic Foods', query: 'organic' }
          ]
        };

      case 'healthcare-devices':
      case 'devices':
        return {
          placeholder: "Search bp monitor, thermometer, glucometer, nebulizer...",
          tagTitle: "Popular Devices:",
          icon: Sparkles,
          tags: [
            { label: 'BP Monitor', query: 'blood pressure' },
            { label: 'Thermometer', query: 'thermometer' },
            { label: 'Glucometer', query: 'glucose' },
            { label: 'Nebulizer', query: 'nebulizer' },
            { label: 'Oximeter', query: 'oximeter' }
          ]
        };

      default: // Medicines & Default
        return {
          placeholder: "Search medicine name, formula, or active ingredient (e.g. Paracetamol, Omeprazole, Risek)...",
          tagTitle: "Popular Formulas:",
          icon: Zap,
          tags: [
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
    <div id="shop-categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-6 clinic-hero">
      
      {/* Soft UI Search Bar */}
      <div className="soft-card p-4 sm:p-6 border border-white/90 relative">
        <div className="relative flex items-center min-w-0">
          
          <div className="absolute left-4 pointer-events-none text-teal-600">
            <Search className="w-6 h-6" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={currentConfig.placeholder}
            className="w-full min-w-0 pl-12 pr-12 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-slate-800 placeholder-slate-400 bg-[#e8eef5] rounded-2xl soft-inset focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
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
        <div className="mt-4 flex items-center gap-2 flex-wrap text-xs">
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

      {/* Category Pills Header & Buttons */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-extrabold text-slate-800">
              Shop by Category
            </h3>
          </div>

          <span className="text-xs sm:text-sm font-bold text-slate-600 bg-slate-200/80 px-3 py-1 rounded-full soft-inset-sm">
            Showing <strong className="text-teal-700">{resultsCount}</strong> items
          </span>
        </div>

        {/* Scrollable Category Filter Pills */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'soft-btn-primary text-white scale-105 shadow-md shadow-teal-500/20'
                    : 'soft-btn text-slate-700 hover:text-teal-700 hover:bg-slate-50/80'
                }`}
              >
                <Pill className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-teal-600'}`} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}