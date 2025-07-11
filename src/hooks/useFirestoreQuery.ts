import { useQuery } from '@tanstack/react-query';
import { Query, DocumentData } from 'firebase/firestore';
import { subscribeToQuery } from '../utils/firestoreClient';
import { FirestoreQueryOptions, FirestoreData } from '../types';

export const useFirestoreQuery = <T = DocumentData>(
  queryKey: string | string[],
  firestoreQuery: Query<T>,
  options: FirestoreQueryOptions = {},
) => {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 5 * 60 * 1000, // 5 minutes
    includeMetadataChanges = true,
  } = options;

  return useQuery<FirestoreData<T>, Error>({
    queryKey,
    queryFn: () =>
      new Promise((resolve, reject) => {
        const unsubscribe = subscribeToQuery<T>(
          firestoreQuery,
          includeMetadataChanges,
          resolve,
          reject,
        );
        return () => unsubscribe();
      }),
    enabled,
    refetchOnWindowFocus,
    cacheTime,
    staleTime,
  });
};