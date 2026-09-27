'use client';

import React from 'react';
import { HeartHandshake, UserPlus, SearchX, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  isSearchActive: boolean;
  searchQuery?: string;
  onAddNew: () => void;
  onClearSearch?: () => void;
  onSeedDemo?: () => void;
}

export function EmptyState({
  isSearchActive,
  searchQuery,
  onAddNew,
  onClearSearch,
  onSeedDemo,
}: EmptyStateProps) {
  if (isSearchActive) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 px-4 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-stone-200/90 max-w-lg mx-auto"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-bold text-stone-900">
          No matches found
        </h3>
        <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
          We couldn&apos;t find anyone matching &ldquo;{searchQuery}&rdquo;. Try another name or clear your search.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          {onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Clear Filter</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAddNew}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs shadow-amber-800/20 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add This Contact</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 px-4 bg-white/80 backdrop-blur-sm rounded-3xl border border-stone-200/90 max-w-xl mx-auto shadow-sm"
    >
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-100 text-amber-800 flex items-center justify-center mx-auto mb-5 border border-amber-200/60 shadow-inner">
        <HeartHandshake className="w-10 h-10" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-stone-900">
        Your Family Vault is Waiting
      </h3>
      <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
        Start by adding your first loved one, or load the built-in family demo contacts to preview your vault.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onAddNew}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-amber-700 hover:bg-amber-800 active:scale-95 text-white text-sm font-semibold shadow-md shadow-amber-800/25 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Your First Relative</span>
        </button>

        {onSeedDemo && (
          <button
            type="button"
            onClick={onSeedDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200/80 active:scale-95 text-stone-800 text-sm font-semibold border border-stone-200 transition-all cursor-pointer"
          >
            <span>Load 5 Sample Contacts</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
