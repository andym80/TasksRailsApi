'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export type LoadState = 'loading' | 'ready' | 'missing' | 'error';

// Loads data when the component mounts and whenever `fetcher` changes.
// `reload` asks again without going back to the loading state, so lists do not flicker.
export function useLoad<T>(fetcher: () => Promise<T>) {
  const [result, setResult] = useState<{ state: LoadState; data: T | null }>({ state: 'loading', data: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetcher().then(
      (data) => {
        if (!cancelled) setResult({ state: 'ready', data });
      },
      (error) => {
        if (cancelled) return;
        const missing = axios.isAxiosError(error) && error.response?.status === 404;
        setResult({ state: missing ? 'missing' : 'error', data: null });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [fetcher, version]);

  const reload = useCallback(() => setVersion((value) => value + 1), []);
  const setData = useCallback((update: (data: T) => T) => {
    setResult((current) => (current.data === null ? current : { ...current, data: update(current.data) }));
  }, []);

  return { state: result.state, data: result.data, reload, setData };
}
