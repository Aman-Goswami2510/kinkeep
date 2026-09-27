'use client';

import React, { useState } from 'react';
import { Contact } from '@/types/contact';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Pencil, 
  Trash2, 
  Copy, 
  Check, 
  ExternalLink,
  Heart
} from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

// Generate consistent soft warm color badge for relationship
function getRelationshipBadgeColor(relationship: string): { bg: string; text: string; border: string } {
  const rel = (relationship || '').toLowerCase();
  if (rel.includes('mother') || rel.includes('father') || rel.includes('parent')) {
    return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' };
  }
  if (rel.includes('grand') || rel.includes('elder')) {
    return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
  }
  if (rel.includes('sister') || rel.includes('brother') || rel.includes('sibling')) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
  }
  if (rel.includes('cousin') || rel.includes('aunt') || rel.includes('uncle')) {
    return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' };
  }
  if (rel.includes('friend') || rel.includes('best')) {
    return { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' };
  }
  return { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' };
}

// Fallback initials generator
function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [imageError, setImageError] = useState(false);

  const badgeColors = getRelationshipBadgeColor(contact.relationship);

  const handleCopy = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -15 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Avatar + Relationship Badge + Actions */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            {/* Circular Avatar */}
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-stone-100 shadow-sm bg-gradient-to-tr from-amber-100 to-orange-50 shrink-0">
              {contact.photo_url && !imageError ? (
                <img
                  src={contact.photo_url}
                  alt={contact.full_name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-lg font-bold text-amber-800">
                  {getInitials(contact.full_name)}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight group-hover:text-amber-800 transition-colors">
                {contact.full_name}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeColors.bg} ${badgeColors.text} ${badgeColors.border}`}
                >
                  {contact.relationship}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Edit/Delete buttons */}
          <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(contact)}
              title="Edit contact"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(contact)}
              title="Remove contact"
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contact Details List */}
        <div className="space-y-2 mt-4 text-xs text-stone-600">
          {contact.phone_number ? (
            <div className="flex items-center justify-between group/phone py-1 px-2 rounded-lg hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-2 truncate">
                <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{contact.phone_number}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(contact.phone_number || '', 'phone')}
                title="Copy phone"
                className="opacity-0 group-hover/phone:opacity-100 p-1 text-stone-400 hover:text-stone-700 transition-opacity cursor-pointer"
              >
                {copiedPhone ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-stone-400 py-1 px-2 italic">
              <Phone className="w-3.5 h-3.5 opacity-40 shrink-0" />
              <span>No phone number listed</span>
            </div>
          )}

          {contact.email ? (
            <div className="flex items-center justify-between group/email py-1 px-2 rounded-lg hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(contact.email || '', 'email')}
                title="Copy email"
                className="opacity-0 group-hover/email:opacity-100 p-1 text-stone-400 hover:text-stone-700 transition-opacity cursor-pointer"
              >
                {copiedEmail ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-stone-400 py-1 px-2 italic">
              <Mail className="w-3.5 h-3.5 opacity-40 shrink-0" />
              <span>No email provided</span>
            </div>
          )}

          {contact.address && (
            <div className="flex items-start gap-2 py-1 px-2 text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-relaxed">{contact.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* ONE-CLICK CALL & EMAIL ACTIONS */}
      <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2.5">
        {contact.phone_number ? (
          <a
            href={`tel:${contact.phone_number}`}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 active:scale-[0.98] text-amber-900 text-xs font-semibold transition-all shadow-xs"
          >
            <Phone className="w-3.5 h-3.5 text-amber-700" />
            <span>Call</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-50 text-stone-300 text-xs font-semibold cursor-not-allowed"
          >
            <Phone className="w-3.5 h-3.5 text-stone-300" />
            <span>Call</span>
          </button>
        )}

        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200/80 active:scale-[0.98] text-stone-800 text-xs font-semibold transition-all shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-stone-600" />
            <span>Email</span>
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-50 text-stone-300 text-xs font-semibold cursor-not-allowed"
          >
            <Mail className="w-3.5 h-3.5 text-stone-300" />
            <span>Email</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
