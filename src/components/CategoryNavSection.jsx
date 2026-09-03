import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Pill, Heart, Baby, Dumbbell, Leaf, Stethoscope } from 'lucide-react';

export default function CategoryNavSection() {
  const categories = [
    // { id: 'all', name: 'All', label: 'All Products', icon: Activity },
    { id: 'medicines', name: 'Medicines', label: 'Medicines', icon: Pill },
    { id: 'personal-care', name: 'Personal Care', label: 'Personal Care', icon: Heart },
    { id: 'baby-care', name: 'Baby Care', label: 'Baby Care', icon: Baby },
    { id: 'lifestyle', name: 'Lifestyle & Fitness', label: 'Lifestyle & Fitness', icon: Dumbbell },
    { id: 'organic', name: 'Organic', label: 'Organic', icon: Leaf },
    { id: 'devices', name: 'Healthcare Devices', label: 'Healthcare Devices', icon: Stethoscope },
  ];

  return (
    <div className="space-y-4 clinic-hero">
      <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">EXPLORE CATEGORIES</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((cat) => {
          const IconComp = cat.icon;
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-sm border bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:bg-teal-50/30"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600">
                <IconComp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-center">{cat.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}