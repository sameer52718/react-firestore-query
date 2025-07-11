import { DocumentData, Query, DocumentSnapshot } from 'firebase/firestore';

export interface FirestoreQueryOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  cacheTime?: number;
  staleTime?: number;
  includeMetadataChanges?: boolean;
}

export interface FirestoreMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface FirestorePaginationOptions extends FirestoreQueryOptions {
  limit?: number;
  startAfter?: DocumentSnapshot;
}

export interface FirestoreData<T = DocumentData> {
  data: T[];
  metadata: {
    fromCache: boolean;
    hasPendingWrites: boolean;
  };
}