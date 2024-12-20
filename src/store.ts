import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Point, PointResult, UserInfo } from "./globals";

type LoginUser = {
    email: string;
    password: string;
};

type SignupUser = LoginUser & {
    username: string;
};

const userStoreInitialState: UserInfo = JSON.parse(
    localStorage.getItem("userStore") ?? "{}"
);

const userSlice = createSlice({
    name: "user",
    initialState: userStoreInitialState,
    reducers: {
        updateUserInfo: (_, action: PayloadAction<UserInfo>) => {
            localStorage.setItem("userStore", JSON.stringify(action.payload));
            return action.payload;
        },
    },
});

type UpdateUserInfo = Omit<UserInfo, "avatarUrl" | "id">;

type UpdatePassword = {
    currentPassword: string;
    newPassword: string;
};

const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api/v1`,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation<UserInfo, LoginUser>({
            query: (user) => ({
                url: `auth/login`,
                method: "POST",
                body: { ...user },
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data: result } = await queryFulfilled;
                dispatch(userSlice.actions.updateUserInfo(result));
            },
        }),
        signupUser: builder.mutation<UserInfo, SignupUser>({
            query: (user) => ({
                url: `auth/signup`,
                method: "POST",
                body: { ...user },
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data: result } = await queryFulfilled;
                dispatch(userSlice.actions.updateUserInfo(result));
            },
        }),
        logoutUser: builder.mutation<void, void>({
            query: () => ({
                url: `auth/logout`,
                method: "POST",
            }),
            onQueryStarted: (_, { dispatch }) => {
                dispatch(
                    userSlice.actions.updateUserInfo(userStoreInitialState)
                );
            },
        }),

        getUserInfo: builder.query<UserInfo, void>({
            query: () => ({
                url: `users`,
            }),
        }),
        getUserInfoById: builder.query<UserInfo, UserInfo["id"]>({
            query: (id) => ({
                url: `users/${id}`,
            }),
        }),
        updateUserInfo: builder.mutation<UserInfo, UpdateUserInfo>({
            query: (user) => ({
                url: `users`,
                method: "PATCH",
                body: { ...user },
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data: result } = await queryFulfilled;
                dispatch(userSlice.actions.updateUserInfo(result));
            },
        }),
        updatePassword: builder.mutation<void, UpdatePassword>({
            query: (user) => ({
                url: `users/password`,
                method: "PATCH",
                body: { ...user },
            }),
        }),
        updateAvatar: builder.mutation<UserInfo, FormData>({
            query: (data) => ({
                url: `users/avatar`,
                method: "POST",
                body: data,
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data: result } = await queryFulfilled;
                dispatch(userSlice.actions.updateUserInfo(result));
            },
        }),
        deleteUser: builder.mutation<void, void>({
            query: () => ({
                url: `users`,
                method: "DELETE",
            }),
        }),

        getUserPoints: builder.query<PointResult[], void>({
            query: () => ({
                url: `points`,
            }),
        }),
        addUserPoint: builder.mutation<PointResult, Point>({
            query: (point) => ({
                url: `points`,
                method: "POST",
                body: { ...point },
            }),
        }),
        deleteAllUserPoints: builder.mutation<void, void>({
            query: () => ({
                url: `points`,
                method: "DELETE",
            }),
        }),
        deleteUserPoint: builder.mutation<void, PointResult>({
            query: (point) => ({
                url: "points",
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

    useLazyGetUserInfoQuery,
    useLazyGetUserInfoByIdQuery,
    useUpdateUserInfoMutation,
    useUpdatePasswordMutation,
    useUpdateAvatarMutation,
    useDeleteUserMutation,

    useLazyGetUserPointsQuery,
    useAddUserPointMutation,
    useDeleteAllUserPointsMutation,
    useDeleteUserPointMutation,
} = apiSlice;

// Configure the store
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        [userSlice.reducerPath]: userSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
