import { useState, useEffect, useCallback } from 'react';
import { ChuckNorrisJoke } from '../types/api';
import { RANDOM_JOKE_ENDPOINT } from '../constants/api';

interface UseChuckNorrisResult {
  quote: string | null;
  iconUrl: string | null;
  loading: boolean;
  error: string | null;
  fetchQuote: () => void;
}

export function useChuckNorris(): UseChuckNorrisResult {
  const [quote, setQuote] = useState<string | null>(null);
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(RANDOM_JOKE_ENDPOINT);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data: ChuckNorrisJoke = await response.json();
      if (!data.value) {
        throw new Error('Received an empty quote.');
      }
      setQuote(data.value);
      setIconUrl(data.icon_url ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return { quote, iconUrl, loading, error, fetchQuote };
}
