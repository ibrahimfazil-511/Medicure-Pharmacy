
import React from 'react';
import { useNavigate } from 'react-router-dom';

const brands = [
  { name: 'AGP', domain: 'agp.com.pk', aliases: ['agp'] },
  { name: 'GSK', domain: 'gsk.com', aliases: ['gsk', 'glaxosmithkline'] },
  { name: 'Abbott', domain: 'abbott.com', aliases: ['abbott'] },
  { name: 'Martin Dow', domain: 'martindow.com', aliases: ['martin dow', 'martindow'] },
  { name: 'Getz Pharma', domain: 'getzpharma.com', aliases: ['getz'] },
  { name: 'Bosch', domain: 'bosch.com', aliases: ['bosch'] },
  { name: 'CCL', domain: 'cclpharma.com', aliases: ['ccl'] }
];

export default function BrandShowcase() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-3 sm:py-4" aria-labelledby="trusted-brands-heading">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] text-teal-700">Trusted manufacturers</p>
          <h2 id="trusted-brands-heading" className="mt-0.5 text-base sm:text-2xl font-black text-slate-900">Shop by Brand</h2>
        </div>
        <span className="text-[11px] sm:text-xs font-bold text-slate-500">{brands.length} brands</span>
      </div>

      <div className="grid grid-cols-2 min-[460px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {brands.map((brand) => (
          <button
            key={brand.name}
            type="button"
            onClick={() => navigate(`/category/medicines?brand=${encodeURIComponent(brand.name)}`)}
            className="group flex h-24 sm:h-32 flex-col items-center justify-between rounded-xl border border-slate-200 bg-white p-2 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-lg active:scale-95"
          >
            <div className="flex h-12 sm:h-16 w-full items-center justify-center rounded-lg bg-white p-1">
              <img
                src={`https://cdn.brandfetch.io/domain/${brand.domain}/w/400/h/160/logo`}
                alt={`${brand.name} logo`}
                className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <span className="text-center text-[11px] sm:text-xs font-bold text-slate-700 truncate w-full">
              {brand.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}