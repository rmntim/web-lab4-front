import { configureStore } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Point, PointResult } from "./globals";

type LoginUser = {
    email: string;
    password: string;
};

type LoginUserResult = {
    token: string;
};

type SignupUser = LoginUser & {
    username: string;
};

type SignupUserResult = LoginUserResult;

const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api`,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation<LoginUserResult, LoginUser>({
            query: (user) => ({
                url: `auth/login`,
                method: "POST",
                body: { ...user },
            }),
        }),
        signupUser: builder.mutation<SignupUserResult, SignupUser>({
            query: (user) => ({
                url: `auth/signup`,
                method: "POST",
                body: { ...user },
            }),
        }),
        logoutUser: builder.mutation<void, void>({
            query: () => ({
                url: `auth/logout`,
                method: "POST",
            }),
        }),

        getUserPoints: builder.query<PointResult[], void>({
            query: () => ({
                url: `user/points`,
            }),
        }),
        addUserPoint: builder.mutation<PointResult, Point>({
            query: (point) => ({
                url: `user/points`,
                method: "POST",
                body: { ...point },
            }),
        }),
        deleteAllUserPoints: builder.mutation<void, void>({
            query: () => ({
                url: `user/points`,
                method: "DELETE",
            }),
        }),
        deleteUserPoint: builder.mutation<void, PointResult>({
            query: (point) => ({
                url: "user/points",
                method: "PATCH",
                body: { ...point },
            }),
        }),
    }),
});

export const {
    useLoginUserMutation,
    useSignupUserMutation,
    useLogoutUserMutation,

    useLazyGetUserPointsQuery,
    useAddUserPointMutation,
    useDeleteAllUserPointsMutation,
    useDeleteUserPointMutation,
} = apiSlice;

// Configure the store
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
