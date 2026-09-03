import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveOrder } from '../services/supabaseClient.js';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onOpenPrescription }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
  
  // Delivery Fee Logic: Karachi orders < 5000 have Rs 150 fee, >= 5000 are FREE. Out of city has no delivery fee mentioned.
  let shippingFee = 0;
  if (city === 'Karachi') {
    shippingFee = subtotal >= 5000 ? 0 : 150;
  } else {
    shippingFee = null; 
  }

  const total = subtotal + (shippingFee !== null ? shippingFee : 0);

  const rxItems = cartItems.filter(item => item.medicine.requiresPrescription);
  const hasRx = rxItems.length > 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setPlacing(true);
    setOrderError(null);

    const trackingId = `MED-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderObj = {
      customerName,
      customerEmail: customerEmail ? customerEmail.trim() : null,
      phone,
      shippingAddress: address,
      city,
      items: cartItems,
      subtotal,
      shippingFee: shippingFee !== null ? shippingFee : 0,
      total,
      paymentMethod,
      status: 'Pending',
      trackingId,
      createdAt: new Date().toLocaleString()
    };

    console.log('[CartDrawer] Submitting order payload:', orderObj);
    const result = await saveOrder(orderObj);
    setPlacing(false);

    if (!result.success) {
      console.error('[CartDrawer] Order submission failed:', result.error);
      setOrderError(typeof result.error === 'string' ? result.error : 'Database error saving order.');
      return;
    }

    console.log('[CartDrawer] Order placed and saved in Supabase:', result);
    const finalizedOrder = {
      ...orderObj,
      id: result.id,
      trackingId: result.trackingId || trackingId
    };

    setCompletedOrder(finalizedOrder);
    onClearCart();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleCloseAll = () => {
    setIsCheckingOut(false);
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md soft-card bg-[#f4f8f8] p-4 sm:p-6 flex flex-col justify-between relative border-l border-white overflow-y-auto animate-in">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-300">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingBag className="w-6 h-6 text-teal-600" />
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 truncate">Your Pharmacy Cart</h2>
            </div>
            <button 
              onClick={handleCloseAll}
              className="p-2 rounded-xl soft-btn text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!completedOrder ? (
            !isCheckingOut ? (
              /* Cart List View */
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                
                {hasRx && (
                  <div className="p-3 rounded-xl bg-amber-100/90 text-amber-900 text-xs font-bold space-y-1 soft-inset-sm border border-amber-300">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Prescription Required Items in Cart</span>
                    </div>
                    <p className="text-[11px] font-normal text-slate-700">
                      You have {rxItems.length} prescription item(s). Our pharmacist will verify your prescription upon delivery or you can upload it beforehand.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenPrescription();
                      }}
                      className="text-xs text-teal-800 underline font-bold pt-1 block"
                    >
                      Upload Prescription Now &rarr;
                    </button>
                  </div>
                )}

                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-600">Your cart is currently empty</p>
                    <p className="text-xs text-slate-400">Search medicine by name or formula to add items</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div 
                      key={item.medicine.id}
                      className="p-3 rounded-2xl soft-card bg-slate-100 flex items-center justify-between gap-3 border border-white"
                    >
                      <img 
                        src={item.medicine.imageUrl} 
                        alt={item.medicine.name}
                        className="w-14 h-14 rounded-xl object-cover soft-inset shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.medicine.name}</h4>
                        <p className="text-[11px] text-teal-700 font-semibold line-clamp-1">{item.medicine.formula}</p>
                        <span className="text-xs font-black text-slate-900">PKR {(item.medicine.price * item.quantity).toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center rounded-lg soft-inset p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.medicine.id, item.quantity - 1)}
                            className="w-6 h-6 rounded font-bold text-slate-700 flex items-center justify-center text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.medicine.id, item.quantity + 1)}
                            className="w-6 h-6 rounded font-bold text-slate-700 flex items-center justify-center text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.medicine.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}

              </div>
            ) : (
              /* Checkout View - Wrapped in form to trigger HTML5 validation */
              <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto py-4 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800">Delivery & Checkout Information</h3>

                  {orderError && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Failed to place order:</strong>
                        <span>{orderError}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Customer Name <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ibrahim Fazil"
                      className="w-full px-3 py-2 rounded-xl soft-inset-sm text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address <span className="text-slate-400 font-normal">(Optional for updates)</span></label>
                    <input 
                      type="email" 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. ibrahim@example.com"
                      className="w-full px-3 py-2 rounded-xl soft-inset-sm text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (For Rider) <span className="text-rose-500">*</span></label>
                    <input 
                      type="tel" 
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full px-3 py-2 rounded-xl soft-inset-sm text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address <span className="text-rose-500">*</span></label>
                    <textarea 
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Apartment #, Street, Sector/Area"
                      className="w-full px-3 py-2 rounded-xl soft-inset-sm text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City <span className="text-rose-500">*</span></label>
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl soft-inset-sm text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select City</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Cash on Delivery')}
                        className={`p-2.5 rounded-xl text-center border transition-all ${
                          paymentMethod === 'Cash on Delivery' 
                            ? 'soft-btn-primary border-teal-600' 
                            : 'soft-btn text-slate-700'
                        }`}
                      >
                        Cash on Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card / Online')}
                        className={`p-2.5 rounded-xl text-center border transition-all ${
                          paymentMethod === 'Card / Online' 
                            ? 'soft-btn-primary border-teal-600' 
                            : 'soft-btn text-slate-700'
                        }`}
                      >
                        Credit/Debit Card
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 block pt-1 font-semibold"
                  >
                    &larr; Back to Cart List
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={placing}
                    className="w-full soft-btn-primary py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{placing ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Order Placed Success View */
            <div className="flex-1 overflow-y-auto py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">Order Placed Successfully!</h3>
              
              <div className="p-4 rounded-2xl soft-inset bg-teal-50/80 text-left space-y-2 border border-teal-200 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tracking Number:</span>
                  <strong className="text-teal-800 font-mono text-sm">{completedOrder.trackingId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid:</span>
                  <strong className="text-slate-900 font-black">Rs {completedOrder.total.toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="text-slate-800 font-bold">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Arrival:</span>
                  <span className="text-emerald-700 font-bold">Within 45 Minutes</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                You can track this order anytime using tracking ID <strong className="text-slate-800">{completedOrder.trackingId}</strong> in the 'Track Order' section.
              </p>
            </div>
          )}

          {/* Bottom Summary & Buttons for Cart List View */}
          {cartItems.length > 0 && !completedOrder && !isCheckingOut && (
            <div className="pt-4 border-t border-slate-300 space-y-3">
              <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>
                    {city === 'Karachi' ? (
                      shippingFee === 0 ? (
                        <strong className="text-emerald-600 font-bold">FREE (Above Rs 5,000)</strong>
                      ) : (
                        <strong className="text-slate-900 font-bold">Rs 150.00</strong>
                      )
                    ) : (
                      <span className="text-slate-500 font-normal">Calculated / Not Applicable</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300/60">
                  <span>Total Amount</span>
                  <span className="text-teal-800">Rs {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full soft-btn-primary py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}