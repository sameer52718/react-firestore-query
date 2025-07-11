import { useQuery } from '@tanstack/react-query';
import { Query, DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { fetchPaginatedData } from '../utils/firestoreClient';
import { FirestorePaginationOptions, FirestoreData } from '../types';

export const useFirestorePagination = <T = DocumentData>(
  queryKey: string | string[],
  firestoreQuery: Query<T>,
  options: FirestorePaginationOptions = {},
) => {
  const {
    limit = 10,
    startAfter,
    enabled = true,
    refetchOnWindowFocus = false,
    cacheTime = 5 * 60 * 1000,
    staleTime = 5 * 60 * 1000,
  } = options;

  return useQuery<FirestoreData<T> & { lastDocument?: DocumentSnapshot }, Error>({
    queryKey: [...(Array.isArray(queryKey) ? queryKey : [queryKey]), startAfter?.id],
    queryFn: async () => {
      const { data, lastDocument } = await fetchPaginatedData<T>(
        firestoreQuery,
        limit,
        startAfter,
      );
      return { data, metadata: { fromCache: false, hasPendingWrites: false }, lastDocument };
    },
    enabled,
    refetchOnWindowFocus,
    cacheTime,
    staleTime,
  });
};