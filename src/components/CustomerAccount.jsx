import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSupabase } from '../services/supabaseClient.js';

export default function CustomerAccount() {
  const navigate = useNavigate();
  const supabase = getSupabase();
  const [session, setSession] = useState(null);
  const [orders, setOrders] = useState([]);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!session?.user?.email) return;
    supabase.from('orders').select('*').eq('customer_email', session.user.email)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setMessage(error.message);
        else setOrders(data || []);
      });
  }, [session, supabase]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    setBusy(false);
    if (result.error) setMessage(result.error.message);
    else setMessage(mode === 'login' ? 'Signed in successfully.' : 'Account created. Check your email if confirmation is enabled.');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setOrders([]);
  };

  return (
    <div className="min-h-screen bg-[#f4f8f8] p-4 sm:p-8">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
        <button onClick={() => navigate('/')} className="mb-5 text-sm font-bold text-teal-700">← Back to shop</button>
        <h1 className="text-2xl font-black text-slate-900">Customer Account</h1>
        {!session ? (
          <form onSubmit={submit} className="mt-6 space-y-3">
            {mode === 'signup' && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border p-3" />}
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl border p-3" />
            <input required minLength={6} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (minimum 6 characters)" className="w-full rounded-xl border p-3" />
            {message && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{message}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-teal-600 p-3 font-bold text-white disabled:opacity-50">{busy ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
            <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="w-full text-sm font-bold text-teal-700">
              {mode === 'login' ? 'Create a new account' : 'Already have an account? Sign in'}
            </button>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between"><p className="text-sm text-slate-600">{session.user.email}</p><button onClick={signOut} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold">Sign out</button></div>
            <h2 className="font-black text-slate-900">Your orders</h2>
            {orders.length === 0 ? <p className="text-sm text-slate-500">No orders found for this account.</p> : orders.map((order) => <div key={order.id} className="rounded-xl border p-3 text-sm"><b>Order #{order.id}</b><span className="ml-3 text-teal-700">{order.status}</span><p>PKR {Number(order.total_amount || 0).toLocaleString()}</p></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
