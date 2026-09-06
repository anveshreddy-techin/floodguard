'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MissingPersonsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/incidents');
  }, [router]);

  return null;
}

