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

export async function sendOrderEmail(orderId, orderDetails = null) {
  try {
    const payload = { orderId };
    if (orderDetails) {
      payload.order = orderDetails;
    }

    const { data, error } = await getSupabase().functions.invoke('send-order-email', {
      body: payload
    });

    if (error) {
      console.warn('[Order Confirmation Email Warning]:', error.message || error);
      return { success: false, error: error.message || 'Order email failed' };
    }

    console.log('[Order Confirmation Email] Confirmation email automatically dispatched for order #' + orderId, data);
    return { success: true, data };
  } catch (err) {
    console.warn('[Order Confirmation Email Exception]:', err.message);
    return { success: false, error: err.message || 'Order email failed' };
  }
}

// Direct export of default client instance
export const supabase = getSupabase();

function mapMedicineRow(item) {
  const discount = Math.max(0, Number(item.discount) || 0);
  const basePrice = Number(item.price) || 5.0;
  const hasOriginalPrice = Number(item.original_price) > basePrice;
  const price = hasOriginalPrice || discount === 0
    ? basePrice
    : Number((basePrice * (1 - discount / 100)).toFixed(2));
  return {
    id: item.id || `med-${Math.random().toString(36).substr(2, 5)}`,
    name: item.name,
    formula: item.formula || item.generic_name || 'Active Formula',
    genericName: item.generic_name || item.formula || '',
    brand: item.brand || 'MediCure Health',
    category: (item.category || 'medicines').toLowerCase().trim(),
    price,
    originalPrice: item.original_price ? Number(item.original_price) : discount > 0 ? basePrice : null,
    discount,
    stock: item.stock !== undefined ? item.stock : 100,
    unit: item.unit || 'Pack',
    dosageForm: item.dosage_form || 'Tablet',
    strength: item.strength || 'Standard',
    description: item.description || '',
    requiresPrescription: !!item.requires_prescription,
    imageUrl: item.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    rating: Number(item.rating) || 0,
    reviewsCount: item.reviews_count || 0,
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

// Fetch a single medicine by id, name slug, or fallback
export async function fetchMedicineByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return { data: null };
  const term = decodeURIComponent(String(idOrSlug)).trim().toLowerCase();

  // 1. Try local catalog / INITIAL_MEDICINES first for instant match
  const localMatch = INITIAL_MEDICINES.find((m) =>
    String(m.id).toLowerCase() === term ||
    m.name.toLowerCase() === term ||
    m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === term
  );

  try {
    const client = getSupabase();
    // Try matching ID
    const { data: byId } = await client
      .from('medicines')
      .select('*')
      .eq('id', idOrSlug)
      .maybeSingle();

    if (byId) {
      return { data: mapMedicineRow(byId), source: 'Supabase Cloud Database' };
    }

    // Try matching exact or slug name
    const { data: allMeds } = await client
      .from('medicines')
      .select('*');

    if (allMeds && allMeds.length > 0) {
      const match = allMeds.find((m) =>
        String(m.id).toLowerCase() === term ||
        (m.name || '').toLowerCase() === term ||
        (m.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-') === term
      );
      if (match) {
        return { data: mapMedicineRow(match), source: 'Supabase Cloud Database' };
      }
    }
  } catch (err) {
    console.warn('fetchMedicineByIdOrSlug Supabase error:', err);
  }

  if (localMatch) {
    return { data: localMatch, source: 'Local Catalog' };
  }

  return { data: null, source: 'Not Found' };
}


// ============================================================
// LIVE RATINGS — REVIEWS SYSTEM
// ============================================================

/**
 * Fetch average rating + review count for ONE medicine.
 * Returns { avg_rating: number, review_count: number }
 */
export async function fetchMedicineRating(medicineId) {
  if (!medicineId) return { avg_rating: 0, review_count: 0 };
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('medicine_ratings')
      .select('avg_rating, review_count')
      .eq('medicine_id', medicineId)
      .maybeSingle();

    if (error) {
      console.warn('[fetchMedicineRating]', error.message);
      return { avg_rating: 0, review_count: 0 };
    }
    return {
      avg_rating: Number(data?.avg_rating) || 0,
      review_count: Number(data?.review_count) || 0,
    };
  } catch (err) {
    console.warn('[fetchMedicineRating] Exception:', err.message);
    return { avg_rating: 0, review_count: 0 };
  }
}

/**
 * Fetch ratings for MANY medicines at once (1 query instead of N).
 * Pass an array of IDs → returns map: { [id]: { avg_rating, review_count } }
 */
export async function fetchMedicineRatingsBulk(medicineIds = []) {
  if (!Array.isArray(medicineIds) || medicineIds.length === 0) return {};
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('medicine_ratings')
      .select('medicine_id, avg_rating, review_count')
      .in('medicine_id', medicineIds);

    if (error) {
      console.warn('[fetchMedicineRatingsBulk]', error.message);
      return {};
    }

    const map = {};
    (data || []).forEach((row) => {
      map[row.medicine_id] = {
        avg_rating: Number(row.avg_rating) || 0,
        review_count: Number(row.review_count) || 0,
      };
    });
    return map;
  } catch (err) {
    console.warn('[fetchMedicineRatingsBulk] Exception:', err.message);
    return {};
  }
}

/**
 * Submit a new review for a medicine.
 */
export async function submitReview({ medicineId, userName, rating, reviewText }) {
  if (!medicineId || !rating) {
    return { success: false, error: 'Medicine ID and rating are required.' };
  }
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('reviews')
      .insert([
        {
          medicine_id: medicineId,
          user_name: (userName || '').trim() || 'Anonymous',
          rating: Number(rating),
          review_text: (reviewText || '').trim() || null,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('[submitReview]', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err) {
    console.error('[submitReview] Exception:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all reviews for a medicine (latest first).
 */
export async function fetchMedicineReviews(medicineId, limit = 20) {
  if (!medicineId) return [];
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('reviews')
      .select('id, user_name, rating, review_text, created_at')
      .eq('medicine_id', medicineId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('[fetchMedicineReviews]', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('[fetchMedicineReviews] Exception:', err.message);
    return [];
  }
}

// ============================================================
// SEEDING
// ============================================================

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
      discount: m.discount || 0,
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
    const customerEmail = (order.customerEmail || order.customer_email || '').trim();
    const phone = (order.phone || '').trim();
    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail);
    const hasValidPhone = phone.replace(/\D/g, '').length >= 10;
    const orderStatus = hasValidPhone || hasValidEmail ? 'Pending' : 'Cancelled';

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
        phone,
        address: order.shippingAddress || order.address || '',
        city: order.city || 'Lahore',
        payment_method: order.paymentMethod || 'Cash on Delivery',
        payment_details: order.paymentDetails || null,
        tracking_code: order.trackingId || null,
        prescription_id: order.prescriptionId || null,
        subtotal: Number(order.subtotal || 0),
        shipping_fee: Number(order.shippingFee || 0)
      }
    };

    const insertPayload = {
      customer_name: (order.customerName || order.customer_name || 'Guest Customer').trim(),
      customer_email: customerEmail || null,
      total_amount: parseFloat(order.total || order.total_amount || 0),
      items: itemsPayload,
      status: orderStatus
    };

    const { data, error } = await client.rpc('place_order_atomic_v2', {
      p_customer_name: insertPayload.customer_name,
      p_customer_email: insertPayload.customer_email,
      p_total_amount: insertPayload.total_amount,
      p_items: insertPayload.items,
      p_status: insertPayload.status
    });

    if (error) {
      console.error('[Supabase Error] Atomic order placement failed:', error);
      return { success: false, error: error.message || 'Could not place order.' };
    }

    const savedOrder = Array.isArray(data) ? data[0] : data;
    if (!savedOrder) return { success: false, error: 'Could not place order.' };

    return {
      success: true,
      order: savedOrder,
      id: savedOrder.id,
      trackingId: order.trackingId || `MED-${savedOrder.id}`
    };
  } catch (err) {
    console.error('[Supabase Catch Error] Exception in saveOrder:', err);
    return { success: false, error: err.message || 'Unexpected exception saving order' };
  }
}

export async function validateCartStock(items) {
  try {
    const ids = items.map((item) => item.medicine?.id).filter(Boolean);
    if (!ids.length) return { success: true, medicines: [] };
    const { data, error } = await getSupabase().from('medicines').select('id,name,stock').in('id', ids);
    if (error) throw error;
    const stockById = new Map((data || []).map((medicine) => [String(medicine.id), medicine]));
    const unavailable = items.map((item) => {
      const medicine = stockById.get(String(item.medicine.id));
      const available = Number(medicine?.stock ?? 0);
      return medicine && available >= Number(item.quantity) ? null : `${item.medicine.name} has only ${available} left`;
    }).filter(Boolean);
    return unavailable.length ? { success: false, error: unavailable.join('. ') } : { success: true, medicines: data || [] };
  } catch (error) {
    console.error('[Supabase] Stock validation failed:', error);
    return { success: false, error: error.message || 'Could not verify stock.' };
  }
}

export async function decrementCartStock(items) {
  try {
    for (const item of items) {
      const id = item.medicine?.id;
      const quantity = Number(item.quantity);
      if (!id || !Number.isInteger(quantity) || quantity < 1) continue;
      const { data: current, error: readError } = await getSupabase().from('medicines').select('stock').eq('id', id).single();
      if (readError) throw readError;
      if (Number(current.stock) < quantity) return { success: false, error: `${item.medicine.name} is no longer available in the requested quantity.` };
      const { error } = await getSupabase().from('medicines').update({ stock: Number(current.stock) - quantity }).eq('id', id).eq('stock', current.stock);
      if (error) throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('[Supabase] Stock deduction failed:', error);
    return { success: false, error: error.message || 'Stock could not be updated.' };
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
  discount NUMERIC(5,2) DEFAULT 0,
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

-- 4. Enable RLS & Policies for Medicines
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ADD COLUMN IF NOT EXISTS discount NUMERIC(5,2) DEFAULT 0;
CREATE POLICY "Public Read Access for Medicines" ON medicines FOR SELECT USING (true);
CREATE POLICY "Admin Insert Access for Medicines" ON medicines FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin Update Access for Medicines" ON medicines FOR UPDATE TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin') WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY "Admin Delete Access for Medicines" ON medicines FOR DELETE TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================
-- 5. LIVE REVIEWS / RATINGS SYSTEM  (NEW)
-- ============================================================

-- 5a. Reviews table — one row per review
CREATE TABLE IF NOT EXISTS reviews (
  id           BIGSERIAL PRIMARY KEY,
  medicine_id  TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  user_name    TEXT NOT NULL DEFAULT 'Anonymous',
  rating       SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_medicine_id ON reviews(medicine_id);

-- 5b. Aggregated view: avg_rating + review_count per medicine
CREATE OR REPLACE VIEW medicine_ratings AS
SELECT
  medicine_id,
  ROUND(AVG(rating)::numeric, 1) AS avg_rating,
  COUNT(*)::int                  AS review_count
FROM reviews
GROUP BY medicine_id;

-- 5c. RLS for reviews (public read, public insert, no update/delete from anon)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
DROP POLICY IF EXISTS "Public can insert reviews" ON reviews;

CREATE POLICY "Public can read reviews"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Public can insert reviews"
  ON reviews FOR INSERT WITH CHECK (true);
`;
}


// Fetch medicines by category with local dataset fallback
export async function fetchMedicinesByCategory(categoryName) {
  if (!categoryName) return [];

  const targetCategory = categoryName.toLowerCase().trim();

  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('medicines')
      .select('*')
      .ilike('category', `%${targetCategory}%`);

    if (error || !data || data.length === 0) {
      // Local dataset fallback agar Supabase offline ya empty ho
      return INITIAL_MEDICINES.map(mapMedicineRow).filter(item =>
        item.category.includes(targetCategory)
      );
    }

    return data.map(mapMedicineRow);
  } catch (err) {
    console.warn('Error fetching medicines by category:', err);
    // Error case me bhi local data fallback return karein
    return INITIAL_MEDICINES.map(mapMedicineRow).filter(item =>
      item.category.includes(targetCategory)
    );
  }
}