// Need to use the React-specific entry point to import createApi
import { AppLocation } from '@/types/ad.type';
import { Role } from '@/types/type';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// const baseUrl = 'https://pokeapi.co/api/v2/';

let _BURL;
if (process.env.NODE_ENV === 'development') {
	// _BURL = "https://6035-102-89-22-40.ngrok-free.app";
	_BURL = "https://service.book-freelancer.com";
} else {
	_BURL = "https://service.book-freelancer.com";
}

export const BURL = _BURL;

// Define a service using a base URL and expected endpoints
export const appApi = createApi({
	reducerPath: 'appApi',
	refetchOnReconnect: true,
	tagTypes: ["Admin", "User", "AdminUser", "Category", "Listing", "SuperAd", "FAQ", "Payment", "PaymentSetting", "Booking", "Conversation", "Chat", "Ticket", "Review", "Notification"],
	baseQuery: fetchBaseQuery({
		baseUrl: `${BURL}/api/v1`,
		prepareHeaders: (headers) => {
			// prepareHeaders: (headers, { getState }) => {
			// Get the token from your state or wherever it's stored
			const token = localStorage.getItem('token');
			// const token = getState().auth.token;
			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
				headers.set('Accept', `application/json`);
				// headers.set('ngrok-skip-browser-warning', `69420`);
			}
			return headers;
		},
	}),

	endpoints: (builder) => ({
		getRoles: builder.query<Role[], string>({
			query: () => `role/`,
		}),
		getAppLocations: builder.query<AppLocation[], string>({
			query: () => ({ url: 'ads/app-locations/' }),
		})
	}),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
	useGetRolesQuery, useGetAppLocationsQuery
} = appApi