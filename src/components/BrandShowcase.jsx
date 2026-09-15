
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const brands = [
//   { name: 'AGP', domain: 'agp.com.pk', aliases: ['agp'] },
//   { name: 'GSK', domain: 'gsk.com', aliases: ['gsk', 'glaxosmithkline'] },
//   { name: 'Abbott', domain: 'abbott.com', aliases: ['abbott'] },
//   { name: 'Martin Dow', domain: 'martindow.com', aliases: ['martin dow', 'martindow'] },
//   { name: 'Getz Pharma', domain: 'getzpharma.com', aliases: ['getz'] },
//   { name: 'Bosch', domain: 'bosch.com', aliases: ['bosch'] },
//   { name: 'CCL', domain: 'cclpharma.com', aliases: ['ccl'] }
// ];

// export default function BrandShowcase() {
//   const navigate = useNavigate();

//   return (
//     <section className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-3 sm:py-4" aria-labelledby="trusted-brands-heading">
//       <div className="mb-3 flex items-end justify-between gap-4">
//         <div>
//           <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.16em] text-teal-700">Trusted manufacturers</p>
//           <h2 id="trusted-brands-heading" className="mt-0.5 text-base sm:text-2xl font-black text-slate-900">Shop by Brand</h2>
//         </div>
//         <span className="text-[11px] sm:text-xs font-bold text-slate-500">{brands.length} brands</span>
//       </div>

//       <div className="grid grid-cols-2 min-[460px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
//         {brands.map((brand) => (
//           <button
//             key={brand.name}
//             type="button"
//             onClick={() => navigate(`/category/medicines?brand=${encodeURIComponent(brand.name)}`)}
//             className="group flex h-24 sm:h-32 flex-col items-center justify-between rounded-xl border border-slate-200 bg-white p-2 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-lg active:scale-95"
//           >
//             <div className="flex h-12 sm:h-16 w-full items-center justify-center rounded-lg bg-white p-1">
//               <img
//                 src={`https://cdn.brandfetch.io/domain/${brand.domain}/w/400/h/160/logo`}
//                 alt={`${brand.name} logo`}
//                 className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
//                 loading="lazy"
//                 onError={(event) => {
//                   event.currentTarget.style.display = 'none';
//                 }}
//               />
//             </div>
//             <span className="text-center text-[11px] sm:text-xs font-bold text-slate-700 truncate w-full">
//               {brand.name}
//             </span>
//           </button>
//         ))}
//       </div>
//     </section>
//   );
// }







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

  // Infinite loop ke liye array duplicate
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4" aria-labelledby="trusted-brands-heading">
      
      {/* Inline Stylesheet for Seamless Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        .animate-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* HEADER SECTION */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-teal-700 leading-tight">
            Trusted manufacturers
          </p>
          <h2 id="trusted-brands-heading" className="mt-0.5 text-base sm:text-2xl font-black text-slate-900 truncate">
            Shop by Brand
          </h2>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="inline-block text-[11px] sm:text-xs font-bold text-slate-500 mr-1">
            {brands.length} brands
          </span>
        </div>
      </div>

      {/* INFINITE MARQUEE CAROUSEL CONTAINER */}
      <div className="relative w-full overflow-hidden flex items-center py-2">
        
        {/* Soft Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Continuous Animated Track */}
        <div className="animate-marquee-track space-x-3 sm:space-x-4 items-center">
          {duplicatedBrands.map((brand, index) => (
            <button
              key={`${brand.name}-${index}`}
              type="button"
              onClick={() => navigate(`/category/medicines?brand=${encodeURIComponent(brand.name)}`)}
              className="group flex h-24 sm:h-32 w-28 sm:w-44 flex-none flex-col items-center justify-between rounded-xl border border-slate-200 bg-white p-2 sm:p-3 shadow-sm transition hover:-translate-y-1 hover:border-teal-400 hover:shadow-lg active:scale-95 cursor-pointer"
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
      </div>
    </section>
  );
}