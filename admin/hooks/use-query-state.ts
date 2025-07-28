import qs from 'qs';
import { useCallback, useEffect, useRef, useState } from 'react';

type QueryValue = Record<string, any>;

type UpdateMethod = 'push' | 'replace';

interface UseQueryStateOptions {
  method?: UpdateMethod; // default is 'replace'
  autoSync?: boolean; // syncs with URL on popstate
  query?: QueryValue; // initial query state
  clearQuery?: boolean;
}

type Updater<T> = (prev: T) => T;

type DeepUpdater<T> = {
  [K in keyof T]?: T[K] extends object
    ? T[K] extends Array<any>
      ? T[K] | Updater<T[K]>
      : DeepUpdater<T[K]> | Updater<T[K]>
    : T[K] | Updater<T[K]>;
};

// === Global Store ===
let globalQuery: QueryValue = typeof window !== 'undefined' ? qs.parse(window.location.search.slice(1)) : {};
const listeners = new Set<(q: QueryValue) => void>();

function notifyAll(newQuery: QueryValue) {
  for (const listener of listeners as any) {
    listener(newQuery);
  }
}

export function useQueryState(initialQuery: QueryValue = {}, options?: UseQueryStateOptions) {
  const { method = 'replace', autoSync = true, clearQuery = false } = options || {};
  const [query, setQuery] = useState<QueryValue>(globalQuery);
  const currentQueryRef = useRef(query);

  const updateUrl = useCallback(
    (newQuery: QueryValue, methodOverride?: UpdateMethod) => {
      const queryString = qs.stringify(newQuery);
      const url = `?${queryString}`;
      const methodToUse = methodOverride || method;

      if (methodToUse === 'push') {
        window.history.pushState({}, '', url);
      } else {
        window.history.replaceState({}, '', url);
      }
    },
    [method]
  );

  function resolveUpdate<T>(prev: T, update: DeepUpdater<T>): T {
    if (typeof update === 'function') {
      return (update as Updater<T>)(prev);
    }

    if (update && typeof update === 'object' && !Array.isArray(update)) {
      const result: Partial<T> = { ...prev };

      for (const key in update) {
        const prevValue = prev?.[key];
        const updateValue = update[key];

        result[key] = resolveUpdate(prevValue, updateValue as any);
      }

      return result as T;
    }

    return update as T;
  }

  const setQueryState = useCallback(
    (updater: DeepUpdater<QueryValue> | ((prev: QueryValue) => QueryValue), methodOverride?: UpdateMethod) => {
      const nextQuery = typeof updater === 'function' ? updater(globalQuery) : resolveUpdate(globalQuery, updater);

      globalQuery = nextQuery;
      currentQueryRef.current = nextQuery;

      updateUrl(nextQuery, methodOverride);
      notifyAll(nextQuery);
    },
    [updateUrl]
  );

  const getQuery = useCallback(() => {
    return currentQueryRef.current;
  }, []);

  // Update local state when global query changes
  useEffect(() => {
    const listener = (newQuery: QueryValue) => {
      currentQueryRef.current = newQuery;
      setQuery(newQuery);
    };

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Sync with browser history back/forward
  useEffect(() => {
    if (!autoSync) return;

    const handlePopState = () => {
      const parsed = qs.parse(window.location.search.slice(1));
      globalQuery = parsed;
      notifyAll(parsed);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [autoSync]);

  useEffect(() => {
    const hasInitialQuery = initialQuery && Object.keys(initialQuery).length > 0;

    if (hasInitialQuery) {
      globalQuery = clearQuery ? { ...initialQuery } : { ...globalQuery, ...initialQuery };

      currentQueryRef.current = globalQuery;
      setQuery(globalQuery);
      updateUrl(globalQuery);
      notifyAll(globalQuery);
    }
  }, []);

  return {
    query,
    setQuery: setQueryState,
    getQuery,
    updateUrl,
    queryString: qs.stringify(query),
  };
}
