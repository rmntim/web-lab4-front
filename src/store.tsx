import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Point, PointResult } from "./globals";

// Define the initial state type
interface JwtState {
    token: string | null;
}

// Initial state for the JWT slice
const initialState: JwtState = {
    token: localStorage.getItem("token"),
};

// JWT slice
const jwtSlice = createSlice({
    name: "jwt",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        clearToken: (state) => {
            state.token = null;
            localStorage.removeItem("token");
        },
    },
});

export const { setToken, clearToken } = jwtSlice.actions;

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

// API slice using createApi
const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).jwt.token;
            if (token !== null) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation<LoginUserResult, LoginUser>({
            query: (user) => ({
                url: `auth/login`,
                method: "POST",
                body: { ...user },
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const result = await queryFulfilled;
                dispatch(setToken(result.data.token));
            },
        }),
        signupUser: builder.mutation<SignupUserResult, SignupUser>({
            query: (user) => ({
                url: `auth/signup`,
                method: "POST",
                body: { ...user },
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const result = await queryFulfilled;
                dispatch(setToken(result.data.token));
            },
        }),
        logoutUser: builder.mutation<void, void>({
            query: () => ({
                url: `auth/logout`,
                method: "POST",
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                await queryFulfilled;
                dispatch(clearToken());
            },
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

    useGetUserPointsQuery,
    useAddUserPointMutation,
    useDeleteAllUserPointsMutation,
    useDeleteUserPointMutation,
} = apiSlice;

// Configure the store
const store = configureStore({
    reducer: {
        jwt: jwtSlice.reducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
