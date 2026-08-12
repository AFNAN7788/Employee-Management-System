import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

/**
 * useFetch — generic GET hook built on the central api client.
 *
 * @param {string} url API path, e.g. '/employees'.
 * @param {object} options { params, autoLoad, dependencies }.
 *   - params: query params object.
 *   - autoLoad: whether to fetch immediately (default true).
 *   - dependencies: extra values that should trigger a refetch.
 * @returns {{ data, loading, error, refetch }}
 */
export default function useFetch(url, { params = {}, autoLoad = true, dependencies = [] } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!autoLoad);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, { params });
      // Backend always wraps responses in { success, data, ... }.
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(params)]);

  useEffect(() => {
    if (autoLoad) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, ...dependencies]);

  return { data, loading, error, refetch };
}
