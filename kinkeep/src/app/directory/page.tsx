'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Contact, ContactFormData } from '@/types/contact';
import { 
  fetchContacts, 
  createContact, 
  updateContact as apiUpdateContact, 
  deleteContact as apiDeleteContact,
  seedDemoContacts 
} from '@/lib/contactsService';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/navigation/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ContactCard } from '@/components/contacts/ContactCard';
import { ContactModal } from '@/components/contacts/ContactModal';
import { DeleteConfirmModal } from '@/components/contacts/DeleteConfirmModal';
import { EmptyState } from '@/components/contacts/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Heart,
  RefreshCw
} from 'lucide-react';

export default function DirectoryPage() {
  const { user } = useAuth();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load contacts
  const loadContacts = async () => {
    setIsLoading(true);
    const { data } = await fetchContacts();
    setContacts(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  // Filtered contacts calculation
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.full_name?.toLowerCase().includes(q) ||
        c.relationship?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone_number?.toLowerCase().includes(q) ||
        c.address?.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedTag === 'All') return true;
      if (selectedTag === 'Friends') {
        return c.relationship?.toLowerCase().includes('friend');
      }
      if (selectedTag === 'Family') {
        return !c.relationship?.toLowerCase().includes('friend');
      }
      return c.relationship?.toLowerCase() === selectedTag.toLowerCase();
    });
  }, [contacts, searchQuery, selectedTag]);

  // Handle Save (Add or Edit)
  const handleSaveContact = async (formData: ContactFormData, id?: string) => {
    if (id) {
      // Update
      const { data, error } = await apiUpdateContact(id, formData);
      if (error || !data) {
        throw new Error(error || 'Failed to update contact');
      }
      setContacts((prev) => prev.map((item) => (item.id === id ? data : item)));
      showToast(`${data.full_name} was updated successfully.`);
    } else {
      // Add
      const { data, error } = await createContact(formData, user?.id);
      if (error || !data) {
        throw new Error(error || 'Failed to create contact');
      }
      setContacts((prev) => [data, ...prev]);
      showToast(`${data.full_name} was added to your Family Vault!`);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingContact) return;
    setIsDeleting(true);
    const { success } = await apiDeleteContact(deletingContact.id);
    setIsDeleting(false);

    if (success) {
      setContacts((prev) => prev.filter((c) => c.id !== deletingContact.id));
      showToast(`${deletingContact.full_name} was removed from directory.`);
      setDeletingContact(null);
    }
  };

  const openAddModal = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSeedContacts = () => {
    const seeded = seedDemoContacts();
    setContacts(seeded);
    showToast('Vault populated with 6 demo loved ones!');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-800">
        <Navbar />

        {/* TOAST NOTIFICATION */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-2.5 py-3 px-4 rounded-2xl bg-stone-900 text-white shadow-xl text-xs font-medium border border-stone-800"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* TOP BAR / VAULT HERO */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-stone-200/70">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-2">
                <Heart className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                <span>Private Family Vault</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                Family & Friends Directory
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                {contacts.length} {contacts.length === 1 ? 'loved one' : 'loved ones'} safely kept in your vault.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleSeedContacts}
                title="Load sample demo contacts"
                className="inline-flex items-center gap-1.5 py-2.5 px-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200/80 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Load Sample Contacts</span>
              </button>

              <button
                type="button"
                onClick={loadContacts}
                title="Refresh directory"
                className="p-3 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200/80 text-stone-600 hover:text-stone-900 transition-colors shadow-xs cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-amber-700 hover:bg-amber-800 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-amber-800/20 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Loved One</span>
              </button>
            </div>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="py-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, relationship, city, or phone..."
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-200/90 rounded-2xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Filter Tag Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {['All', 'Family', 'Friends', 'Grandmother', 'Mother', 'Father', 'Cousin'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CONTACTS GRID / STATES */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 border border-stone-200/80 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-stone-200" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-stone-200 rounded w-2/3" />
                      <div className="h-3 bg-stone-100 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-stone-100 rounded w-4/5" />
                    <div className="h-3 bg-stone-100 rounded w-3/5" />
                  </div>
                  <div className="h-9 bg-stone-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredContacts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2"
            >
              <AnimatePresence>
                {filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onEdit={openEditModal}
                    onDelete={(c) => setDeletingContact(c)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyState
              isSearchActive={Boolean(searchQuery || selectedTag !== 'All')}
              searchQuery={searchQuery}
              onAddNew={openAddModal}
              onSeedDemo={handleSeedContacts}
              onClearSearch={() => {
                setSearchQuery('');
                setSelectedTag('All');
              }}
            />
          )}
        </main>

        {/* ADD / EDIT MODAL */}
        <ContactModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveContact}
          initialContact={editingContact}
        />

        {/* DELETE CONFIRMATION MODAL */}
        <DeleteConfirmModal
          isOpen={Boolean(deletingContact)}
          contact={deletingContact}
          onClose={() => setDeletingContact(null)}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </div>
    </ProtectedRoute>
  );
}
