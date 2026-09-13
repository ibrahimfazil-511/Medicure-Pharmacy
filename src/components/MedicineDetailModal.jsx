import React, { useState, useEffect } from 'react';
import { Pill, AlertTriangle, ShieldCheck, ShoppingBag, Check, Star, MessageSquarePlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import CategoryNavSection from './CategoryNavSection';
import {
  fetchMedicineRating,
  fetchMedicineReviews,
  submitReview,
} from '../services/supabaseClient';

export default function MedicineDetailModal({
  medicine,
  onClose,
  onAddToCart,
  onOpenPrescription,
  onOpenTrackOrder,
  onOpenContactUs,
  onOpenCart,
  cartCount = 0,
  searchQuery = '',
  setSearchQuery = () => {},
  onCategoryClick,
}) {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [liveRating, setLiveRating] = useState({ avg_rating: 0, review_count: 0 });
  const [reviews, setReviews] = useState([]);
  const [ratingLoading, setRatingLoading] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  const medicineId = medicine?.id;

  useEffect(() => {
    if (!medicine) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [medicine]);

  useEffect(() => {
    if (!medicineId) return;
    let cancelled = false;
    (async () => {
      setRatingLoading(true);
      const [rating, list] = await Promise.all([
        fetchMedicineRating(medicineId),
        fetchMedicineReviews(medicineId, 20),
      ]);
      if (cancelled) return;
      setLiveRating(rating);
      setReviews(list);
      setRatingLoading(false);
    })();
    return () => { cancelled = true; };
  }, [medicineId]);

  if (!medicine) return null;

  const categoryStr = (medicine.category || '').toLowerCase();
  const isMedicine =
    categoryStr.includes('medicine') ||
    categoryStr.includes('otc') ||
    categoryStr.includes('prescription');
  const companyName =
    medicine.company || medicine.manufacturer || medicine.brand || medicine.supplier || null;

  const runAfterClose = (callback) => () => {
    onClose?.();
    setTimeout(() => callback?.(), 100);
  };

  const handleAdd = () => {
    onAddToCart(medicine, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose?.();
      setTimeout(() => onOpenCart?.(), 100);
    }, 500);
  };

  const handleBack = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  const handleCategoryWrapperClick = (e) => {
    if (e.target.closest('a')) {
      onClose?.();
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userRating) {
      setSubmitMsg({ type: 'error', text: 'Please select a star rating.' });
      return;
    }
    setSubmitting(true);
    setSubmitMsg(null);

    const res = await submitReview({
      medicineId,
      userName: reviewName,
      rating: userRating,
      reviewText,
    });

    if (!res.success) {
      setSubmitting(false);
      setSubmitMsg({ type: 'error', text: res.error || 'Could not submit review.' });
      return;
    }

    const [freshRating, freshList] = await Promise.all([
      fetchMedicineRating(medicineId),
      fetchMedicineReviews(medicineId, 20),
    ]);
    setLiveRating(freshRating);
    setReviews(freshList);

    setSubmitting(false);
    setUserRating(0);
    setHoverRating(0);
    setReviewName('');
    setReviewText('');
    setSubmitMsg({ type: 'success', text: 'Thank you! Your review has been posted.' });
    setTimeout(() => setSubmitMsg(null), 3000);
  };

  const displayRating = liveRating.avg_rating > 0 ? liveRating.avg_rating.toFixed(1) : null;
  const reviewCount = liveRating.review_count || 0;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f4f8f8] overflow-y-auto animate-in fade-in duration-200">

      {/* ============ NAVBAR ============ */}
      <Navbar
        onOpenPrescription={runAfterClose(onOpenPrescription)}
        onOpenTrackOrder={runAfterClose(onOpenTrackOrder)}
        onOpenContactUs={runAfterClose(onOpenContactUs)}
        onOpenCart={runAfterClose(onOpenCart)}
        cartCount={cartCount}
        onCategoryClick={onCategoryClick}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showBackToHome={true}  
        hideSearch={true}
        onBack={handleBack}
      />

      {/* ============ CATEGORY NAV ============ */}
      <div
        className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-1"
        onClick={handleCategoryWrapperClick}
      >
        <CategoryNavSection />
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 pb-10">

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-6 lg:gap-8 mb-6 lg:items-center">

          {/* LEFT: Image */}
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto lg:mx-0">
            <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-teal-50 to-white border border-teal-100 p-6 sm:p-8 shadow-sm">
              <span className="absolute left-3 top-3 z-10 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 ring-1 ring-inset ring-teal-200">
                Product view
              </span>
              <img
                src={medicine.imageUrl || medicine.image}
                alt={medicine.name}
                className="h-full w-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
              />
            </div>

            {(isMedicine && medicine.requiresPrescription) || !isMedicine ? (
              <div className="w-full rounded-xl border border-teal-100 bg-white p-3 shadow-sm">
                {isMedicine && medicine.requiresPrescription ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>Doctor Prescription Required</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-teal-600" />
                    <span>Verified Authentic Medicine</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* RIGHT: Info + Add to Cart */}
          <div className="flex flex-col gap-4">

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-teal-700 ring-1 ring-inset ring-teal-200">
                  {medicine.category || 'General'}
                </span>
                {ratingLoading ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800 ring-1 ring-inset ring-amber-200">
                    <Loader2 className="h-3 w-3 animate-spin text-amber-600" /> Loading…
                  </span>
                ) : displayRating ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-800 ring-1 ring-inset ring-amber-200">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    {displayRating}
                    <span className="font-medium text-amber-600">({reviewCount})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500 ring-1 ring-inset ring-slate-200">
                    <Star className="h-3 w-3 text-slate-400" /> No ratings yet
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-950">
                {medicine.name}
              </h1>

              {companyName && (
                <p className="text-sm text-slate-500">
                  Manufactured by <strong className="font-bold text-slate-800">{companyName}</strong>
                </p>
              )}
            </div>

            {isMedicine && (
              <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
                <span className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-teal-800">
                  <Pill className="h-3.5 w-3.5 text-teal-600" /> Chemical Composition & Formula
                </span>
                <p className="mt-1.5 text-base font-black text-slate-900">
                  {medicine.formula || medicine.genericName || 'Standard'}
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-600">
                  {medicine.genericName || 'Standard'} · {medicine.strength || medicine.packSize || 'Tablet'}
                </p>
              </div>
            )}

            <div className="border-l-2 border-teal-300 pl-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-teal-700">About this product</h4>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {medicine.description || 'High quality pharmaceutical medicine stored in temperature-controlled facilities.'}
              </p>
            </div>

            {isMedicine && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h5 className="text-[11px] font-black uppercase tracking-wide text-slate-800">Usage Instructions</h5>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {medicine.usageInstructions || medicine.directions || 'As directed by physician.'}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h5 className="text-[11px] font-black uppercase tracking-wide text-slate-800">Precautions</h5>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {medicine.sideEffects || 'Keep out of reach of children. Consult pharmacist.'}
                  </p>
                </div>
              </div>
            )}

            {/* COMPACT ADD TO CART */}
            <div className="rounded-2xl bg-gradient-to-br from-[#06645f] to-teal-700 text-white p-3 sm:p-4 shadow-lg shadow-teal-900/20">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-teal-200">Total Price</span>
                  <span className="text-base sm:text-lg font-black tracking-tight whitespace-nowrap">
                    PKR {Number((medicine.price || 0) * quantity).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <div className="flex items-center gap-0.5 rounded-lg bg-white/15 p-0.5 border border-white/10">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-white hover:bg-white/20 active:scale-95 transition">−</button>
                    <span className="w-6 text-center text-xs font-bold text-white">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-white hover:bg-white/20 active:scale-95 transition">+</button>
                  </div>

                  <button onClick={handleAdd}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold shadow-md transition-all active:scale-95 ${
                      added ? 'bg-emerald-500 text-white' : 'bg-white text-teal-900 hover:bg-teal-50'
                    }`}>
                    {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
                    <span className="whitespace-nowrap">{added ? 'Added!' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RATINGS & REVIEWS */}
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5 text-teal-600" />
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-800">Ratings & Reviews</h4>
            </div>
            {displayRating && (
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" /> {displayRating}
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-medium">{reviewCount} review{reviewCount === 1 ? '' : 's'}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-600">
                Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h5>

              {reviews.length === 0 ? (
                <div className="text-center py-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <Star className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500">No reviews yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} className={`h-3.5 w-3.5 ${n <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs font-bold text-slate-800">{r.user_name || 'Anonymous'}</p>
                      {r.review_text && <p className="mt-1 text-xs text-slate-600 leading-relaxed">{r.review_text}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3 lg:sticky lg:top-32 h-fit rounded-2xl bg-gradient-to-br from-teal-50/60 to-white border border-teal-100 p-4 sm:p-5">
              <h5 className="text-xs font-black uppercase tracking-wider text-slate-700">Share your experience</h5>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button"
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setUserRating(n)}
                    className="p-0.5 transition active:scale-90"
                    aria-label={`Rate ${n} star`}>
                    <Star className={`h-7 w-7 transition ${
                      n <= (hoverRating || userRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`} />
                  </button>
                ))}
                {userRating > 0 && <span className="ml-2 text-xs font-bold text-amber-700">{userRating} / 5</span>}
              </div>

              <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-teal-500" />

              <textarea rows={3} value={reviewText} onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-teal-500 resize-none" />

              {submitMsg && (
                <div className={`text-[11px] font-bold p-2.5 rounded-lg ${
                  submitMsg.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>{submitMsg.text}</div>
              )}

              <button type="submit" disabled={submitting || !userRating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.99]">
                {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Posting…</>)
                : (<><MessageSquarePlus className="h-4 w-4" /> Submit Review</>)}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}