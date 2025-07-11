import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addDocument, updateDocument, deleteDocument } from '../utils/firestoreClient';
import { FirestoreMutationOptions } from '../types';

export const useFirestoreMutation = (
  collectionPath: string,
  options: FirestoreMutationOptions = {},
) => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (data: any) => addDocument(collectionPath, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries([collectionPath]);
      const previousData = queryClient.getQueryData([collectionPath]);
      queryClient.setQueryData([collectionPath], (old: any) => ({
        data: [...(old?.data || []), { id: 'temp', ...data }],
        metadata: { fromCache: true, hasPendingWrites: true },
      }));
      return { previousData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData([collectionPath], context?.previousData);
      options.onError?.(err);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([collectionPath]);
      options.onSuccess?.(data);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateDocument(collectionPath, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries([collectionPath]);
      const previousData = queryClient.getQueryData([collectionPath]);
      queryClient.setQueryData([collectionPath], (old: any) => ({
        data: old?.data.map((item: any) =>
          item.id === id ? { ...item, ...data } : item,
        ),
        metadata: { fromCache: true, hasPendingWrites: true },
      }));
      return { previousData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData([collectionPath], context?.previousData);
      options.onError?.(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([collectionPath]);
      options.onSuccess?.();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(collectionPath, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries([collectionPath]);
      const previousData = queryClient.getQueryData([collectionPath]);
      queryClient.setQueryData([collectionPath], (old: any) => ({
        data: old?.data.filter((item: any) => item.id !== id),
        metadata: { fromCache: true, hasPendingWrites: true },
      }));
      return { previousData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData([collectionPath], context?.previousData);
      options.onError?.(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([collectionPath]);
      options.onSuccess?.();
    },
  });

  return { addMutation, updateMutation, deleteMutation };
};