import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Point, PointResult } from "./globals";

// Define the initial state type
interface JwtState {
    token: string | null;
}

// Initial state for the JWT slice
const initialState: JwtState = {
    token: null,
};

// JWT slice
const jwtSlice = createSlice({
    name: "jwt",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        clearToken: (state) => {
            state.token = null;
        },
    },
});

export const { setToken, clearToken } = jwtSlice.actions;

// API slice using createApi
const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `/api`,
        credentials: "include",
    }),
    endpoints: (builder) => ({
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
    }),
});

export const { useAddUserPointMutation, useDeleteAllUserPointsMutation } =
    apiSlice;

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
