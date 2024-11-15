import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
        baseUrl: `${import.meta.env.API_URL}/api`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).jwt.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUserPoints: builder.query<{ points: number[] }, void>({
            query: () => "user/points",
        }),
    }),
});

export const { useGetUserPointsQuery } = apiSlice;

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
