'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { HeartHandshake, LogOut, Sparkles, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const { user, signOut, isDemoUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/85 backdrop-blur-md border-b border-stone-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-800 text-white flex items-center justify-center shadow-md shadow-amber-800/20 group-hover:scale-105 transition-transform duration-200">
              <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-stone-800">
                Kin<span className="text-amber-700">Keep</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100/70 text-amber-800">
                Vault
              </span>
            </div>
          </Link>

          {/* Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/directory"
              className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors px-3 py-2 rounded-xl hover:bg-stone-100/60"
            >
              Directory
            </Link>

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-stone-200">
                <div className="flex items-center gap-2 bg-stone-100/80 py-1.5 px-3 rounded-full border border-stone-200/60">
                  <div className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center text-xs font-bold">
                    {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-stone-700 max-w-[120px] truncate hidden md:inline-block">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  {isDemoUser && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-medium">
                      Demo
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => signOut()}
                  title="Sign out"
                  className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/auth"
                  className="text-sm font-semibold text-stone-700 hover:text-stone-900 px-3 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/directory"
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold shadow-sm shadow-amber-800/20 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Vault</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
