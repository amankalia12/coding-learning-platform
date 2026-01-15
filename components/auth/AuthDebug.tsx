'use client';

import { useAuth } from '@/components/auth/AuthProvider';

export default function AuthDebug() {
  const { user, loading } = useAuth();

  if (loading) return <div>Checking auth…</div>;

  return (
    <pre className="bg-black text-green-400 p-4 text-xs">
      {JSON.stringify(user, null, 2)}
    </pre>
  );
}
