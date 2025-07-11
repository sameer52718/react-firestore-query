
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  Query,
  DocumentSnapshot,
  getDocs,
} from 'firebase/firestore';
import { FirestoreData } from '../types';

export const subscribeToQuery = <T = DocumentData>(
  firestoreQuery: Query<T>,
  includeMetadataChanges: boolean,
  onData: (data: FirestoreData<T>) => void,
  onError: (error: any) => void,
) => {
  return onSnapshot(
    firestoreQuery,
    { includeMetadataChanges },
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];
      const metadata = {
        fromCache: snapshot.metadata.fromCache,
        hasPendingWrites: snapshot.metadata.hasPendingWrites,
      };
      onData({ data, metadata });
    },
    onError,
  );
};

export const fetchPaginatedData = async <T = DocumentData>(
  firestoreQuery: Query<T>,
  limit: number,
  startAfter?: DocumentSnapshot,
) => {
  let q = firestoreQuery;
  if (startAfter) {
    q = query(firestoreQuery, startAfter);
  }
  q = query(q, limit);
  const snapshot = await getDocs(q);
  return {
    data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as T[],
    lastDocument: snapshot.docs[snapshot.docs.length - 1],
  };
};

export const addDocument = async (collectionPath: string, data: any) => {
  const collectionRef = collection(db, collectionPath);
  return await addDoc(collectionRef, data);
};

export const updateDocument = async (collectionPath: string, id: string, data: any) => {
  const docRef = collection(db, `${collectionPath}/${id}`);
  return await updateDoc(docRef, data);
};

export const deleteDocument = async (collectionPath: string, id: string) => {
  const docRef = collection(db, `${collectionPath}/${id}`);
  return await deleteDoc(docRef);
};