
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Truck,
  CreditCard,
  Smartphone,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveOrder, sendOrderEmail } from '../services/supabaseClient.js';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenPrescription,
  onOrderCompleted
}) {
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Karachi');
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Payment Method States
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'jazzcash' | 'easypaisa' | 'card' | 'bank'
  const [walletSenderNumber, setWalletSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Card Payment States
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  // Bank Transfer States
  const [bankRefId, setBankRefId] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.medicine.price * item.quantity,
    0
  );

  // Delivery Fee Logic:
  // Karachi orders below 5000 have Rs 150 delivery fee.
  // Karachi orders 5000 or above have FREE delivery.
  let shippingFee = 0;

  if (city === 'Karachi') {
    shippingFee = subtotal >= 5000 ? 0 : 150;
  } else {
    shippingFee = 250;
  }

  const total =
    subtotal + (shippingFee !== null ? shippingFee : 0);

  const rxItems = cartItems.filter(
    (item) => item.medicine.requiresPrescription
  );

  const hasRx = rxItems.length > 0;

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const getCardBrand = (num) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'American Express';
    if (/^6(011|5)/.test(clean)) return 'Discover';
    return null;
  };

  const handleWhatsAppOrder = () => {
    const items = cartItems
      .map((item) => `${item.medicine.name} (${item.quantity}x)`)
      .join(', ');
    const message = `Salam MediCure Pharmacy! I want to order: ${items}. Total: PKR ${total.toFixed(2)}. Please contact me for delivery details.`;
    window.open(
      `https://wa.me/923342850819?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    // Validate online payment methods
    if (paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') {
      if (!transactionId.trim()) {
        setOrderError(`Please enter your ${paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Transaction ID (TID) after sending the payment.`);
        return;
      }
    } else if (paymentMethod === 'card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setOrderError('Please enter a valid 16-digit debit or credit card number.');
        return;
      }
      if (cardExpiry.length < 5) {
        setOrderError('Please enter card expiry in MM/YY format.');
        return;
      }
      if (cardCvv.length < 3) {
        setOrderError('Please enter a valid 3 or 4 digit CVV security code.');
        return;
      }
    } else if (paymentMethod === 'bank') {
      if (!bankRefId.trim()) {
        setOrderError('Please enter your Bank / Raast transfer reference ID.');
        return;
      }
    }

    setPlacing(true);
    setOrderError(null);

    const trackingId = `MED-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    // Prepare human-readable payment method title & details
    let paymentMethodTitle = 'Cash on Delivery';
    let paymentDetails = null;

    if (paymentMethod === 'jazzcash') {
      paymentMethodTitle = 'JazzCash (Mobile Account)';
      paymentDetails = {
        channel: 'JazzCash',
        senderNumber: walletSenderNumber || phone,
        transactionId: transactionId.trim(),
        merchantNumber: '0334-2850819',
        verified: false
      };
    } else if (paymentMethod === 'easypaisa') {
      paymentMethodTitle = 'EasyPaisa (Mobile Account)';
      paymentDetails = {
        channel: 'EasyPaisa',
        senderNumber: walletSenderNumber || phone,
        transactionId: transactionId.trim(),
        merchantNumber: '0334-2850819',
        verified: false
      };
    } else if (paymentMethod === 'card') {
      paymentMethodTitle = 'Credit / Debit Card';
      paymentDetails = {
        channel: 'Card',
        cardholderName: cardholderName.trim() || customerName,
        cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
        cardBrand: getCardBrand(cardNumber) || 'Visa/Mastercard',
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        verified: true
      };
    } else if (paymentMethod === 'bank') {
      paymentMethodTitle = 'Bank Transfer / Raast';
      paymentDetails = {
        channel: 'Bank Transfer',
        bankName: 'Meezan Bank Ltd',
        referenceId: bankRefId.trim(),
        verified: false
      };
    } else {
      paymentDetails = {
        channel: 'Cash on Delivery',
        verified: false
      };
    }

    const orderObj = {
      customerName,
      customerEmail: customerEmail
        ? customerEmail.trim()
        : null,
      phone: phone ? `+92${phone}` : '',
      shippingAddress: address,
      city,
      items: cartItems,
      subtotal,
      shippingFee: shippingFee !== null ? shippingFee : 0,
      total,
      paymentMethod: paymentMethodTitle,
      paymentDetails,
      prescriptionId: localStorage.getItem('medicure_last_prescription_id'),
      trackingId,
      createdAt: new Date().toLocaleString()
    };

    const result = await saveOrder(orderObj);

    setPlacing(false);

    if (!result.success) {
      setOrderError(
        typeof result.error === 'string'
          ? result.error
          : 'Database error saving order.'
      );
      return;
    }

    const finalizedOrder = {
      ...orderObj,
      id: result.id,
      trackingId: result.trackingId || trackingId
    };

    if (finalizedOrder.customerEmail) {
      sendOrderEmail(finalizedOrder.id, finalizedOrder).then((emailResult) => {
        if (!emailResult.success) {
          console.warn(
            '[CartDrawer] Order saved, but automated email was not delivered:',
            emailResult.error
          );
        } else {
          console.log('[CartDrawer] Automated order confirmation email dispatched to:', finalizedOrder.customerEmail);
        }
      });
    }

    setCompletedOrder(finalizedOrder);

    onClearCart();

    onOrderCompleted?.(finalizedOrder);

    navigate('/order-confirmation');

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

      {/* Background Overlay */}
      <div
        className="absolute inset-0"
        onClick={handleCloseAll}
      />

      {/* Drawer Wrapper */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">

        {/* Main Drawer */}
        <div
          className="
            w-screen
            max-w-full
            sm:max-w-md
            soft-card
            bg-[#f4f8f8]
            p-4
            sm:p-6
            flex
            flex-col
            relative
            border-l
            border-white
            overflow-hidden
            animate-in
            h-full
            pointer-events-auto
            shadow-2xl
          "
        >

          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-300 shrink-0">

            <div className="flex items-center gap-2 min-w-0">

              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 shrink-0" />

              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 truncate">
                Your Pharmacy Cart
              </h2>

            </div>

            <button
              onClick={handleCloseAll}
              className="p-2 rounded-xl soft-btn text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

          {/* ================= CONTENT ================= */}

          {!completedOrder ? (

            !isCheckingOut ? (

              /* ================= CART LIST VIEW ================= */
              <div className="flex-1 min-h-0 overflow-y-auto py-3 sm:py-4 space-y-3 sm:space-y-4 no-scrollbar">

                {/* Prescription Warning */}
                {hasRx && (
                  <div className="p-3 rounded-xl bg-amber-100/90 text-amber-900 text-xs font-bold space-y-1 soft-inset-sm border border-amber-300">

                    <div className="flex items-center gap-1.5">

                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />

                      <span>
                        Prescription Required Items in Cart
                      </span>

                    </div>

                    <p className="text-[11px] font-normal text-slate-700">
                      You have {rxItems.length} prescription item(s).
                      Our pharmacist will verify your prescription upon
                      delivery or you can upload it beforehand.
                    </p>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenPrescription();
                      }}
                      className="text-xs text-teal-800 underline font-bold pt-1 block hover:text-teal-950"
                    >
                      Upload Prescription Now &rarr;
                    </button>

                  </div>
                )}

                {/* Empty Cart */}
                {cartItems.length === 0 ? (

                  <div className="text-center py-12 sm:py-16 space-y-3">

                    <ShoppingBag className="w-14 h-14 sm:w-16 sm:h-16 text-slate-300 mx-auto" />

                    <p className="text-sm font-bold text-slate-600">
                      Your cart is currently empty
                    </p>

                    <p className="text-xs text-slate-400">
                      Search medicine by name or formula to add items
                    </p>

                  </div>

                ) : (

                  /* Cart Items */
                  cartItems.map((item) => (

                    <div
                      key={item.medicine.id}
                      className="p-2.5 sm:p-3 rounded-2xl soft-card bg-slate-100 flex items-center justify-between gap-2.5 sm:gap-3 border border-white"
                    >

                      <img
                        src={item.medicine.imageUrl}
                        alt={item.medicine.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover soft-inset shrink-0"
                      />

                      <div className="flex-1 min-w-0">

                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {item.medicine.name}
                        </h4>

                        <p className="text-[11px] text-teal-700 font-semibold truncate">
                          {item.medicine.formula}
                        </p>

                        <span className="text-xs font-black text-slate-900">
                          PKR {(item.medicine.price * item.quantity).toFixed(2)}
                        </span>

                      </div>

                      {/* Quantity + Remove */}
                      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">

                        <div className="flex items-center rounded-lg soft-inset p-0.5">

                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.medicine.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 rounded font-bold text-slate-700 flex items-center justify-center text-xs active:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="w-5 sm:w-6 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.medicine.id,
                                item.quantity + 1
                              )
                            }
                            className="w-6 h-6 rounded font-bold text-slate-700 flex items-center justify-center text-xs active:bg-slate-200"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>

                        </div>

                        <button
                          onClick={() =>
                            onRemoveItem(item.medicine.id)
                          }
                          className="p-1.5 text-rose-500 hover:text-rose-700 active:scale-95 transition-all rounded-lg"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </div>

                  ))
                )}

              </div>

            ) : (

              /* ================= CHECKOUT VIEW ================= */
              <form
                onSubmit={handlePlaceOrder}
                className="
                  flex-1
                  min-h-0
                  overflow-y-auto
                  py-3
                  sm:py-4
                  space-y-4
                  flex
                  flex-col
                  no-scrollbar
                "
              >

                {/* Checkout Fields */}
                <div className="space-y-3.5 sm:space-y-4">

                  <h3 className="text-sm font-extrabold text-slate-800">
                    Delivery & Checkout Information
                  </h3>

                  {/* Error */}
                  {orderError && (
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">

                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />

                      <div>

                        <strong className="block font-bold">
                          Failed to place order:
                        </strong>

                        <span>{orderError}</span>

                      </div>

                    </div>
                  )}

                  {/* ================= NAME ================= */}
                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Customer Name{' '}
                      <span className="text-rose-500">*</span>
                    </label>

                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) =>
                        setCustomerName(e.target.value)
                      }
                      placeholder="e.g. Ibrahim Fazil"
                      className="w-full px-3.5 py-2.5 sm:py-2 rounded-xl soft-inset-sm text-sm sm:text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                  </div>

                  {/* ================= EMAIL ================= */}
                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address{' '}
                      <span className="text-rose-500">*</span>
                    </label>

                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) =>
                        setCustomerEmail(e.target.value)
                      }
                      placeholder="e.g. ibrahim@example.com"
                      className="w-full px-3.5 py-2.5 sm:py-2 rounded-xl soft-inset-sm text-sm sm:text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />

                  </div>

                  {/* ================= PHONE ================= */}
                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number (For Rider){' '}
                      <span className="text-rose-500">*</span>
                    </label>

                    <div className="flex items-center rounded-xl soft-inset-sm bg-white focus-within:ring-2 focus-within:ring-teal-500">

                      <span className="px-3 text-xs sm:text-sm font-bold text-slate-600 shrink-0">
                        +92
                      </span>

                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) =>
                          setPhone(
                            e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 10)
                          )
                        }
                        placeholder="334 2850819"
                        pattern="3[0-9]{9}"
                        title="Enter a 10-digit Pakistani mobile number starting with 3"
                        className="w-full rounded-r-xl bg-transparent px-3 py-2.5 sm:py-2 text-sm sm:text-xs focus:outline-none"
                      />

                    </div>

                  </div>

                  {/* ================= ADDRESS ================= */}
                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Delivery Address{' '}
                      <span className="text-rose-500">*</span>
                    </label>

                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) =>
                        setAddress(e.target.value)
                      }
                      placeholder="House/Apartment #, Street, Sector/Area"
                      className="w-full px-3.5 py-2.5 sm:py-2 rounded-xl soft-inset-sm text-sm sm:text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    />

                  </div>

                  {/* ================= CITY ================= */}
                  <div>

                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City <span className="text-rose-500">*</span>
                    </label>

                    <select
                      required
                      value={city}
                      onChange={(e) =>
                        setCity(e.target.value)
                      }
                      className="w-full px-3.5 py-2.5 sm:py-2 rounded-xl soft-inset-sm text-sm sm:text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >

                      <option value="">
                        Select City
                      </option>

                      <option value="Karachi">
                        Karachi
                      </option>

                      <option value="Lahore">
                        Lahore
                      </option>

                      <option value="Islamabad">
                        Islamabad
                      </option>

                      <option value="Rawalpindi">
                        Rawalpindi
                      </option>

                      <option value="Faisalabad">
                        Faisalabad
                      </option>

                      <option value="Multan">
                        Multan
                      </option>

                    </select>

                  </div>

                  {/* ================= PAYMENT METHOD SELECTION ================= */}
                  <div className="p-3.5 bg-white/70 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                        Payment Method
                      </label>
                      <span className="flex items-center gap-1 text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        <Lock className="w-3 h-3" /> 256-bit Secure
                      </span>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* COD */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('cod');
                          setOrderError(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${paymentMethod === 'cod'
                            ? 'bg-teal-50/90 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <Truck className={`w-4 h-4 mt-0.5 ${paymentMethod === 'cod' ? 'text-teal-600' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">Cash on Delivery</p>
                          <p className="text-[10px] text-slate-500">Pay when order arrives</p>
                        </div>
                      </button>

                      {/* JazzCash */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('jazzcash');
                          setOrderError(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${paymentMethod === 'jazzcash'
                            ? 'bg-red-50/90 border-red-500 ring-2 ring-red-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <Smartphone className={`w-4 h-4 mt-0.5 ${paymentMethod === 'jazzcash' ? 'text-red-600' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">JazzCash</p>
                          <p className="text-[10px] text-slate-500">Mobile Wallet / App</p>
                        </div>
                      </button>

                      {/* EasyPaisa */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('easypaisa');
                          setOrderError(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${paymentMethod === 'easypaisa'
                            ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <Smartphone className={`w-4 h-4 mt-0.5 ${paymentMethod === 'easypaisa' ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">EasyPaisa</p>
                          <p className="text-[10px] text-slate-500">Mobile Wallet / App</p>
                        </div>
                      </button>

                      {/* Debit / Credit Card */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('card');
                          setOrderError(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${paymentMethod === 'card'
                            ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <CreditCard className={`w-4 h-4 mt-0.5 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">Debit/Credit Card</p>
                          <p className="text-[10px] text-slate-500">Visa / Mastercard</p>
                        </div>
                      </button>

                      {/* Bank Transfer */}
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('bank');
                          setOrderError(null);
                        }}
                        className={`col-span-2 p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${paymentMethod === 'bank'
                            ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <Building2 className={`w-4 h-4 mt-0.5 ${paymentMethod === 'bank' ? 'text-purple-600' : 'text-slate-400'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-900 leading-tight">Direct Bank Transfer / Raast</p>
                          <p className="text-[10px] text-slate-500">Meezan Bank &bull; Instant Raast ID</p>
                        </div>
                      </button>
                    </div>

                    {/* CONDITIONAL SUB-FORM: JAZZCASH / EASYPAISA */}
                    {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-200">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Transfer To:</span>
                            <span className="font-bold text-slate-900">
                              {paymentMethod === 'jazzcash' ? 'JazzCash Account' : 'EasyPaisa Account'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Account Title:</span>
                            <span className="font-bold text-teal-800">MediCure Pharmacy</span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                            <span className="text-slate-500">Account Number:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 text-xs">03342850819</span>
                              <button
                                type="button"
                                onClick={() => handleCopy('03342850819')}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                                title="Copy number"
                              >
                                {copiedAccount ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600">
                          Transfer <strong>PKR {total.toFixed(2)}</strong> to the account above and enter your Transaction ID (TID) below:
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Your Sender Mobile No.
                            </label>
                            <input
                              type="text"
                              value={walletSenderNumber}
                              onChange={(e) => setWalletSenderNumber(e.target.value)}
                              placeholder="03xx-xxxxxxx"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">
                              Transaction ID (TID) <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="e.g. 029384729182"
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONDITIONAL SUB-FORM: DEBIT/CREDIT CARD */}
                    {paymentMethod === 'card' && (
                      <div className="p-3.5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-md space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="font-semibold">Card Payment Gateway</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {getCardBrand(cardNumber) || 'Card Verified'}
                          </span>
                        </div>

                        {/* Card Number */}
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1">
                            Card Number
                          </label>
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4000 1234 5678 9010"
                            maxLength={19}
                            className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-xs font-mono tracking-widest focus:ring-2 focus:ring-teal-400 focus:outline-none"
                          />
                        </div>

                        {/* Name on Card */}
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Name as on card"
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-xs uppercase focus:ring-2 focus:ring-teal-400 focus:outline-none"
                          />
                        </div>

                        {/* Expiry & CVV */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              required
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-300 mb-1">
                              CVV / CVC
                            </label>
                            <input
                              type="password"
                              required
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              placeholder="123"
                              maxLength={4}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-xs font-mono focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-300 pt-1 border-t border-slate-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                          <span>Encrypted end-to-end with 3D-Secure 2.0 authorization</span>
                        </div>
                      </div>
                    )}

                    {/* CONDITIONAL SUB-FORM: BANK TRANSFER */}
                    {paymentMethod === 'bank' && (
                      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-200">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Bank Name:</span>
                            <span className="font-bold text-slate-900">Meezan Bank Limited</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500">Account Title:</span>
                            <span className="font-bold text-teal-800">MediCure Pharmacy</span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                            <span className="text-slate-500">Raast ID / Mobile:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-900 text-xs">03342850819</span>
                              <button
                                type="button"
                                onClick={() => handleCopy('03342850819')}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                                title="Copy Raast ID"
                              >
                                {copiedAccount ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600">
                          Transfer <strong>PKR {total.toFixed(2)}</strong> via Raast or online banking and enter your Bank Reference ID:
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Bank Reference / Transaction ID <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={bankRefId}
                            onChange={(e) => setBankRefId(e.target.value)}
                            placeholder="e.g. FT26019284918"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ================= BACK BUTTON ================= */}
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 block pt-1 font-semibold cursor-pointer"
                  >
                    &larr; Back to Cart List
                  </button>
                </div>

                {/* ================= CONFIRM BUTTON ================= */}
                <div
                  className="
                    pt-4
                    pb-2
                    shrink-0
                    bottom-0
                    bg-[#f4f8f8]
                  "
                >
                  <div className="mb-3 p-3 rounded-xl bg-slate-100 text-xs flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Total Payable:</span>
                    <strong className="text-sm font-black text-teal-800">PKR {total.toFixed(2)}</strong>
                  </div>

                  <button
                    type="submit"
                    disabled={placing}
                    className="
                      w-full
                      soft-btn-primary
                      py-3
                      sm:py-3.5
                      rounded-xl
                      font-bold
                      text-sm
                      shadow-lg
                      flex
                      items-center
                      justify-center
                      gap-2
                      disabled:opacity-50
                      active:scale-[0.99]
                      transition-all
                      cursor-pointer
                    "
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {placing
                        ? 'Confirming Order...'
                        : 'Confirm & Place Order'}
                    </span>

                  </button>

                </div>

              </form>

            )

          ) : (

            /* ================= ORDER SUCCESS VIEW ================= */
            <div className="flex-1 overflow-y-auto py-8 text-center space-y-4">

              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">

                <CheckCircle2 className="w-10 h-10" />

              </div>

              <h3 className="text-xl font-extrabold text-slate-900">
                Order Placed Successfully!
              </h3>

              <div className="p-4 rounded-2xl soft-inset bg-teal-50/80 text-left space-y-2 border border-teal-200 text-xs">

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Tracking Number:
                  </span>

                  <strong className="text-teal-800 font-mono text-sm">
                    {completedOrder.trackingId}
                  </strong>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Total Paid:
                  </span>

                  <strong className="text-slate-900 font-black">
                    Rs {completedOrder.total.toFixed(2)}
                  </strong>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Payment:
                  </span>

                  <span className="text-slate-800 font-bold">
                    {completedOrder.paymentMethod || 'Cash on Delivery'}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Estimated Arrival:
                  </span>

                  <span className="text-emerald-700 font-bold">
                    Within 45 Minutes
                  </span>

                </div>

              </div>

              <p className="text-xs text-slate-500">

                You can track this order anytime using tracking ID{' '}

                <strong className="text-slate-800">
                  {completedOrder.trackingId}
                </strong>{' '}

                in the 'Track Order' section.

              </p>

            </div>

          )}

          {/* ================= CART SUMMARY ================= */}
          {cartItems.length > 0 &&
            !completedOrder &&
            !isCheckingOut && (

              <div className="pt-4 border-t border-slate-300 space-y-3 shrink-0">

                <div className="space-y-1.5 text-xs font-semibold text-slate-600">

                  {/* Subtotal */}
                  <div className="flex justify-between">

                    <span>
                      Subtotal
                    </span>

                    <span className="text-slate-900 font-bold">
                      Rs {subtotal.toFixed(2)}
                    </span>

                  </div>

                  {/* Delivery */}
                  <div className="flex justify-between">

                    <span>
                      Delivery Charges
                    </span>

                    <span>

                      {city === 'Karachi' ? (

                        shippingFee === 0 ? (

                          <strong className="text-emerald-600 font-bold">
                            FREE (Above Rs 5,000)
                          </strong>

                        ) : (

                          <strong className="text-slate-900 font-bold">
                            Rs 150.00
                          </strong>

                        )

                      ) : (

                        <span className="text-slate-500 font-normal">
                          Calculated / Not Applicable
                        </span>

                      )}

                    </span>

                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-300/60">

                    <span>
                      Total Amount
                    </span>

                    <span className="text-teal-800">
                      Rs {total.toFixed(2)}
                    </span>

                  </div>

                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full rounded-xl border border-emerald-500 py-3 font-bold text-sm text-emerald-700 hover:bg-emerald-50 transition"
                >
                  Order on WhatsApp
                </button>
                <button
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full soft-btn-primary py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                >

                  <span>
                    Proceed to Checkout
                  </span>

                  <ArrowRight className="w-4 h-4" />

                </button>

              </div>

            )}

        </div>

      </div>

    </div>
  );
}