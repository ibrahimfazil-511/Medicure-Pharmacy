import React, { useState } from 'react';
import { Truck, Search, X, CheckCircle2, Clock, MapPin, Phone, Package } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');

  if (digits.startsWith('0092')) return digits.slice(2);
  if (digits.startsWith('92')) return digits;
  if (digits.startsWith('0')) return `92${digits.slice(1)}`;
  if (digits.startsWith('3') && digits.length === 10) return `92${digits}`;
  return digits;
};

export default function MediCureOrderSystem({ isOpen, onClose, cartItems, customerInfo }) {
  const [trackingInput, setTrackingInput] = useState('MED-');
  const [phoneInput, setPhoneInput] = useState(''); 
  const [activeOrder, setActiveOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTrackingId, setSuccessTrackingId] = useState('');

  // -------------------------------------------------------------
  // PART 1: ORDER PLACEMENT & UNIQUE TRACKING ID GENERATOR
  // -------------------------------------------------------------
  const handlePlaceOrder = async () => {
    if (!customerInfo || !cartItems || cartItems.length === 0) {
      alert('Cart or Customer details are missing!');
      return;
    }

    setIsSubmitting(true);

    try {
      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const newTrackingId = `MED-${randomDigits}`;

      const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      const { error } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: customerInfo.name,
            phone: customerInfo.phone,
            address: customerInfo.address,
            city: customerInfo.city,
            total_amount: totalAmount,
            status_step: 1,
            status_text: 'Pending',
            estimated_delivery: 'Tomorrow',
            rider_name: 'Pending Assignment',
            rider_phone: 'N/A',
            items: {
              cart: cartItems,
              shipping: {
                tracking_code: newTrackingId,
                name: customerInfo.name,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city,
                payment_method: 'Cash on Delivery'
              }
            }
          }
        ]);

      if (error) {
        console.error('Supabase Error:', error.message);
        alert('Order placement failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setSuccessTrackingId(newTrackingId);
      alert(`Order Placed Successfully! Your Tracking ID is: ${newTrackingId}`);

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const queryId = trackingInput.trim().toUpperCase();
    const queryPhone = normalizePhone(phoneInput);

    if (!/^MED-\d+$/.test(queryId) || !/^3\d{9}$/.test(phoneInput)) {
      setErrorMessage('Enter a valid Tracking ID after MED- and exactly 10 digits after +92.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*');

      if (error) {
        throw error;
      }

      console.log('Fetched Orders from DB:', orders);

      const foundOrder = (orders || []).find((order) => {
        const trackingCode = order.items?.shipping?.tracking_code || order.id;
        const dbId = String(trackingCode || '').trim().toUpperCase();
        
        const storedPhone = order.phone || order.items?.shipping?.phone;
        const dbPhone = normalizePhone(storedPhone);
        
        return dbId === queryId && dbPhone === queryPhone;
      });

      if (!foundOrder) {
        setActiveOrder(null);
        setErrorMessage('Invalid Tracking ID or Phone Number. Please check your details.');
      } else {
        const shipping = foundOrder.items?.shipping || {};
        const currentStatus = foundOrder.status || foundOrder.status_text || 'Pending';
        const normalizedStatus = String(currentStatus).toLowerCase();
        const statusStep = normalizedStatus === 'delivered' || normalizedStatus === 'completed'
          ? 5
          : normalizedStatus === 'cancelled' || normalizedStatus === 'canceled'
            ? 1
            : foundOrder.status_step || 1;
        const formattedOrder = {
          id: shipping.tracking_code || foundOrder.id,
          customer_name: foundOrder.customer_name || shipping.name,
          phone: foundOrder.phone || shipping.phone,
          address: foundOrder.address || shipping.address,
          city: foundOrder.city || shipping.city,
          total_amount: foundOrder.total_amount,
          subtotal: Number(shipping.subtotal || foundOrder.subtotal || 0),
          delivery_fee: Number(shipping.shipping_fee ?? foundOrder.shipping_fee ?? 0),
          status_step: statusStep,
          estimated_delivery: foundOrder.estimated_delivery || 'Tomorrow',
          status_text: currentStatus,
          items: Array.isArray(foundOrder.items) ? foundOrder.items : (foundOrder.items?.cart || [])
        };
        
        setActiveOrder(formattedOrder);
        setErrorMessage('');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setErrorMessage('No order found or verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Order Placed', desc: 'Received at pharmacy' },
    { number: 2, title: 'Pharmacist Verified', desc: 'Prescription & stock checked' },
    { number: 3, title: 'Packed & Dispatched', desc: 'Temperature controlled packing' },
    { number: 4, title: 'Out for Delivery', desc: 'Rider on the way to you' },
    { number: 5, title: 'Delivered', desc: 'Order completed safely' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="soft-card w-full max-w-2xl bg-[#f4f8f8] p-6 sm:p-8 relative border border-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl soft-btn text-slate-600 hover:text-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl soft-inset flex items-center justify-center text-blue-600 bg-blue-50">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">
              Live Order & Delivery Tracker
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Enter your tracking ID and registered phone number to view details securely
            </p>
          </div>
        </div>

        {successTrackingId && (
          <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold text-center">
            🎉 Order Successful! Your Tracking ID: <span className="text-blue-600 underline text-sm">{successTrackingId}</span> (Note this down!)
          </div>
        )}

        {/* Secure Tracking Input Search Form (Tracking ID + Phone) */}
        <form onSubmit={handleSearch} className="space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setTrackingInput(value.startsWith('MED-') ? `MED-${value.slice(4).replace(/\D/g, '')}` : 'MED-');
                }}
                aria-label="Tracking number"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl soft-inset-sm text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative flex-1 flex items-center rounded-xl soft-inset-sm bg-white focus-within:ring-2 focus-within:ring-blue-500">
              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <span className="pl-10 pr-1 text-xs font-bold text-slate-700">+92</span>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="3342850819"
                maxLength={10}
                inputMode="numeric"
                aria-label="Phone number without country code"
                className="min-w-0 flex-1 pr-4 py-2.5 bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full soft-btn-primary py-2.5 rounded-xl font-bold text-xs disabled:opacity-50"
          >
            {isLoading ? 'Verifying & Searching...' : 'Securely Track Order'}
          </button>
        </form>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold mb-4 text-center">
            {errorMessage}
          </div>
        )}

        {/* Display Order Details if Found */}
        {activeOrder && (
          <div className="space-y-6">
            
            <div className="p-4 rounded-2xl soft-inset bg-slate-200/50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-300/50 pb-2">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Your Tracking Number</span>
                  <strong className="text-base font-black text-blue-600">{activeOrder.id}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-extrabold text-slate-500 block">Est. Delivery</span>
                  <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-lg">
                    {activeOrder.estimated_delivery}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-teal-50 border border-teal-200 px-3 py-2">
                <span className="text-[10px] uppercase font-extrabold text-teal-700">Current Order Status</span>
                <span className="text-xs font-black text-teal-800">{activeOrder.status_text}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Customer: </span>
                  <strong className="text-slate-800">{activeOrder.customer_name}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Phone: </span>
                  <strong className="text-slate-800">{activeOrder.phone}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500">Delivery Location: </span>
                  <strong className="text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {activeOrder.address}, {activeOrder.city}
                  </strong>
                </div>
              </div>
            </div>

            {/* Ordered Products Section */}
            <div className="p-4 rounded-2xl soft-card bg-white/80 border border-slate-200">
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-blue-600" /> Your Ordered Medicines
              </h4>
              <div className="divide-y divide-slate-100">
                {activeOrder.items && activeOrder.items.map((item, index) => (
                  <div key={index} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">{item.name}</span>
                      <span className="text-[10px] text-slate-500">Quantity: {item.quantity}</span>
                    </div>
                    <span className="font-extrabold text-slate-700">PKR {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 mt-2 pt-2 flex items-center justify-between text-xs font-black text-slate-900">
                <div className="space-y-1 font-semibold text-slate-600">
                  <div>Subtotal:</div>
                  <div>Delivery Charges:</div>
                  <div className="pt-1 text-slate-900">Total Amount:</div>
                </div>
                <div className="space-y-1 text-right">
                  <div>PKR {Number(activeOrder.subtotal || 0).toFixed(2)}</div>
                  <div className={activeOrder.delivery_fee > 0 ? 'text-slate-700' : 'text-emerald-600'}>
                    {activeOrder.delivery_fee > 0 ? `PKR ${activeOrder.delivery_fee.toFixed(2)}` : 'FREE'}
                  </div>
                  <div className="pt-1 text-blue-600">PKR {Number(activeOrder.total_amount || 0).toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" /> Order Progress Status
              </h4>

              <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-300">
                {steps.map((step) => {
                  const currentStepNum = activeOrder.status_step || 1;
                  const isCompleted = step.number <= currentStepNum;
                  const isCurrent = step.number === currentStepNum;

                  return (
                    <div key={step.number} className="relative flex items-start gap-4 z-10 pl-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isCompleted 
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-500/30' 
                          : 'bg-slate-300 text-slate-600'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.number}
                      </div>

                      <div className={`p-3 rounded-xl w-full transition-all ${
                        isCurrent 
                          ? 'soft-card border border-teal-400 bg-teal-50/50' 
                          : 'bg-slate-100/60'
                      }`}>
                        <div className="flex items-center justify-between">
                          <h5 className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                            {step.title}
                          </h5>
                          {isCurrent && (
                            <span className="text-[10px] font-extrabold text-teal-800 bg-teal-200 px-2 py-0.5 rounded-full animate-pulse">
                              Current Step
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
