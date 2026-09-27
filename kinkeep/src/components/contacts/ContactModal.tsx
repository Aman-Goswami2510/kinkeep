'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Contact, ContactFormData, RELATIONSHIP_PRESETS } from '@/types/contact';
import { uploadContactPhoto } from '@/lib/contactsService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Camera, 
  User, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  AlertCircle,
  Loader2,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContactFormData, id?: string) => Promise<void>;
  initialContact?: Contact | null;
}

export function ContactModal({
  isOpen,
  onClose,
  onSave,
  initialContact,
}: ContactModalProps) {
  const isEditing = Boolean(initialContact);

  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<string>('Cousin');
  const [customRelationship, setCustomRelationship] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [useUrlInput, setUseUrlInput] = useState(false);

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate fields when editing or opening
  useEffect(() => {
    if (initialContact) {
      setFullName(initialContact.full_name || '');
      const isPreset = (RELATIONSHIP_PRESETS as readonly string[]).includes(initialContact.relationship);
      if (isPreset) {
        setRelationship(initialContact.relationship);
        setCustomRelationship('');
      } else {
        setRelationship('Other');
        setCustomRelationship(initialContact.relationship);
      }
      setPhoneNumber(initialContact.phone_number || '');
      setEmail(initialContact.email || '');
      setAddress(initialContact.address || '');
      setPhotoUrl(initialContact.photo_url || '');
    } else {
      setFullName('');
      setRelationship('Cousin');
      setCustomRelationship('');
      setPhoneNumber('');
      setEmail('');
      setAddress('');
      setPhotoUrl('');
    }
    setErrorMsg(null);
    setUseUrlInput(false);
  }, [initialContact, isOpen]);

  // Handle image file selection and upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size should be under 5MB.');
      return;
    }

    setIsUploadingPhoto(true);
    setErrorMsg(null);

    const { url, error } = await uploadContactPhoto(file);
    setIsUploadingPhoto(false);

    if (error || !url) {
      setErrorMsg(error || 'Failed to upload photo.');
    } else {
      setPhotoUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter a full name.');
      return;
    }

    const finalRelationship = relationship === 'Other' 
      ? (customRelationship.trim() || 'Relative')
      : relationship;

    if (!finalRelationship) {
      setErrorMsg('Please select or specify a relationship.');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(
        {
          full_name: fullName.trim(),
          relationship: finalRelationship,
          phone_number: phoneNumber.trim() || null,
          email: email.trim() || null,
          address: address.trim() || null,
          photo_url: photoUrl.trim() || null,
        },
        initialContact?.id
      );
      setIsSubmitting(false);
      onClose();
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Failed to save contact';
      setErrorMsg(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window Container */}
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-lg transform max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 text-left shadow-2xl transition-all border border-stone-200/90 relative z-10"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2">
                <Heart className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                <span>{isEditing ? 'Update Relative Profile' : 'Add to Family Vault'}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                {isEditing ? `Edit ${initialContact?.full_name}` : 'New Loved One'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Fill in their contact details to keep them connected in your directory.
              </p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* PHOTO UPLOAD SECTION */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                {/* Avatar Preview */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-200 bg-white shadow-inner flex items-center justify-center shrink-0">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-stone-300" />
                  )}

                  {/* Upload Spinner Overlay */}
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <p className="text-xs font-semibold text-stone-700">Photo / Avatar</p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 active:scale-95 transition-all shadow-xs cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-stone-500" />
                      <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Image'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUseUrlInput(!useUrlInput)}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium hover:bg-stone-200/70 transition-colors cursor-pointer"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>URL</span>
                    </button>

                    {photoUrl && (
                      <button
                        type="button"
                        onClick={() => setPhotoUrl('')}
                        title="Remove photo"
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {useUrlInput && (
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="Paste image URL (https://...)"
                      className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-stone-200 bg-white focus:outline-amber-600"
                    />
                  )}
                </div>
              </div>

              {/* FULL NAME */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="block w-full pl-10 pr-3 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white text-stone-800"
                  />
                </div>
              </div>

              {/* RELATIONSHIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Relationship <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="block w-full px-3 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white text-stone-800"
                  >
                    {RELATIONSHIP_PRESETS.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                </div>

                {relationship === 'Other' ? (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Specify Custom Tag
                    </label>
                    <input
                      type="text"
                      value={customRelationship}
                      onChange={(e) => setCustomRelationship(e.target.value)}
                      placeholder="e.g. Godparent"
                      className="block w-full px-3 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white text-stone-800"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="block w-full pl-9 pr-3 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white text-stone-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {relationship === 'Other' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="block w-full pl-9 pr-3 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white text-stone-800"
                    />
                  </div>
                </div>
              )}

              {/* EMAIL */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@family.com"
                    className="block w-full pl-10 pr-3 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white text-stone-800"
                  />
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Home / Mailing Address
                </label>
                <div className="relative rounded-xl shadow-xs">
                  <div className="absolute top-2.5 left-3 pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 42 Orchard Lane, Greenfield, MA"
                    className="block w-full pl-10 pr-3 py-2 text-sm bg-stone-50/50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-600 focus:bg-white text-stone-800 resize-none"
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingPhoto}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-amber-700 hover:bg-amber-800 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-amber-800/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200" />
                      <span>{isEditing ? 'Save Changes' : 'Add to Vault'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
