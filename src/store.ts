import { configureStore } from '@reduxjs/toolkit'
import appReducer from "./slices/app.slice";
import { appApi } from './services/app.service';
import { setupListeners } from '@reduxjs/toolkit/query';
import { countryApi } from './services/country.service';

export const store = configureStore({
	reducer: {
		app: appReducer,
		[appApi.reducerPath]: appApi.reducer,
		[countryApi.reducerPath]: countryApi.reducer,
	},

	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(appApi.middleware, countryApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)