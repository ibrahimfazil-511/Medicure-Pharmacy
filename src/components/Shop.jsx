import React, { useState, useEffect } from 'react';
import { fetchMedicines } from '../services/supabaseClient';
import MedicineCard from './MedicineCard';

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
              <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      )}
    </div>
  );
}