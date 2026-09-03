import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getSupabase } from '../services/supabaseClient';
import { 
  ShoppingBag, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  DollarSign, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  X, 
  Loader2, 
  Package, 
  Calendar, 
  Filter,
  Mail,
  Eye,
  MessageCircle,
  ExternalLink,
  Printer,
  FileText,
  CreditCard,
  Truck,
  User
} from 'lucide-react';

/**
 * Normalizes raw order statuses to one of three strict allowed values:
 * 'Pending' | 'Cancelled' | 'Delivered'
 */
export const normalizeStatus = (status) => {
  if (!status) return 'Pending';
  const s = String(status).trim().toLowerCase();
  if (s === 'delivered' || s === 'completed') return 'Delivered';
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  return 'Pending';
};

/**
 * Returns Tailwind CSS class mappings for badges and selects based on order status.
 */
export const getStatusTheme = (status) => {
  const normalized = normalizeStatus(status);
  switch (normalized) {
    case 'Delivered':
      return {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        dot: 'bg-emerald-500',
        select: 'bg-emerald-50/80 text-emerald-800 border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500',
        pill: 'bg-emerald-500 text-white',
        icon: CheckCircle2,
      };
    case 'Cancelled':
      return {
        badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
        dot: 'bg-rose-500',
        select: 'bg-rose-50/80 text-rose-800 border-rose-300 focus:ring-rose-500/20 focus:border-rose-500',
        pill: 'bg-rose-500 text-white',
        icon: XCircle,
      };
    case 'Pending':
    default:
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
        dot: 'bg-amber-500',
        select: 'bg-amber-50/80 text-amber-800 border-amber-300 focus:ring-amber-500/20 focus:border-amber-500',
        pill: 'bg-amber-500 text-white',
        icon: Clock,
      };
  }
};

/**
 * Formats phone number into international WhatsApp format and creates a direct prefilled chat link.
 */
export const getWhatsAppLink = (order) => {
  const rawPhone = order.items?.shipping?.phone || order.phone || '';
  if (!rawPhone) return null;

  let cleanPhone = rawPhone.replace(/[^\d+]/g, '');
  if (cleanPhone.startsWith('+')) cleanPhone = cleanPhone.substring(1);
  if (cleanPhone.startsWith('03') && cleanPhone.length === 11) {
    cleanPhone = '92' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('3') && cleanPhone.length === 10) {
    cleanPhone = '92' + cleanPhone;
  }

  const trackingCode = order.items?.shipping?.tracking_code || `MED-${order.id}`;
  const customerName = order.customer_name || 'Valued Customer';
  const status = normalizeStatus(order.status);
  const shipping = order.items?.shipping || {};
  const totalAmount = parseFloat(order.total_amount || 0);
  const items = Array.isArray(order.items?.cart) ? order.items.cart : [];
  const itemNames = items.length
    ? items.map((item) => `${item.name || 'Item'} x${item.quantity || 1}`).join(', ')
    : 'Item details unavailable';
  const itemSubtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const subtotal = Number(shipping.subtotal || order.subtotal || itemSubtotal || totalAmount);
  const deliveryFee = shipping.shipping_fee !== undefined
    ? Number(shipping.shipping_fee)
    : Number(order.shipping_fee || Math.max(0, totalAmount - subtotal));
  const address = shipping.address || order.address || 'Address not provided';
  const city = shipping.city || order.city || 'City not provided';
  const delivery = deliveryFee > 0 ? `PKR ${deliveryFee.toFixed(2)}` : 'FREE';

  const message = `Hello ${customerName}, this is MediCure Pharmacy regarding your order.\n\nOrder ID: #${order.id}\nTracking ID: ${trackingCode}\nCustomer Name: ${customerName}\nOrder Item(s): ${itemNames}\nAddress: ${address}, ${city}\nStatus: ${status}\nSubtotal: PKR ${subtotal.toFixed(2)}\nDelivery Charges: ${delivery}\nTotal Amount: PKR ${totalAmount.toFixed(2)}\n\nOur team is currently preparing your order. Please reply here if you have any questions or need to send additional prescription details.`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

export default function CustomerOrders() {
  // 1. State Management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Toast notification helper
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch orders from Supabase on mount (ordered by created_at DESC)
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = getSupabase();
      console.log('[CustomerOrders] Executing Supabase query: SELECT * FROM orders ORDER BY created_at DESC');

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('[CustomerOrders Fetch Error]:', fetchError);
        throw fetchError;
      }

      console.log('[CustomerOrders] Successfully loaded orders from Supabase:', data);
      setOrders(data || []);

      // If an order modal is open, sync its state
      if (selectedOrder) {
        const updatedSelected = (data || []).find((o) => o.id === selectedOrder.id);
        if (updatedSelected) setSelectedOrder(updatedSelected);
      }
    } catch (err) {
      console.error('[CustomerOrders Catch Error]:', err);
      const msg = err.message || 'Failed to load customer orders from Supabase.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, selectedOrder]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Database Mutation: handleStatusChange
  const handleStatusChange = async (orderId, newStatus) => {
    if (orderId === undefined || orderId === null || !newStatus) return;

    try {
      setUpdatingOrderId(orderId);
      const supabase = getSupabase();
      console.log(`[CustomerOrders] Mutating order ID ${orderId} -> status: "${newStatus}"`);

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (updateError) {
        console.error(`[CustomerOrders Update Error for ID ${orderId}]:`, updateError);
        throw updateError;
      }

      console.log(`[CustomerOrders Update Success] Order ID ${orderId} updated to "${newStatus}"`);

      // Update local state instantly upon successful database update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Update selected order modal if open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }

      // Provide subtle toast feedback to admin
      showToast(`Order #${orderId} marked as "${newStatus}" successfully!`, 'success');
    } catch (err) {
      console.error(`[CustomerOrders Mutation Error] Failed to update order status for ${orderId}:`, err);
      showToast(err.message || 'Database update failed. Please try again.', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Copy tracking / order ID helper
  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard?.writeText(String(id));
    setCopiedId(id);
    showToast(`Order ID #${id} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy full order summary helper
  const handleCopySummary = (order) => {
    if (!order) return;
    const phone = order.items?.shipping?.phone || order.phone || 'N/A';
    const address = order.items?.shipping?.address || 'N/A';
    const city = order.items?.shipping?.city || order.city || 'N/A';
    const itemsList = (order.items?.cart || []).map(i => `- ${i.name} (${i.quantity}x @ PKR ${i.price})`).join('\n') || 'Itemized details on file';

    const text = `MediCure Pharmacy - Order #${order.id}\nCustomer: ${order.customer_name}\nEmail: ${order.customer_email || 'N/A'}\nPhone: ${phone}\nAddress: ${address}, ${city}\nStatus: ${normalizeStatus(order.status)}\nTotal: PKR ${parseFloat(order.total_amount || 0).toFixed(2)}\n\nItems:\n${itemsList}`;
    
    navigator.clipboard?.writeText(text);
    showToast(`Order #${order.id} summary copied!`, 'info');
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const currentNormalized = normalizeStatus(order.status);
      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        currentNormalized.toUpperCase() === selectedStatusFilter.toUpperCase();

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesStatus;

      const orderIdMatch = String(order.id || '').toLowerCase().includes(q);
      const customerMatch = (order.customer_name || '').toLowerCase().includes(q);
      const emailMatch = (order.customer_email || '').toLowerCase().includes(q);
      const phoneMatch = (order.items?.shipping?.phone || order.phone || '').toLowerCase().includes(q);
      const cityMatch = (order.items?.shipping?.city || order.city || '').toLowerCase().includes(q);
      const trackingMatch = (order.items?.shipping?.tracking_code || '').toLowerCase().includes(q);

      return matchesStatus && (orderIdMatch || customerMatch || emailMatch || phoneMatch || cityMatch || trackingMatch);
    });
  }, [orders, selectedStatusFilter, searchQuery]);

  // Summary statistics metrics
  const stats = useMemo(() => {
    const total = orders.length;
    let pendingCount = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;
    let revenue = 0;

    orders.forEach((ord) => {
      const st = normalizeStatus(ord.status);
      if (st === 'Pending') pendingCount++;
      else if (st === 'Delivered') deliveredCount++;
      else if (st === 'Cancelled') cancelledCount++;

      const amt = parseFloat(ord.total_amount) || 0;
      if (st !== 'Cancelled') {
        revenue += amt;
      }
    });

    return { total, pendingCount, deliveredCount, cancelledCount, revenue };
  }, [orders]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:bottom-6 sm:right-6 z-[99999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md text-xs font-bold ${
              toast.type === 'error'
                ? 'bg-rose-900/90 text-rose-50 border-rose-700 shadow-rose-950/20'
                : toast.type === 'info'
                ? 'bg-slate-900/90 text-slate-100 border-slate-700 shadow-slate-950/20'
                : 'bg-emerald-900/90 text-emerald-50 border-emerald-700 shadow-emerald-950/20'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Copy className="w-4 h-4 text-slate-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Orders</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
            <span className="text-[10px] text-slate-500 font-medium">All logged transactions</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Pending</span>
            <div className="text-xl sm:text-2xl font-black text-amber-700 mt-1">{stats.pendingCount}</div>
            <span className="text-[10px] text-slate-500 font-medium">Requires fulfillment</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Delivered</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">{stats.deliveredCount}</div>
            <span className="text-[10px] text-slate-500 font-medium">Fulfilled safely</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Revenue</span>
            <div className="text-xl sm:text-2xl font-black text-teal-700 mt-1">
              PKR {stats.revenue.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Excl. cancelled orders</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="soft-card p-6 sm:p-8 space-y-6">
        
        {/* Header & Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">Manage Customer Orders</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live orders with Supabase synchronization and direct customer WhatsApp actions
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by order ID, name, email, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Manual Refresh Button with Spinning State */}
            <button
              onClick={fetchOrders}
              disabled={loading}
              title="Refresh Orders"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-600' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Orders', count: stats.total },
            { id: 'PENDING', label: 'Pending', count: stats.pendingCount },
            { id: 'DELIVERED', label: 'Delivered', count: stats.deliveredCount },
            { id: 'CANCELLED', label: 'Cancelled', count: stats.cancelledCount }
          ].map((tab) => {
            const isActive = selectedStatusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/20'
                    : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <strong className="block font-bold">Supabase Query Error:</strong>
                <span>{error}</span>
              </div>
            </div>
            <button
              onClick={fetchOrders}
              className="px-3 py-1 rounded-xl bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto animate-spin">
              <Loader2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Loading customer orders...</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fetching records from Supabase database</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 space-y-3 bg-slate-50/60 rounded-2xl border border-slate-100/80">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-700">No customer orders available.</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery || selectedStatusFilter !== 'ALL'
                  ? 'No orders match your active filter or search query. Try clearing filters.'
                  : 'Customer orders placed from the storefront cart will automatically appear here.'}
              </p>
            </div>
            {(searchQuery || selectedStatusFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatusFilter('ALL');
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs transition"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          /* Responsive Table Layout */
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs min-w-[760px]">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200/70 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">ORDER ID</th>
                  <th className="py-3.5 px-4">CUSTOMER</th>
                  <th className="py-3.5 px-4">TOTAL AMOUNT</th>
                  <th className="py-3.5 px-4">STATUS</th>
                  <th className="py-3.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const normalizedStatus = normalizeStatus(order.status);
                  const theme = getStatusTheme(normalizedStatus);
                  const isMutating = updatingOrderId === order.id;

                  // Extract items count
                  const itemsCount = Array.isArray(order.items?.cart)
                    ? order.items.cart.length
                    : Array.isArray(order.items)
                    ? order.items.length
                    : 1;

                  const phone = order.items?.shipping?.phone || order.phone || '';
                  const city = order.items?.shipping?.city || order.city || '';
                  const paymentMethod = order.items?.shipping?.payment_method || order.paymentMethod || 'Cash on Delivery';
                  const waLink = getWhatsAppLink(order);

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={(e) => {
                        // Avoid triggering modal if clicking select or buttons
                        if (['SELECT', 'BUTTON', 'A', 'OPTION', 'INPUT'].includes(e.target.tagName) || e.target.closest('select') || e.target.closest('button') || e.target.closest('a')) {
                          return;
                        }
                        setSelectedOrder(order);
                      }}
                    >
                      {/* ORDER ID Column */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200/60">
                              #{order.id}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyId(order.id);
                              }}
                              title="Copy Order ID"
                              className="p-1 rounded-md text-slate-400 hover:text-teal-600 hover:bg-slate-100 transition opacity-60 group-hover:opacity-100"
                            >
                              {copiedId === order.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {order.created_at && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(order.created_at)}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* CUSTOMER Column */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-teal-100/70 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                            {(order.customer_name || 'Guest')
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="font-bold text-slate-800 truncate flex items-center gap-1.5" title={order.customer_name}>
                              <span>{order.customer_name || 'Guest Customer'}</span>
                            </div>

                            {order.customer_email && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate" title={order.customer_email}>
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{order.customer_email}</span>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                              {phone && (
                                <span className="flex items-center gap-1 font-mono text-slate-600 font-semibold">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  {phone}
                                </span>
                              )}
                              {city && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {city}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* TOTAL AMOUNT Column */}
                      <td className="py-3.5 px-4 align-middle">
                        <div>
                          <span className="font-black text-teal-800 text-sm">
                            PKR {parseFloat(order.total_amount || 0).toFixed(2)}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 font-medium">
                            <span className="text-slate-600 font-bold">{itemsCount} item{itemsCount > 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{paymentMethod}</span>
                          </div>
                        </div>
                      </td>

                      {/* STATUS Column */}
                      <td className="py-3.5 px-4 align-middle">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${theme.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}></span>
                          <span>{normalizedStatus}</span>
                        </span>
                      </td>

                      {/* ACTION Column: WhatsApp, View Details & Select Dropdown */}
                      <td className="py-3.5 px-4 align-middle text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          
                          {/* Direct WhatsApp Quick Button */}
                          {waLink ? (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              title={`Chat with ${order.customer_name || 'Customer'} on WhatsApp`}
                              className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 transition border border-emerald-200 flex items-center gap-1 font-bold text-[11px]"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-50" />
                              <span className="hidden xl:inline">WhatsApp</span>
                            </a>
                          ) : null}

                          {/* View Full Details Eye Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            title="View Full Order & Customer Details"
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200 flex items-center justify-center"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Dynamic Status Dropdown */}
                          {isMutating && (
                            <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                          )}
                          <select
                            value={normalizedStatus}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={isMutating}
                            onClick={(e) => e.stopPropagation()}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer transition shadow-sm ${theme.select} disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            <option value="Pending" className="bg-white text-amber-800 font-bold">
                              Pending
                            </option>
                            <option value="Cancelled" className="bg-white text-rose-800 font-bold">
                              Cancelled
                            </option>
                            <option value="Delivered" className="bg-white text-emerald-800 font-bold">
                              Delivered
                            </option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Customer & Order Details Modal Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="soft-card bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shadow-inner">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">
                      Order #{selectedOrder.id}
                    </h3>
                    {selectedOrder.items?.shipping?.tracking_code && (
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold border">
                        {selectedOrder.items.shipping.tracking_code}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Placed on {formatDate(selectedOrder.created_at)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Status Control & Quick Actions Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Current Status:</span>
                <select
                  value={normalizeStatus(selectedOrder.status)}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none cursor-pointer transition shadow-sm ${getStatusTheme(selectedOrder.status).select}`}
                >
                  <option value="Pending" className="bg-white text-amber-800 font-bold">Pending</option>
                  <option value="Cancelled" className="bg-white text-rose-800 font-bold">Cancelled</option>
                  <option value="Delivered" className="bg-white text-emerald-800 font-bold">Delivered</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Direct WhatsApp Action */}
                {getWhatsAppLink(selectedOrder) && (
                  <a
                    href={getWhatsAppLink(selectedOrder)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Chat on WhatsApp</span>
                  </a>
                )}

                {/* Call Customer */}
                {(selectedOrder.items?.shipping?.phone || selectedOrder.phone) && (
                  <a
                    href={`tel:${selectedOrder.items?.shipping?.phone || selectedOrder.phone}`}
                    className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}

                {/* Copy Summary */}
                <button
                  type="button"
                  onClick={() => handleCopySummary(selectedOrder)}
                  className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition"
                  title="Copy Full Order Summary"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Customer Contact Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>Customer Information</span>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="font-extrabold text-slate-900 text-sm">
                    {selectedOrder.customer_name || 'Guest User'}
                  </div>

                  {selectedOrder.customer_email && (
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${selectedOrder.customer_email}`} className="hover:text-teal-600 underline">
                        {selectedOrder.customer_email}
                      </a>
                    </div>
                  )}

                  {(selectedOrder.items?.shipping?.phone || selectedOrder.phone) && (
                    <div className="flex items-center gap-1.5 text-slate-800 font-bold font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedOrder.items?.shipping?.phone || selectedOrder.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery & Payment Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Truck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Delivery & Payment</span>
                </div>

                <div className="space-y-1 text-xs text-slate-700">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {selectedOrder.items?.shipping?.address || selectedOrder.address || 'Address provided on file'}
                      </span>
                      <span className="text-slate-500">
                        {selectedOrder.items?.shipping?.city || selectedOrder.city || 'Lahore'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 text-slate-600">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">
                      Payment Method: <strong className="text-slate-900">{selectedOrder.items?.shipping?.payment_method || selectedOrder.paymentMethod || 'Cash on Delivery'}</strong>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Itemized Order Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span>Ordered Medicines ({Array.isArray(selectedOrder.items?.cart) ? selectedOrder.items.cart.length : 1})</span>
                </h4>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Item & Formula</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {Array.isArray(selectedOrder.items?.cart) && selectedOrder.items.cart.length > 0 ? (
                      selectedOrder.items.cart.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-800">{item.name}</div>
                            {item.formula && (
                              <div className="text-[10px] text-teal-700 font-semibold">{item.formula}</div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-700">{item.quantity}</td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-600">PKR {parseFloat(item.price || 0).toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-black text-slate-900">
                            PKR {((parseFloat(item.price || 0)) * (parseInt(item.quantity || 1))).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="py-4 px-3 text-center text-slate-400 text-xs">
                          Direct prescription order items on file. Total amount: <strong>PKR {parseFloat(selectedOrder.total_amount || 0).toFixed(2)}</strong>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Summary Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                <span>Ref Tracking: </span>
                <strong className="font-mono text-slate-700">
                  {selectedOrder.items?.shipping?.tracking_code || `MED-${selectedOrder.id}`}
                </strong>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Grand Total Paid</span>
                <span className="text-xl font-black text-teal-800">
                  PKR {parseFloat(selectedOrder.total_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
