'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HeartHandshake, 
  ArrowRight, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  Users, 
  Lock,
  Heart,
  ChevronRight,
  BookUser
} from 'lucide-react';
import { Navbar } from '@/components/navigation/Navbar';
import { useAuth } from '@/context/AuthContext';
import type { Variants } from 'framer-motion';

export default function LandingPage() {
  const { user } = useAuth();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-800">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32">
          {/* Subtle Ambient Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute top-4 left-1/4 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl opacity-60" />
            <div className="absolute top-10 right-1/4 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-10 left-1/2 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl opacity-40" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center max-w-3xl mx-auto"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-200/80 text-amber-900 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
                <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                <span>Your Cherished Family & Friends Vault</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.12]"
              >
                Keep Your Loved <br className="hidden sm:inline" />
                <span className="text-amber-800 italic underline decoration-amber-300 decoration-wavy decoration-2">
                  Ones Close
                </span>
                .
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={itemVariants}
                className="mt-6 text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto font-normal"
              >
                A warm, intimate digital directory designed to celebrate your closest ties.
                Reach grandparents, cousins, and lifelong friends in a single tap.
              </motion.p>

              {/* Call to Actions */}
              <motion.div
                variants={itemVariants}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link
                  href={user ? '/directory' : '/auth'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-base shadow-lg shadow-amber-800/25 hover:shadow-xl hover:shadow-amber-800/30 active:scale-[0.98] transition-all duration-200"
                >
                  <Sparkles className="w-5 h-5 text-amber-200" />
                  <span>{user ? 'Open the Family Vault' : 'Login to the Family Vault'}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>

                <Link
                  href="/directory?demo=true"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-700 font-semibold text-base shadow-sm hover:shadow active:scale-[0.98] transition-all duration-200"
                >
                  <Users className="w-4 h-4 text-stone-500" />
                  <span>Explore Directory</span>
                </Link>
              </motion.div>

              {/* Key Trust Signals */}
              <motion.div
                variants={itemVariants}
                className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-stone-500"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Private Row-Level Security
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Protected Supabase Vault
                </span>
                <span className="flex items-center gap-1.5">
                  <BookUser className="w-4 h-4 text-orange-600" />
                  One-Tap Calling & Mail
                </span>
              </motion.div>
            </motion.div>

            {/* VISUAL DIRECTORY PREVIEW CARDS */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="mt-16 sm:mt-24 max-w-5xl mx-auto"
            >
              <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl p-4 sm:p-8 border border-stone-200/90 shadow-2xl shadow-stone-300/40">
                {/* Mock Search Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-100">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-semibold text-stone-500 uppercase tracking-wider font-mono">
                      KinKeep Directory Preview
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-72 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-500">
                    <Search className="w-3.5 h-3.5 text-stone-400" />
                    <span>Search relatives, uncles, cousins...</span>
                  </div>
                </div>

                {/* Grid of Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Card 1 */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3.5 mb-4">
                      {/* Avatar */}
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-100 shadow-sm bg-stone-100">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                          alt="Eleanor Vance"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-stone-900 text-base">Eleanor Vance</h4>
                        <span className="inline-block mt-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                          Grandmother
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 mb-4 truncate">
                      42 Orchard Lane, Greenfield, MA
                    </p>
                    <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                      <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium">
                        <Phone className="w-3 h-3 text-amber-700" />
                        <span>Call</span>
                      </span>
                      <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-50 text-stone-700 text-xs font-medium">
                        <Mail className="w-3 h-3 text-stone-500" />
                        <span>Email</span>
                      </span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-100 shadow-sm bg-stone-100">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                          alt="Marcus Vance"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-stone-900 text-base">Marcus Vance</h4>
                        <span className="inline-block mt-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                          Uncle
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 mb-4 truncate">
                      78 Pinecrest Drive, Seattle, WA
                    </p>
                    <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                      <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium">
                        <Phone className="w-3 h-3 text-amber-700" />
                        <span>Call</span>
                      </span>
                      <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-50 text-stone-700 text-xs font-medium">
                        <Mail className="w-3 h-3 text-stone-500" />
                        <span>Email</span>
                      </span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-100 shadow-sm bg-stone-100">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                          alt="Maya Patel"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-stone-900 text-base">Maya Patel</h4>
                        <span className="inline-block mt-0.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
                          Best Friend
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-500 mb-4 truncate">
                      310 Willow Way, Portland, OR
                    </p>
                    <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                      <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 text-amber-800 text-xs font-medium">
                        <Phone className="w-3 h-3 text-amber-700" />
                        <span>Call</span>
                      </span>
                      <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-50 text-stone-700 text-xs font-medium">
                        <Mail className="w-3 h-3 text-stone-500" />
                        <span>Email</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES HIGHLIGHT SECTION */}
        <section className="py-20 bg-stone-100/50 border-t border-stone-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full">
                Thoughtfully Crafted
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                Everything you need to keep family close
              </h2>
              <p className="mt-4 text-stone-600 text-sm sm:text-base">
                No corporate clutter. Just warm, easy-to-use directory features built to connect you with the people who matter most.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  One-Click Reconnecting
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Call or email any family member directly from their profile card with direct native telephone and mail triggers.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center mb-6">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  Instant Search & Filters
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Find anyone instantly by name, relationship, or location. Filter between cousins, aunts, parents, or close friends effortlessly.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                  Encrypted & Private
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Your family data is sacred. Protected by Supabase Row-Level Security, only authenticated members of your circle can view it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* EMOTIONAL QUOTE / CTA BANNER */}
        <section className="py-20 bg-[#FDFBF7]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-br from-stone-900 to-stone-800 text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Ready to start your vault?
                </span>
                <h3 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
                  Never lose a cousin’s new address or grandma’s number again.
                </h3>
                <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed">
                  Join KinKeep today and bring your extended family directory together in one place.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href={user ? '/directory' : '/auth'}
                  className="inline-flex items-center gap-2 py-4 px-8 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-base shadow-lg shadow-amber-900/40 active:scale-95 transition-all"
                >
                  <span>{user ? 'Go to Directory' : 'Login to Family Vault'}</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-200/80 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="w-4 h-4 text-amber-700" />
            <span className="font-serif font-bold text-stone-800 text-sm">KinKeep</span>
            <span>— Family & Friends Directory</span>
          </div>
          <p>© {new Date().getFullYear()} KinKeep. Built with warmth, care, and privacy.</p>
        </div>
      </footer>
    </div>
  );
}
