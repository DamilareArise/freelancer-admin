import { useCallback, useEffect, useMemo, useState } from "react";
import { filter } from "@/lib/helpers";

const useSearch = <T> (data: T[] | null | undefined, searchText: string, keys?: (keyof T)[] | null) => {
	// Memoize the data, searchText, and keys to avoid unnecessary recalculations
	const _data = useMemo(() => data, [data]);
	const _searchText = useMemo(() => searchText, [searchText]);
	const _keys = useMemo(() => keys, [keys]);

	// State to hold the filtered data
	const [filteredData, setFilteredData] = useState<T[]>([]);

	// Memoize the filter function to ensure it has a stable reference
	const ff = useCallback(filter, []);

	// Memoize the filtered data calculation
	const result = useMemo(() => {
		if (!_data) return [];
		return ff(_data, _searchText, _keys);
	}, [_data, _searchText, _keys, ff]);

	// Update the filteredData state only if the result changes
	useEffect(() => {
		setFilteredData(result);
	}, [result]);

	return { data: filteredData };
};

export default useSearch;