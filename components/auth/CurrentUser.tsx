'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/components/auth/AuthProvider';

export default function CurrentUser() {
  const { user, loading } = useAuth();

  // ⏳ Still checking session
  if (loading) {
    return null;
  }

  // 👤 Not logged in
  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        Login
      </Link>
    );
  }

  // ✅ Logged in
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/70">
        {user.email}
      </span>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
        }}
        className="text-sm text-red-400 hover:text-red-300"
      >
        Logout
      </button>
    </div>
  );
}
