import React, { useState, useEffect } from 'react';
import { getSupabase } from '../services/supabaseClient';
import { Package, ShoppingBag, FileText, Mail, Plus, Trash2, CheckCircle, ShieldCheck, LogOut, ArrowLeft, Percent, Upload, X, Edit3, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomerOrders from './CustomerOrders.jsx';

const supabase = getSupabase();

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('products');
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [inquiries, setInquiries] = useState([]); // State for Inquiries
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null); // Modal state for inquiry details
  const [editingId, setEditingId] = useState(null); 
  const navigate = useNavigate();
  
  // New / Edit Medicine Form State
  const [newMed, setNewMed] = useState({
    name: '',
    formula: '',
    company: '',
    category: '',
    price: '',
    stock: '',
    discount: '',
    image_url: '',
    description: ''
  });

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    if (activeTab === 'products') {
      const { data } = await supabase.from('medicines').select('*');
      if (data) setMedicines(data);
    } else if (activeTab === 'orders') {
      const { data } = await supabase.from('orders').select('*');
      if (data) setOrders(data);
    } else if (activeTab === 'prescriptions') {
      const { data } = await supabase.from('prescriptions').select('*');
      if (data) setPrescriptions(data);
    } else if (activeTab === 'inquiries') {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (data) setInquiries(data);
      if (error) console.error('Error fetching inquiries:', error.message);
    }
  };

  // Image File Upload Handler
  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('medicines')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('medicines').getPublicUrl(filePath);
      
      setNewMed({ ...newMed, image_url: data.publicUrl });
      alert('Image uploaded successfully!');
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle Add or Update Medicine
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: newMed.name,
      formula: newMed.formula,
      company: newMed.company,
      category: newMed.category,
      price: parseFloat(newMed.price),
      stock: parseInt(newMed.stock),
      discount: newMed.discount ? parseFloat(newMed.discount) : 0,
      image_url: newMed.image_url,
      description: newMed.description
    };

    if (editingId) {
      const { error } = await supabase
        .from('medicines')
        .update(payload)
        .eq('id', editingId);

      if (!error) {
        alert('Medicine updated successfully!');
        setEditingId(null);
        setNewMed({ name: '', formula: '', company: '', category: '', price: '', stock: '', discount: '', image_url: '', description: '' });
        fetchAdminData();
      } else {
        alert('Error updating medicine: ' + error.message);
      }
    } else {
      const { error } = await supabase.from('medicines').insert([payload]);

      if (!error) {
        alert('Medicine added successfully!');
        setNewMed({ name: '', formula: '', company: '', category: '', price: '', stock: '', discount: '', image_url: '', description: '' });
        fetchAdminData();
      } else {
        alert('Error adding medicine: ' + error.message);
      }
    }
  };

  const handleEditClick = (med) => {
    setEditingId(med.id);
    setNewMed({
      name: med.name || '',
      formula: med.formula || '',
      company: med.company || '',
      category: med.category || '',
      price: med.price || '',
      stock: med.stock || '',
      discount: med.discount || '',
      image_url: med.image_url || '',
      description: med.description || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewMed({ name: '', formula: '', company: '', category: '', price: '', stock: '', discount: '', image_url: '', description: '' });
  };

  const handleDeleteMedicine = async (id) => {
    const { error } = await supabase.from('medicines').delete().eq('id', id);
    if (!error) {
      setMedicines(medicines.filter(med => med.id !== id));
    }
  };

  // Delete Inquiry Handler
  const handleDeleteInquiry = async (id) => {
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (!error) {
      alert('Inquiry deleted successfully!');
      setInquiries(inquiries.filter(item => item.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    } else {
      alert('Error deleting inquiry: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/');
  };

  return (
    <div className="soft-canvas min-h-screen p-3 sm:p-6 lg:p-8 font-sans text-slate-800 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="soft-card flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">MediCure Admin Dashboard</h1>
              <p className="text-xs text-slate-500">Manage your pharmacy inventory, orders, and client prescriptions.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => navigate('/')}
              className="flex flex-1 sm:flex-initial justify-center items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </button>
            <button
              onClick={handleLogout}
              className="flex flex-1 sm:flex-initial justify-center items-center gap-2 px-3 sm:px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition border border-rose-100"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white/60 p-2 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'products' 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
                : 'bg-transparent text-slate-600 hover:bg-white/80 hover:text-teal-700'
            }`}
          >
            <Package className="w-4 h-4" /> Manage Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'orders' 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
                : 'bg-transparent text-slate-600 hover:bg-white/80 hover:text-teal-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Customer Orders
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'prescriptions' 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
                : 'bg-transparent text-slate-600 hover:bg-white/80 hover:text-teal-700'
            }`}
          >
            <FileText className="w-4 h-4" /> Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all relative ${
              activeTab === 'inquiries' 
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
                : 'bg-transparent text-slate-600 hover:bg-white/80 hover:text-teal-700'
            }`}
          >
            <Mail className="w-4 h-4" /> Inquiries
            {inquiries.length > 0 && (
              <span className="ml-1 bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {inquiries.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content: Manage Products */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 h-fit space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                    {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div> 
                  {editingId ? 'Edit Medicine' : 'Add New Medicine'}
                </h2>
                {editingId && (
                  <button onClick={handleCancelEdit} className="text-[11px] font-bold text-rose-600 hover:underline">
                    Cancel
                  </button>
                )}
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Medicine Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Panadol Extra"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs outline-none text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Formula</label>
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol / Caffeine"
                    value={newMed.formula}
                    onChange={(e) => setNewMed({ ...newMed, formula: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs outline-none text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. GSK / Pfizer"
                    value={newMed.company}
                    onChange={(e) => setNewMed({ ...newMed, company: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs outline-none text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={newMed.category}
                    onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs outline-none text-slate-800"
                    required
                  >
                    <option value="" disabled>Select product category</option>
                    <option value="medicines">Medicines</option>
                    <option value="personal-care">Personal Care</option>
                    <option value="baby-care">Baby Care</option>
                    <option value="lifestyle">Lifestyle & Fitness</option>
                    <option value="organic">Organic</option>
                    <option value="devices">Healthcare Devices</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Price (PKR)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newMed.price}
                      onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs outline-none text-slate-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Stock Qty</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={newMed.stock}
                      onChange={(e) => setNewMed({ ...newMed, stock: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs outline-none text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Percent className="w-3 h-3 text-teal-600" /> Discount (%)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      value={newMed.discount}
                      onChange={(e) => setNewMed({ ...newMed, discount: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs outline-none text-slate-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Upload className="w-3 h-3 text-teal-600" /> Product Image
                    </label>
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={newMed.image_url}
                      onChange={(e) => setNewMed({ ...newMed, image_url: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs outline-none text-slate-800"
                    />
                    <p className="text-[10px] text-slate-500">Use an image URL or choose an image from your folder.</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-800 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {uploading && <p className="text-[10px] text-teal-600 font-bold mt-1">Uploading image...</p>}
                    {newMed.image_url && (
                      <div className="mt-2 flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50/60 p-2">
                        <img
                          src={newMed.image_url}
                          alt="Selected product preview"
                          className="h-14 w-14 rounded-lg object-cover border border-white shadow-sm"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <p className="text-[10px] text-emerald-700 font-bold truncate">Image ready to save</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    placeholder="Brief description..."
                    value={newMed.description}
                    onChange={(e) => setNewMed({ ...newMed, description: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs outline-none text-slate-800 h-20 resize-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-lg shadow-teal-500/20 transition mt-2"
                >
                  {editingId ? 'Update Medicine' : 'Save Medicine to Inventory'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 overflow-x-auto">
              <h2 className="text-lg font-black text-slate-900 mb-4">Inventory List</h2>
              <table className="w-full text-left border-collapse text-xs table-fixed min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3 w-[60px]">Image</th>
                    <th className="p-3 w-[130px]">Name</th>
                    <th className="p-3 w-[100px]">Formula</th>
                    <th className="p-3 w-[80px]">Company</th>
                    <th className="p-3 w-[80px]">Category</th>
                    <th className="p-3 w-[70px]">Price</th>
                    <th className="p-3 w-[70px]">Discount</th>
                    <th className="p-3 w-[70px]">Stock</th>
                    <th className="p-3 w-[90px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {medicines.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-8 text-slate-400">No medicines found in database.</td>
                    </tr>
                  ) : (
                    medicines.map((med) => (
                      <tr key={med.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3">
                          {med.image_url ? (
                            <img 
                              src={med.image_url} 
                              alt="" 
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0 cursor-pointer hover:opacity-80 shadow-sm" 
                              onClick={() => setSelectedImage(med.image_url)}
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-400 shrink-0">No</div>
                          )}
                        </td>
                        <td className="p-3 font-bold text-slate-800 truncate" title={med.name}>{med.name}</td>
                        <td className="p-3 text-slate-500 truncate" title={med.formula}>{med.formula}</td>
                        <td className="p-3 text-slate-600 font-medium truncate" title={med.company}>{med.company || '-'}</td>
                        <td className="p-3 text-slate-600 font-medium truncate" title={med.category}>{med.category || '-'}</td>
                        <td className="p-3 font-semibold text-teal-700 truncate">PKR {med.price}</td>
                        <td className="p-3 truncate">
                          {med.discount && Number(med.discount) > 0 ? (
                            <span className="px-2 py-0.5 rounded-xl bg-amber-50 text-amber-700 font-bold text-[10px]">
                              {med.discount}% OFF
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-3 truncate">
                          <span className={`px-2 py-1 rounded-xl text-[10px] font-bold inline-block ${
                            med.stock > 10 ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {med.stock} left
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleEditClick(med)}
                            className="p-2 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-100 transition inline-flex items-center justify-center"
                            title="Edit Item"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteMedicine(med.id)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition inline-flex items-center justify-center"
                            title="Delete Item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Customer Orders */}
        {activeTab === 'orders' && <CustomerOrders />}

        {/* Tab Content: Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-900 mb-4">Uploaded Prescriptions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {prescriptions.length === 0 ? (
                <div className="col-span-full text-center py-8 text-slate-400 text-xs">No prescriptions uploaded yet.</div>
              ) : (
                prescriptions.map((item) => (
                  <div key={item.id} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-xs text-slate-800 truncate">User: {item.patient_name || item.user_name || 'Anonymous'}</p>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-xs text-slate-800 truncate">Phone: {item.patient_phone || 'N/A'}</p>
                      </div>
                      {item.file_name ? (
                        <div 
                          className="w-full h-32 rounded-xl overflow-hidden bg-white border border-slate-200 cursor-pointer group relative"
                          onClick={() => setSelectedImage(item.file_name)}
                        >
                          <img src={item.file_name} alt="Prescription" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
                            Click to Zoom
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {item.file_name && (
                      <button 
                        onClick={() => setSelectedImage(item.file_name)}
                        className="text-teal-600 hover:text-teal-700 text-[11px] font-bold truncate text-left bg-teal-50 hover:bg-teal-100 p-2 rounded-xl transition block w-full mt-2"
                        title={item.file_name}
                      >
                        🔗 {item.file_name}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-900 mb-4">Customer Inquiries</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inquiries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-400">No inquiries found in the database.</td>
                    </tr>
                  ) : (
                    inquiries.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-bold text-slate-800">#{item.id}</td>
                        <td className="p-3 font-bold text-slate-800">{item.name}</td>
                        <td className="p-3 text-slate-600">{item.phone || 'N/A'}</td>
                        <td className="p-3 text-slate-500">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => setSelectedInquiry(item)}
                            className="p-2 rounded-xl bg-teal-50 text-teal-600 hover:bg-teal-100 transition inline-flex items-center justify-center"
                            title="View Message"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(item.id)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition inline-flex items-center justify-center"
                            title="Delete Inquiry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="soft-card bg-white p-4 rounded-2xl max-w-2xl w-full relative shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 truncate max-w-[90%] font-mono">{selectedImage}</h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="w-full max-h-[75vh] overflow-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
              <img src={selectedImage} alt="Preview" className="max-w-full max-h-[70vh] object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="soft-card bg-white p-6 rounded-2xl max-w-lg w-full relative shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Inquiry #{selectedInquiry.id}</h3>
                <p className="text-[10px] text-slate-400">Received on {selectedInquiry.created_at ? new Date(selectedInquiry.created_at).toLocaleString() : 'N/A'}</p>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-full bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3 text-xs">
              <p><strong className="text-slate-400 uppercase tracking-wider block mb-0.5">Name</strong> <span className="text-slate-800 font-bold text-sm">{selectedInquiry.name}</span></p>
              <p><strong className="text-slate-400 uppercase tracking-wider block mb-0.5">Phone</strong> <span className="text-slate-800 font-bold text-sm">{selectedInquiry.phone || 'N/A'}</span></p>
              <div>
                <strong className="text-slate-400 uppercase tracking-wider block mb-1">Message</strong>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed text-xs">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}