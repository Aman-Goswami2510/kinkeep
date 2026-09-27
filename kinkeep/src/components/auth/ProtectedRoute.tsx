'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, HeartHandshake, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function ProtectedRouteInner({ children }: { children: React.ReactNode }) {
  const { user, isLoading, signInAsDemo } = useAuth();
  const searchParams = useSearchParams();
  const isDemoParam = searchParams?.get('demo') === 'true';

  useEffect(() => {
    if (!user && !isLoading && isDemoParam) {
      signInAsDemo();
    }
  }, [user, isLoading, isDemoParam, signInAsDemo]);

  if (isLoading || (!user && isDemoParam)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-stone-600">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin"></div>
          <HeartHandshake className="w-6 h-6 text-amber-800 animate-pulse" />
        </div>
        <p className="text-sm font-medium text-stone-500">Unlocking your Family Vault...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-stone-200/80 shadow-xl shadow-stone-200/50 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-800 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">
            Family Vault is Protected
          </h2>
          <p className="text-sm text-stone-600 mb-6 leading-relaxed">
            KinKeep keeps your friends and family details secure and private. Sign in to your account or unlock with instant demo access.
          </p>

          <div className="space-y-3">
            <Link
              href="/auth"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-700 hover:bg-amber-800 active:scale-[0.99] text-white font-medium shadow-md shadow-amber-800/20 transition-all cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => signInAsDemo()}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-stone-100 hover:bg-stone-200/80 active:scale-[0.99] text-stone-700 font-medium transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Instant Demo Access</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-stone-600">
          <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-700 animate-spin mb-3"></div>
          <p className="text-xs text-stone-500 font-medium">Opening Vault...</p>
        </div>
      }
    >
      <ProtectedRouteInner>{children}</ProtectedRouteInner>
    </Suspense>
  );
}
