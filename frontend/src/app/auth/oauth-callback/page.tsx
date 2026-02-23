'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const name = searchParams.get('name');
    
    if (token) {
      localStorage.setItem('token', token);
      if (role) localStorage.setItem('role', role);
      if (name) localStorage.setItem('username', decodeURIComponent(name));
      router.push('/dashboard');
    } else {
      router.push('/auth?error=OAuthFailed');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-800">Authenticating...</h2>
        <p className="text-slate-500">Please wait while we log you in securely.</p>
      </div>
    </div>
  );
}
