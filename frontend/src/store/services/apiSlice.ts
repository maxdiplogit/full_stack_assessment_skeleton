// Hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Interfaces
import { User, Home } from '../index.ts';

interface UpdateApiResponse {
    message: string,
    homesForUserId: Array<Home>,
};

interface GetAllUsersApiResponse {
    allUsers: User[]
};

interface GetHomesByUserIdApiResponse {
    homesRelatedToUserId: Home[],
    total: number,
    page: number,
    totalPages: number
};

interface GetUsersByHomeIdApiResponse {
    usersRelatedToHomeId: User[]
};

// Define the RTK Qeury API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }), // Adjust base URL as needed
    endpoints: (builder) => ({
        getAllUsers: builder.query<GetAllUsersApiResponse, void>({
            query: () => '/user/find-all',
        }),
        getHomesByUserId: builder.query<GetHomesByUserIdApiResponse, { userId: number; page: number; }>({
            query: ({ userId, page }) => `/home/find-by-user/${ userId }?page=${ page }&limit=${ 50 }`,
        }),
        getUsersByHomeId: builder.query<GetUsersByHomeIdApiResponse, { homeId: number; }>({
            query: (homeId) => `/user/find-by-home/${ homeId }`,
        }),
        updateUsersForHome: builder.mutation<UpdateApiResponse, { homeId: number; selectedUserId: number; newUserIds: Array<number> }>({
            query: ({ homeId, selectedUserId, newUserIds }) => ({
                url: `/home/update-users/${ homeId }`,
                method: 'PUT',
                body: { selectedUserId, newUserIds },
            }),
        }),
    }),
});


// Export hooks for usage in functional components
export const { useGetAllUsersQuery, useGetHomesByUserIdQuery, useGetUsersByHomeIdQuery, useUpdateUsersForHomeMutation } = apiSlice;