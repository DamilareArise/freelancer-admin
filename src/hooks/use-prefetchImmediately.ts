import { appApi } from "@/services/app.service"
import { PrefetchOptions } from "@reduxjs/toolkit/query"
import { useEffect } from "react"
import { useAppDispatch } from "./redux.hooks"

type EndpointNames = keyof typeof appApi.endpoints

export function usePrefetchImmediately<T extends EndpointNames> (
	endpoint: T,
	arg: Parameters<(typeof appApi.endpoints)[T]['initiate']>[0],
	options: PrefetchOptions = {},
) {
	const dispatch = useAppDispatch()
	useEffect(() => {
		dispatch(appApi.util.prefetch(endpoint, arg as any, options))
	}, [arg, dispatch, endpoint, options])
}

// In a component
// usePrefetchImmediately('getUser', 5)