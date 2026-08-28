import React, { useState } from 'react';
import { FileText, UploadCloud, X, CheckCircle, ShieldAlert, Phone, User, Calendar, FileCheck, Sparkles } from 'lucide-react';
import { savePrescription } from '../services/supabaseClient.js';

export default function PrescriptionUploadModal({ isOpen, onClose, onPrescriptionUploaded }) {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRx, setSubmittedRx] = useState(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a prescription image or document file.');
      return;
    }

    setSubmitting(true);

    const rxRecord = {
      id: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      patientName,
      patientAge,
      patientPhone,
      notes,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      status: 'Pending Review',
      timestamp: new Date().toLocaleString()
    };

    await savePrescription(rxRecord , file);
    setSubmitting(false);
    setSubmittedRx(rxRecord);
    if (onPrescriptionUploaded) onPrescriptionUploaded(rxRecord);
  };

  const resetForm = () => {
    setSubmittedRx(null);
    setPatientName('');
    setPatientAge('');
    setPatientPhone('');
    setNotes('');
    setFile(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="soft-card w-full max-w-xl bg-[#f0f4f8] p-4 sm:p-8 relative border border-white max-h-[90vh] overflow-y-auto">
        
        {!submittedRx ? (
          <div>
            {/* Header with structured flex to prevent overlapping */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl soft-inset flex items-center justify-center text-emerald-600 bg-emerald-50 shrink-0">
                  <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-extrabold text-slate-800 pr-6">
                    Upload Doctor's Prescription
                  </h2>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500">
                    Our licensed pharmacist will review your prescription & fulfill exact medicines
                  </p>
                </div>
              </div>
              {/* Close Button inline or safely placed */}
              <button 
                onClick={resetForm}
                className="p-2 rounded-xl soft-btn text-slate-600 hover:text-slate-900 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Drag and Drop File Upload Area */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`p-4 sm:p-6 rounded-2xl border-2 border-dashed transition-all text-center soft-inset ${
                  dragActive 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : file 
                    ? 'border-teal-500 bg-teal-50/30' 
                    : 'border-slate-300 bg-slate-200/40'
                }`}
              >
                {file ? (
                  <div className="space-y-2">
                    <FileCheck className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600 mx-auto" />
                    <p className="text-xs sm:text-sm font-extrabold text-slate-800 break-all">{file.name}</p>
                    <p className="text-[11px] text-slate-500">{(file.size / 1024).toFixed(1)} KB • Ready for Pharmacist Review</p>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-xs font-bold text-rose-600 hover:underline pt-1"
                    >
                      Remove & Choose another file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 mx-auto" />
                    <p className="text-xs sm:text-sm font-bold text-slate-700">
                      Drag & Drop your prescription here, or <label className="text-teal-700 underline cursor-pointer">browse file</label>
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500">
                      Supports JPG, PNG, PDF formats (Max 10MB)
                    </p>
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleFileChange}
                      className="hidden"
                      id="rx-file-input"
                    />
                    <label 
                      htmlFor="rx-file-input"
                      className="inline-block mt-2 soft-btn px-4 py-1.5 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      Select File
                    </label>
                  </div>
                )}
              </div>

              {/* Patient Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-teal-600" /> Patient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ali Ahmed"
                    className="w-full px-3.5 py-2 rounded-xl soft-inset-sm text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" /> Patient Age / Gender
                  </label>
                  <input
                    type="text"
                    required
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g. 34 yrs / Male"
                    className="w-full px-3.5 py-2 rounded-xl soft-inset-sm text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-teal-600" /> WhatsApp / Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full px-3.5 py-2 rounded-xl soft-inset-sm text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Notes / Doctor Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need 1 month course, substitute with generic if available..."
                  className="w-full px-3.5 py-2 rounded-xl soft-inset-sm text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full soft-btn-primary py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? 'Sending to Pharmacist...' : 'Submit Prescription for Verification'}
              </button>

            </form>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-4 sm:py-6 space-y-4 relative">
            <button 
              onClick={resetForm}
              className="absolute top-0 right-0 p-2 rounded-xl soft-btn text-slate-600 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Prescription Uploaded Successfully!
              </h3>
              <p className="text-xs font-semibold text-slate-600 max-w-md mx-auto">
                Your prescription has been stored & queued for review by our qualified chief pharmacist.
              </p>
            </div>

            <div className="p-4 rounded-2xl soft-inset bg-teal-50/80 text-left space-y-2 border border-teal-200">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Prescription Reference ID:</span>
                <strong className="text-teal-800 font-mono text-xs sm:text-sm">{submittedRx.id}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Patient Name:</span>
                <strong className="text-slate-800">{submittedRx.patientName}</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Review Status:</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] sm:text-[11px]">
                  Pending Pharmacist Call
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Our pharmacist will call you at <strong>{submittedRx.patientPhone}</strong> within 15 minutes to confirm medicine details & delivery address.
            </p>

            <button
              onClick={resetForm}
              className="soft-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs"
            >
              Done & Return to Store
            </button>
          </div>
        )}

      </div>
    </div>
  );
}