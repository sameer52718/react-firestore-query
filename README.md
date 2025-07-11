# react-firestore-query

A React hook library that integrates `@tanstack/react-query` with Firebase Firestore for real-time data subscriptions, caching, pagination, optimistic updates, and offline support.

## Installation

```bash
npm install react-firestore-query

Setup

Configure Firebase:Create a .env file with your Firebase configuration:
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id


Wrap Your App with QueryClientProvider:
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { db } from 'react-firestore-query';
import App from './App';

const queryClient = new QueryClient();

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}



Usage
Real-time Data Subscription
import { useFirestoreQuery } from 'react-firestore-query';
import { collection, query, where } from 'firebase/firestore';
import { db } from 'react-firestore-query';

function UsersList() {
  const usersQuery = query(collection(db, 'users'), where('active', '==', true));
  const { data, isLoading, error } = useFirestoreQuery('users', usersQuery);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

Mutations with Optimistic Updates
import { useFirestoreMutation } from 'react-firestore-query';

function AddUser() {
  const { addMutation } = useFirestoreMutation('users', {
    onSuccess: () => console.log('User added'),
    onError: (err) => console.error('Error:', err),
  });

  const handleAdd = () => {
    addMutation.mutate({ name: 'New User', active: true });
  };

  return <button onClick={handleAdd}>Add User</button>;
}

Pagination
import { useState } from 'react';
import { useFirestorePagination } from 'react-firestore-query';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from 'react-firestore-query';

function PaginatedUsers() {
  const [lastDoc, setLastDoc] = useState();
  const usersQuery = query(collection(db, 'users'), orderBy('name'));
  const { data, isLoading } = useFirestorePagination('users', usersQuery, {
    limit: 10,
    startAfter: lastDoc,
  });

  const handleNext = () => {
    if (data?.lastDocument) setLastDoc(data.lastDocument);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <ul>
        {data?.data.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <button onClick={handleNext}>Next Page</button>
    </div>
  );
}

Features

Real-time Subscriptions: Uses Firestore's onSnapshot for live updates.
Caching: Leverages React Query's caching for efficient data fetching.
Pagination: Cursor-based pagination with startAfter and limit.
Optimistic Updates: Supports optimistic UI updates for mutations.
Offline Support: Firestore's built-in offline persistence with React Query integration.
Type Safety: Written in TypeScript for robust type checking.

Notes

Ensure Firestore offline persistence is enabled (it is by default for web apps).
Use includeMetadataChanges in useFirestoreQuery to detect cache vs. server data.
For advanced pagination, manage lastDocument state to navigate pages.

License
MIT
