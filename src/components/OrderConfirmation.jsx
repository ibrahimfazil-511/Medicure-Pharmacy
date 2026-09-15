import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clipboard, MapPin, Phone, ReceiptText, ShieldCheck, Truck, UserRound, Search, AlertCircle } from 'lucide-react';

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-900">{value || 'Not provided'}</p>
    </div>
  );
}

export default function OrderConfirmation({ order, onContinueShopping }) {
  const [trackInput, setTrackInput] = useState('MED-');
  const [phoneInput, setPhoneInput] = useState('+92');
  const [trackStatus, setTrackStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  if (!order) return null;
  const itemCount = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  // Phone number input handler (+92 prefix maintaining with max 11 digits after +)
  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+92')) {
      val = '+92';
    }
    // Only allow numbers after +92
    const prefix = '+92';
    const rest = val.slice(3).replace(/\D/g, '');
    // Limit rest of digits to 11 (Total string length: 3 + 11 = 14)
    const formatted = prefix + rest.slice(0, 11);
    setPhoneInput(formatted);
  };

  // Tracking ID input handler (MED- prefix maintaining)
  const handleTrackChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('MED-')) {
      val = 'MED-';
    }
    setTrackInput(val);
  };

  // Tracking verification logic
  const handleTrackOrder = (e) => {
    e.preventDefault();
    setTrackStatus(null);
    setErrorMessage('');

    const cleanPhoneInput = phoneInput.trim();
    const cleanTrackInput = trackInput.trim().toUpperCase();
    
    const actualTrackingId = (order.trackingId || '').trim().toUpperCase();
    const actualPhone = (order.phone || '').trim();

    if (cleanTrackInput === 'MED-' || cleanTrackInput.length < 5) {
      setTrackStatus('error');
      setErrorMessage('Please enter a valid Tracking ID.');
      return;
    }

    if (cleanPhoneInput === '+92' || cleanPhoneInput.length < 6) {
      setTrackStatus('error');
      setErrorMessage('Please enter a complete phone number.');
      return;
    }

    // Matching validation
    if (cleanTrackInput === actualTrackingId && cleanPhoneInput === actualPhone) {
      setTrackStatus('success');
    } else {
      setTrackStatus('error');
      setErrorMessage('Invalid Tracking ID or Phone Number. Please check and try again.');
    }
  };

  return (
    <div className="soft-canvas min-h-screen text-slate-800">
      <header className="border-b border-[#d9e6e7] bg-white/90 px-4 py-4 shadow-sm backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-xl font-black text-white">+</div>
            <span className="text-lg font-black text-slate-900">Medi<span className="text-teal-600">Cure</span> Pharmacy</span>
          </div>
          <span className="hidden text-xs font-bold text-slate-500 sm:block">Secure pharmacy checkout</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-5 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <section className="clinic-hero mb-6 rounded-2xl sm:rounded-3xl border border-emerald-200 bg-emerald-50 p-4 sm:p-7">
            <div className="flex flex-col gap-4 sm:gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5 sm:gap-4">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg"><CheckCircle2 className="h-6 w-6 sm:h-7 sm:w-7" /></div>
                <div>
                  <p className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-emerald-700">Order confirmed</p>
                  <h1 className="mt-1 text-xl sm:text-3xl font-black text-slate-900">Thank you, {order.customerName}</h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">Your order has been received and is being prepared for delivery.</p>
                </div>
              </div>
              <div className="rounded-xl bg-white px-4 py-3 shadow-sm shrink-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tracking ID</p>
                <p className="mt-0.5 font-mono text-base sm:text-lg font-black text-teal-700">{order.trackingId}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-5 sm:space-y-6">
              <div className="soft-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
                <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-4"><UserRound className="h-5 w-5 text-teal-600" /><h2 className="text-lg font-black text-slate-900">Customer details</h2></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Detail label="Full name" value={order.customerName} />
                  <Detail label="Email address" value={order.customerEmail} />
                  <Detail label="Phone number" value={order.phone} />
                  <Detail label="Order date" value={order.createdAt} />
                </div>
                <div className="mt-5 border-t border-slate-200 pt-5"><Detail label="Delivery address" value={`${order.shippingAddress}, ${order.city}`} /></div>
              </div>

              <div className="soft-card p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4"><div className="flex items-center gap-2"><ReceiptText className="h-5 w-5 text-teal-600" /><h2 className="text-lg font-black text-slate-900">Ordered items</h2></div><span className="text-xs font-bold text-slate-500">{itemCount} item{itemCount === 1 ? '' : 's'}</span></div>
                <div className="space-y-4">
                  {order.items && order.items.map((item) => (
                    <div key={item.medicine.id} className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <img src={item.medicine.imageUrl} alt={item.medicine.name} className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 bg-slate-50 object-cover" />
                      <div className="min-w-0 flex-1"><p className="font-bold text-slate-900">{item.medicine.name}</p><p className="mt-1 text-xs text-teal-700">{item.medicine.formula || 'Pharmacy product'}</p><p className="mt-1 text-xs font-semibold text-slate-500">Quantity: {item.quantity}</p></div>
                      <p className="text-sm font-black text-slate-900">Rs {(item.medicine.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="soft-card p-5 sm:p-6">
                <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-4"><Clipboard className="h-5 w-5 text-teal-600" /><h2 className="text-lg font-black text-slate-900">Order summary</h2></div>
                <div className="space-y-3 text-sm"><div className="flex justify-between gap-4 text-slate-600"><span>Subtotal</span><strong className="text-slate-900">Rs {order.subtotal?.toFixed(2)}</strong></div><div className="flex justify-between gap-4 text-slate-600"><span>Delivery charges</span><strong className="text-slate-900">{order.shippingFee ? `Rs ${order.shippingFee.toFixed(2)}` : 'FREE'}</strong></div><div className="flex justify-between gap-4 border-t border-slate-200 pt-4 text-base font-black"><span>Total amount</span><strong className="text-teal-700">Rs {order.total?.toFixed(2)}</strong></div></div>
                <div className="mt-5 rounded-xl bg-teal-50 p-4"><p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Payment method</p><p className="mt-1 font-black text-teal-800">{order.paymentMethod}</p></div>
              </div>
              <div className="soft-inset p-5"><div className="flex items-start gap-3"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" /><p className="text-sm font-bold text-slate-800">Expected delivery within 45 minutes</p></div><div className="mt-3 flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" /><p className="text-sm text-slate-600">Our pharmacist will verify prescription items before dispatch.</p></div><div className="mt-3 flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" /><p className="text-sm text-slate-600">Delivering to {order.city}</p></div><div className="mt-3 flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" /><p className="text-sm text-slate-600">Rider will contact you at {order.phone}</p></div></div>
            </aside>
          </div>

          {/* Track Order Form Section */}
          <section className="mt-8 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Truck className="h-6 w-6 text-teal-600" />
              <h2 className="text-xl font-black text-slate-900">Track Your Order</h2>
            </div>

            <form onSubmit={handleTrackOrder} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={handlePhoneChange}
                  maxLength={14}
                  placeholder="+923001234567"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 font-mono text-sm font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Tracking ID
                </label>
                <input
                  type="text"
                  value={trackInput}
                  onChange={handleTrackChange}
                  placeholder="MED-123456"
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 font-mono text-sm font-bold text-slate-900 outline-none focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 active:scale-[0.99]"
                >
                  <Search className="h-4 w-4" />
                  Track Order
                </button>
              </div>
            </form>

            {/* Validation Feedback */}
            {trackStatus === 'error' && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {trackStatus === 'success' && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>Order Found Successfully!</span>
                </div>
                <div className="mt-2 grid gap-1 text-xs sm:text-sm">
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Tracking ID:</strong> {order.trackingId}</p>
                  <p><strong>Status:</strong> Preparing for dispatch / Expected delivery in 45 mins</p>
                </div>
              </div>
            )}
          </section>

          <button onClick={onContinueShopping} className="soft-btn-primary mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold sm:mx-auto sm:w-auto">
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </button>
        </div>
      </main>
    </div>
  );
}