import React from 'react';

const brands = [
  { name: 'AGP', domain: 'agp.com.pk', aliases: ['agp'] },
  { name: 'GSK', domain: 'gsk.com', aliases: ['gsk', 'glaxosmithkline'] },
  { name: 'Abbott', domain: 'abbott.com', aliases: ['abbott'] },
  { name: 'Martin Dow', domain: 'martindow.com', aliases: ['martin dow', 'martindow'] },
  { name: 'Getz Pharma', domain: 'getzpharma.com', aliases: ['getz'] },
  { name: 'Bosch', domain: 'bosch.com', aliases: ['bosch'] },
  { name: 'CCL', domain: 'cclpharma.com', aliases: ['ccl'] }
];

export default function BrandShowcase({ onSelectBrand }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" aria-labelledby="trusted-brands-heading">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">Trusted manufacturers</p>
          <h2 id="trusted-brands-heading" className="mt-1 text-xl sm:text-2xl font-black text-slate-900">Shop by Brand</h2>
        </div>
        <span className="text-xs font-bold text-slate-500">{brands.length} brands</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {brands.map((brand) => (
          <button
            key={brand.name}
            type="button"
            onClick={() => onSelectBrand(brand)}
            className="group flex min-h-36 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-lg"
          >
            <span className="flex h-20 w-full items-center justify-center rounded-lg bg-white p-2">
              <img
                src={`https://cdn.brandfetch.io/domain/${brand.domain}/w/400/h/160/logo`}
                alt={`${brand.name} logo`}
                className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            </span>
            <span className="mt-3 text-center text-xs font-black text-slate-700">{brand.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
