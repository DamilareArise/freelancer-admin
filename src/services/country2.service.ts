import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export interface Country {
	flags: Flags
	name: Name
	cca2: string
	idd: Idd
	flag: string
}

export interface Flags {
	png: string
	svg: string
	alt: string
}

export interface Idd {
	root: string
	suffixes: string[]
}

export interface Name {
	common: string
	official: string
	nativeName: NativeName
}

export interface NativeName {
	eng: Eng
}

export interface Eng {
	official: string
	common: string
}

export const countryApi = createApi({
	reducerPath: 'countryApi',
	baseQuery: fetchBaseQuery({
		baseUrl: `https://restcountries.com/v3.1/`,
	}),

	endpoints: (builder) => ({
		getCountries: builder.query<Country[], string[]>({
			query: (fields) => `all?fields=${fields.join(",")}`,
			transformResponse: (response: Country[]) => response.sort((a, b) => a.name.common.localeCompare(b.name.common))
		}),
	}),
})

export const { useGetCountriesQuery } = countryApi