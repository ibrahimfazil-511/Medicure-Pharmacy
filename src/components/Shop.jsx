import React, { useState, useEffect } from 'react';
import { fetchMedicines } from '../services/supabaseClient';

export default function Shop() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const result = await fetchMedicines();
    if (result && result.data) {
      setMedicines(result.data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {loading ? (
        <p className="text-center py-10">Loading inventory...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((med) => (
            <div key={med.id} className="bg-white p-4 rounded-3xl border shadow-sm">
              <img src={med.imageUrl} alt={med.name} className="h-40 w-full object-contain mb-4" />
              <span className="text-xs uppercase px-2 py-1 bg-teal-50 text-teal-700 rounded-full">{med.category}</span>
              <h3 className="font-bold text-lg mt-2">{med.name}</h3>
              <p className="text-gray-500 text-sm">Formula: {med.formula}</p>
              <p className="text-teal-600 font-bold mt-2">Rs. {med.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}