import { createClient } from '@supabase/supabase-js';
import { INITIAL_MEDICINES } from '../data/initialMedicines.js';

// Default Demo Credentials or localStorage overrides
const DEFAULT_SUPABASE_URL = 'https://xpxyyrqiywnakfucnxkk.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_Bjj6qgVwEQ5ICTjwK2za6A_Erxx3eib';

export function getStoredConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = localStorage.getItem('medicure_supabase_url');
  const localKey = localStorage.getItem('medicure_supabase_key');

  const url = envUrl || localUrl || DEFAULT_SUPABASE_URL;
  const key = envKey || localKey || DEFAULT_SUPABASE_KEY;
  const isCustom = !!(envUrl || localUrl);

  return { url, key, isCustom };
}

let supabaseInstance = null;

export function initSupabase(url, key) {
  try {
    if (url && key) {
      localStorage.setItem('medicure_supabase_url', url);
      localStorage.setItem('medicure_supabase_key', key);
      supabaseInstance = createClient(url, key);
      return { success: true, client: supabaseInstance };
    }
  } catch (err) {
    console.error('Supabase init error:', err);
  }
  const config = getStoredConfig();
  supabaseInstance = createClient(config.url, config.key);
  return { success: true, client: supabaseInstance };
}

export function getSupabase() {
  if (!supabaseInstance) {
    const config = getStoredConfig();
    console.log('[Supabase Client] Initializing client with URL:', config.url);
    supabaseInstance = createClient(config.url, config.key);
  }
  return supabaseInstance;
}

// Direct export of default client instance
export const supabase = getSupabase();

function mapMedicineRow(item) {
  return {
    id: item.id || `med-${Math.random().toString(36).substr(2, 5)}`,
    name: item.name,
    formula: item.formula || item.generic_name || 'Active Formula',
    genericName: item.generic_name || item.formula || '',
    brand: item.brand || 'MediCure Health',
    category: (item.category || 'medicines').toLowerCase().trim(),
    price: Number(item.price) || 5.0,
    originalPrice: item.original_price ? Number(item.original_price) : null,
    stock: item.stock !== undefined ? item.stock : 100,
    unit: item.unit || 'Pack',
    dosageForm: item.dosage_form || 'Tablet',
    strength: item.strength || 'Standard',
    description: item.description || '',
    requiresPrescription: !!item.requires_prescription,
    imageUrl: item.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    rating: Number(item.rating) || 4.8,
    reviewsCount: item.reviews_count || 50,
    isPopular: !!item.is_popular,
    usageInstructions: item.usage_instructions || 'Take as directed by doctor',
    sideEffects: item.side_effects || 'None specified',
    manufacturer: item.manufacturer || item.company || 'Pharma Corp'
  };
}

// Fetch medicines with local fallback
export async function fetchMedicines() {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('medicines')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      console.log('Supabase table empty or offline. Using local catalog dataset.');
      return { data: INITIAL_MEDICINES, source: 'Local Storage / Demo Sync' };
    }
    
    const mapped = data.map(mapMedicineRow);

    return { data: mapped, source: 'Supabase Cloud Database' };
  } catch (e) {
    console.warn('Fetch error from Supabase:', e);
    return { data: INITIAL_MEDICINES, source: 'Local Client Database' };
  }
}

// Fetch the complete database row for the medicine selected in a card.
export async function fetchMedicineByName(name) {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('medicines')
      .select('*')
      .eq('name', name)
      .maybeSingle();

    if (error) throw error;
    return { data: data ? mapMedicineRow(data) : null, source: 'Supabase Cloud Database' };
  } catch (e) {
    console.warn('Medicine detail fetch error from Supabase:', e);
    return { data: null, source: 'Unavailable' };
  }
}

// Seed medicines into Supabase table
export async function seedSupabaseMedicines() {
  try {
    const client = getSupabase();
    
    const rowsToInsert = INITIAL_MEDICINES.map(m => ({
      id: m.id,
      name: m.name,
      formula: m.formula,
      generic_name: m.genericName,
      brand: m.brand,
      category: m.category,
      price: m.price,
      original_price: m.originalPrice || null,
      stock: m.stock,
      unit: m.unit,
      dosage_form: m.dosageForm,
      strength: m.strength,
      description: m.description,
      requires_prescription: m.requiresPrescription,
      image_url: m.imageUrl,
      rating: m.rating,
      reviews_count: m.reviewsCount,
      is_popular: m.isPopular,
      usage_instructions: m.usageInstructions,
      side_effects: m.sideEffects,
      manufacturer: m.manufacturer
    }));

    const { data, error } = await client
      .from('medicines')
      .upsert(rowsToInsert, { onConflict: 'id' });

    if (error) {
      throw error;
    }
    return { success: true, count: rowsToInsert.length, data };
  } catch (err) {
    console.error('Seeding error:', err);
    return { success: false, error: err.message || 'Could not seed table' };
  }
}

// Save Prescription Upload with Storage Bucket support
export async function savePrescription(prescription, fileObj) {
  try {
    const client = getSupabase();
    let fileUrl = prescription.fileName || '';

    if (fileObj) {
      const filePath = `prescriptions/${prescription.id}_${fileObj.name}`;
      
      const { data: uploadData, error: uploadError } = await client.storage
        .from('prescriptions-bucket')
        .upload(filePath, fileObj);

      if (uploadError) {
        console.error('Exact Supabase Upload Error:', uploadError);
        return { success: false, error: uploadError.message };
      }

      const { data: publicURLData } = client.storage
        .from('prescriptions-bucket')
        .getPublicUrl(filePath);
      
      fileUrl = publicURLData.publicUrl;
    }

    const { data, error } = await client
      .from('prescriptions')
      .insert([{
        id: prescription.id,
        patient_name: prescription.patientName,
        patient_age: prescription.patientAge,
        patient_phone: prescription.patientPhone,
        notes: prescription.notes,
        file_name: fileUrl,
        timestamp: prescription.timestamp || new Date().toISOString(),
        status: prescription.status || 'Pending Review',
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Supabase prescription insert error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, id: prescription.id, data };
  } catch (err) {
    console.error('Catch error saving prescription:', err.message);
    return { success: false, error: err.message };
  }
}

// Save Order
export async function saveOrder(order) {
  try {
    const client = getSupabase();
    
    const itemsPayload = {
      cart: Array.isArray(order.items) 
        ? order.items.map(item => ({
            id: item.medicine?.id || item.id,
            name: item.medicine?.name || item.name,
            formula: item.medicine?.formula || item.formula || '',
            price: Number(item.medicine?.price || item.price || 0),
            quantity: Number(item.quantity || 1)
          }))
        : [],
      shipping: {
        phone: order.phone || '',
        address: order.shippingAddress || order.address || '',
        city: order.city || 'Lahore',
        payment_method: order.paymentMethod || 'Cash on Delivery',
        tracking_code: order.trackingId || null,
        subtotal: Number(order.subtotal || 0),
        shipping_fee: Number(order.shippingFee || 0)
      }
    };

    const insertPayload = {
      customer_name: (order.customerName || order.customer_name || 'Guest Customer').trim(),
      customer_email: (order.customerEmail || order.customer_email || null)?.trim() || null,
      total_amount: parseFloat(order.total || order.total_amount || 0),
      items: itemsPayload,
      status: order.status || 'Pending'
    };

    const { data, error } = await client
      .from('orders')
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      console.error('[Supabase Error] Orders insert failed:', error);
      return { success: false, error: error.message || error };
    }

    return { 
      success: true, 
      order: data, 
      id: data.id, 
      trackingId: order.trackingId || `MED-${data.id}` 
    };
  } catch (err) {
    console.error('[Supabase Catch Error] Exception in saveOrder:', err);
    return { success: false, error: err.message || 'Unexpected exception saving order' };
  }
}

export function getSQLSchemaSnippet() {
  return `-- Copy and run this SQL inside your Supabase SQL Editor:

-- 1. Create Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  formula TEXT,
  generic_name TEXT,
  brand TEXT,
  category TEXT,
  price NUMERIC(10,2),
  original_price NUMERIC(10,2),
  stock INTEGER DEFAULT 100,
  unit TEXT,
  dosage_form TEXT,
  strength TEXT,
  description TEXT,
  requires_prescription BOOLEAN DEFAULT false,
  image_url TEXT,
  rating NUMERIC(3,2) DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 10,
  is_popular BOOLEAN DEFAULT false,
  usage_instructions TEXT,
  side_effects TEXT,
  manufacturer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_age TEXT,
  patient_phone TEXT NOT NULL,
  notes TEXT,
  file_name TEXT,
  status TEXT DEFAULT 'Pending Review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  total_amount NUMERIC(10,2) NOT NULL,
  items JSONB,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Cancelled', 'Delivered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Enable RLS & Policies
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Medicines" ON medicines FOR SELECT USING (true);
CREATE POLICY "Public Insert Access for Medicines" ON medicines FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access for Medicines" ON medicines FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public Delete Access for Medicines" ON medicines FOR DELETE USING (true);
`;
}