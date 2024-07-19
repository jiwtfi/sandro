import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CreateUserRequestBody, CreateUserResponseBody, ListUserQueryParams, ListUserResponseBody, RetrieveCurrentUserResponseBody, RetrieveUserResponseBody } from '../types/users';
import { AddEntryRequestBody, AddEntryResponseBody, Collection, CreateCollectionRequestBody, ListCollectionsResponseBody, ListEntriesParams, ListEntriesResponseBody, RetrieveCollectionResponseBody, RetrieveEntryResponseBody, UpdateCollectionRequestBody, UpdateEntryRequestBody, UpdateEntryResponseBody, WithId } from '../types';
import { RootState } from '../store';

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://api-rn3zleh6ya-uc.a.run.app'
  : 'http://localhost:5001/sandro-20240214/us-central1/api';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const { user } = state.auth;
      if (user) {
        headers.set('Authorization', `Bearer ${user.token}`);
      }
    }
  }),
  tagTypes: ['User', 'Collection', 'Entry'],
  endpoints: builder => ({
    createUser: builder.mutation<CreateUserResponseBody, { body: CreateUserRequestBody; }>({
      query: ({ body }) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: result => [
        ...(result ? [{ type: 'User' as const, id: result.id }] : []),
        { type: 'User', id: 'me' },
        'User'
      ]
    }),
    retrieveCurrentUser: builder.query<RetrieveCurrentUserResponseBody, {}>({
      query: () => ({ url: '/users/me' }),
      providesTags: result => [
        ...(result ? [{ type: 'User' as const, id: result.id }] : []),
        { type: 'User', id: 'me' }
      ]
    }),
    retrieveUser: builder.query<RetrieveUserResponseBody, { userId: string; }>({
      query: ({ userId }) => ({ url: `/users/${userId}` }),
      providesTags: result => result ? [{ type: 'User', id: result.id }] : ['User']
    }),
    listUsers: builder.query<ListUserResponseBody, { params: ListUserQueryParams }>({
      query: ({ params }) => ({ url: '/users', params }),
      providesTags: result => result ? result.map(({ id }) => ({ type: 'User', id })) : ['User']
    }),
    createCollection: builder.mutation<WithId<Collection>, { body: CreateCollectionRequestBody; }>({
      query: ({ body }) => ({ url: '/collections', method: 'POST', body }),
      // invalidatesTags: result => result ? [{ type: 'Collection', id: result.id }] : ['Collection']
      invalidatesTags: ['Collection']
    }),
    retrieveCollection: builder.query<RetrieveCollectionResponseBody, { collectionId: string; }>({
      query: ({ collectionId }) => ({ url: `/collections/${collectionId}` }),
      providesTags: result => result ? [{ type: 'Collection', id: result.id }] : ['Collection']
    }),
    updateCollection: builder.mutation<WithId<Collection>, { collectionId: string; body: UpdateCollectionRequestBody }>({
      query: ({ collectionId, body }) => ({ url: `/collections/${collectionId}`, body, method: 'PATCH' }),
      invalidatesTags: (result, error, arg) => result ? [{ type: 'Collection', id: result.id }] : ['Collection']
    }),
    deleteCollection: builder.mutation<{}, { collectionId: string }>({
      query: ({ collectionId }) => ({ url: `/collections/${collectionId}`, method: 'DELETE' }),
      // invalidatesTags: (result, error, arg) => [
      //   ...(result ? [{ type: 'Collection' as const, id: arg.collectionId }] : []),
      //   'Collection'
      // ],
      invalidatesTags: ['Collection']
    }),
    listCollections: builder.query<ListCollectionsResponseBody, void>({
      query: () => ({ url: `/collections` }),
      providesTags: result => result ? result.map(({ id }) => ({ type: 'Collection', id })) : ['Collection']
    }),
    addEntry: builder.mutation<AddEntryResponseBody, { collectionId: string; body: AddEntryRequestBody; }>({
      query: ({ collectionId, body }) => ({ url: `/collections/${collectionId}/entries`, method: 'POST', body }),
      // invalidatesTags: (result, error, arg) => result ? [{ type: 'Entry', id: `${arg.collectionId}-${result.id}` }] : ['Entry']
      invalidatesTags: ['Entry']
    }),
    updateEntry: builder.mutation<UpdateEntryResponseBody, { collectionId: string; entryId: string; body: UpdateEntryRequestBody; }>({
      query: ({ collectionId, entryId, body }) => ({ url: `/collections/${collectionId}/entries/${entryId}`, method: 'PATCH', body }),
      invalidatesTags: (result, error, arg) => result ? [{ type: 'Entry', id: `${arg.collectionId}-${result.id}` }] : ['Entry']
    }),
    batchAddEntries: builder.mutation<{}, { collectionId: string; body: AddEntryRequestBody[]; }>({
      query: ({ collectionId, body }) => ({ url: `/collections/${collectionId}/entries/batch`, method: 'POST', body })
    }),
    listEntries: builder.query<ListEntriesResponseBody, { collectionId: string; params?: ListEntriesParams; }>({
      query: ({ collectionId, params }) => ({ url: `/collections/${collectionId}/entries`, params }),
      providesTags: (result, error, arg) => result ? result.data.map(({ id }) => ({ type: 'Entry', id: `${arg.collectionId}-${id}` })) : ['Entry']
    }),
    retrieveEntry: builder.query<RetrieveEntryResponseBody, { collectionId: string; entryId: string; }>({
      query: ({ collectionId, entryId }) => ({ url: `/collections/${collectionId}/entries/${entryId}` }),
      providesTags: (result, error, arg) => result ? [{ type: 'Entry', id: `${arg.collectionId}-${result.id}` }] : ['Entry']
    }),
    deleteEntry: builder.mutation<{}, { collectionId: string; entryId: string; }>({
      query: ({ collectionId, entryId }) => ({ url: `/collections/${collectionId}/entries/${entryId}`, method: 'DELETE' }),
      invalidatesTags: ['Entry']
    })
  })
});

export const {
  useCreateUserMutation,
  useRetrieveCurrentUserQuery,
  useRetrieveUserQuery,
  useListUsersQuery,
  useLazyListUsersQuery,
  useCreateCollectionMutation,
  useRetrieveCollectionQuery,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useListCollectionsQuery,
  useAddEntryMutation,
  useUpdateEntryMutation,
  useBatchAddEntriesMutation,
  useListEntriesQuery,
  useLazyListEntriesQuery,
  useRetrieveEntryQuery,
  useDeleteEntryMutation
} = api;