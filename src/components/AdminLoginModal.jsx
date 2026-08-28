import React, { useState } from 'react';
import { UserCheck, Lock, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminLoginModal({ isOpen, onClose }) {
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (accountName === 'admin' && password === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      setError('');
      onClose();
      navigate('/admin');
    } else {
      setError('Invalid credentials! (Demo: admin / admin123)');
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 border border-slate-100 my-auto">
        
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header section */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Admin & Staff Portal</h2>
          <p className="text-xs text-slate-500">Sign in securely to access the admin dashboard.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Account Name</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200">
              <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                required
                name="account_name"
                autoComplete="off"
                placeholder="Enter Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                type="password" 
                required
                name="admin_password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-slate-800"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg transition"
          >
            Authenticate & Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginModal;