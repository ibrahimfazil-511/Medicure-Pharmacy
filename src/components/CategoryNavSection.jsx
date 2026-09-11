import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_DATA } from '../data/categoryData.js';

export default function CategoryNavSection() {
  return (
    <div className="category-navigation relative z-20 mx-auto max-w-6xl space-y-4 clinic-hero">
      <div className="flex items-center justify-center">
        <h2 className="text-center text-lg font-black tracking-tight text-slate-900 sm:text-xl">EXPLORE CATEGORIES</h2>
      </div>
      
      <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
        {CATEGORY_DATA.map((cat) => {
          const IconComp = cat.icon;

          return (
            <div key={cat.id} className="group relative min-w-0">
              <Link
                to={`/category/${cat.id}`}
                className="relative z-10 flex min-h-[88px] sm:min-h-28 flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-2 sm:p-4 text-slate-700 shadow-sm transition-all hover:border-teal-400 hover:bg-teal-50/30 active:scale-95"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-teal-50 text-teal-600 shrink-0">
                  <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-center leading-tight line-clamp-2">{cat.label}</span>
              </Link>

              {/* Desktop-only hover dropdown (mobile touch opens category page with subcategories) */}
              <div className="category-dropdown hidden md:block invisible absolute left-1/2 top-full z-50 w-52 max-w-[calc(100vw-2rem)] -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
                  {cat.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory}
                      to={`/category/${cat.id}?subcategory=${encodeURIComponent(subcategory)}`}
                      className="block rounded-lg px-3 py-1.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-700"
                    >
                      <span className="mr-1.5 text-teal-500">›</span>{subcategory}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}