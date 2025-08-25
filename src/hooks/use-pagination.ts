import { useState } from "react";

const usePagination = <T> ({ limit, items }: { limit: number, items: T[] }) => {
	// for pagination
	const [itemOffset, setItemOffset] = useState(0);
	// Simulate fetching items from another resources.
	// (This could be items from props; or items loaded in a local state
	// from an API endpoint with useEffect and useState)
	const endOffset = itemOffset + limit;
	// console.log(`Loading items from ${itemOffset} to ${endOffset}`);
	const currentItems = items.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(items.length / limit);

	// Invoke when user click to request another page.
	const changePage = (pageNum: number) => {
		const newOffset = (pageNum * limit) % items.length;
		// console.log(
		// 	`User requested page number ${pageNum}, which is offset ${newOffset}`
		// );
		setItemOffset(newOffset);


	};

	return { currentItems, pageCount, changePage, itemOffset }
}

export default usePagination