import { AnyObject } from "yup";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getDefault = (inputArr: any[], data: any = null) => {
	// export const getDefault = (inputArr: any[], data: null | { [x: string]: string | number | boolean } = null) => {
	let obj = {}
	inputArr.forEach(({ name, defaultV }) => {
		if (data) {
			obj = { ...obj, [name]: data[name] ?? defaultV ?? "" }
		} else {
			obj = { ...obj, [name]: defaultV ?? "" }
		}
	})
	return obj;
}


export const getUrlWithQParams = (path: string, obj: AnyObject) => {
	let url: string = `${path}?`;
	Object.keys(obj).forEach((each: string) => {
		url += `${each}=${obj[each]}&`
	})
	return url.slice(0, url.length - 1);
}


export const transformValidationResponse = (_response: AnyObject) => {
	// export const transformValidationResponse = (_response: FetchBaseQueryError) => {
	// console.log(_response);

	let response = _response.data;

	if (typeof response == "object" && Array.isArray(Object.values(response)[0])) {
		const messages: string[] = [];
		Object.entries(response).forEach(([key, errorStrings]) => {
			if (Array.isArray(errorStrings)) {
				messages.push(...errorStrings.map((each: string) => each.replace("This field", key).replace("this field", key).slice(0, -1)));
			}
		})
		response.message = joinWords(messages);

	} else if (typeof response?.error == "string") {
		response.message = response.error
	} else if (typeof response?.detail == "string") {
		response.message = response.detail
	} else if (typeof _response.status == "string") {
		response = { message: _response?.status }
	}

	const message = response?.message;
	response.message = message[0].toUpperCase() + message.slice(1)
	return response;
}

export const joinWords = (words: string[]) => {
	const length = words.length;

	if (length === 0) return '';
	if (length === 1) return words[0];
	if (length === 2) return words.join(' and ');

	const allButLast = words.slice(0, -1).join(', ');
	const last = words[length - 1];

	return `${allButLast} and ${last}`;
}

export const keyValue = <T> (obj: { [x: string]: T }): { key: string; value: T }[] => {
	return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
}

// NGN - String.fromCharCode(0x20a6)
export const currencies = {
	"NGN": { symbol: "₦", word: "naira" },
	"USD": { symbol: "$", word: "dollar" },
	"GBP": { symbol: "£", word: "pound" },
	"EUR": { symbol: "€", word: "euro", short: "EUR" },
}

export const currency = currencies["EUR"];

export const toCurrency = (num: string | number = 0, _currency = currency.symbol) => {
	return _currency + Number(num).toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};



type DebounceFunction<T extends (...args: any[]) => void> = (
	func: T,
	delay: number
) => (...args: Parameters<T>) => void;

export const debounce: DebounceFunction<(...args: any[]) => void> = (func, delay) => {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<typeof func>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

export const filter = <T> (items: T[] | null | undefined, searchText: string, filterKeys?: (keyof T)[] | null) => {
	if (!items) return [];
	if (!searchText) return items;
	searchText = searchText.toLowerCase();

	let filteredItems: T[] = [];
	filteredItems = items.filter(each => (
		!filterKeys ?
			JSON.stringify(each).toLowerCase()?.includes(searchText) :
			(filterKeys)?.filter((key) => (
				// Array.isArray(each[key]) ?
				// each[key]?.includes(searchText) :
				JSON.stringify((each)[key])?.toLowerCase()?.includes(searchText)
			)).length
	));
	return filteredItems;
}




export const shortNum = (value: number | string, isAmount = false) => {
	const num = Number(value);
	if (isNaN(num)) return '0';

	const divisions = [
		{ value: 1e12, symbol: 't' },
		{ value: 1e9, symbol: 'b' },
		{ value: 1e6, symbol: 'm' },
		{ value: 1e3, symbol: 'k' }
	];

	const division = divisions.find(d => num >= d.value);

	const formatted = division
		? (num / division.value).toFixed(2).replace(/\.?0+$/, '') + division.symbol
		: num.toString();

	return isAmount ? `${currency.symbol}${formatted}` : formatted;
}


export const pluralize = <T> (val: number | T[], word: string, plural = word + "s") => {
	const _pluralize = (num: number, word: string, plural = word + "s") =>
		[1, -1].includes(Number(num)) ? word : plural;
	// if (typeof val === "object")
	// 	return (num: number, word: string) => _pluralize(num, word, val[word]);
	return _pluralize(Array.isArray(val) ? val.length : val, word, plural);
};


export const ratings = [
	{ label: "1～2 Stars", value: "1_2_stars" },
	{ label: "2～3 Stars", value: "2_3_stars" },
	{ label: "3～4 Stars", value: "3_4_stars" },
	{ label: "4～5 Stars", value: "4_5_stars" },
]





export const shareImageFromUrl = async (imageUrl: string) => {
	try {
		// Fetch the image as a Blob
		const response = await fetch(imageUrl, { mode: "no-cors" });
		const blob = await response.blob();

		// Convert the Blob into a File
		const file = new File([blob], 'shared-image.jpg', { type: blob.type });

		// Check if Web Share API supports files
		// if (navigator.canShare && navigator.canShare({ files: [file] })) {
		await navigator.share({
			title: 'Check out this image!',
			text: 'Here is an image I want to share with you.',
			files: [file], // Share the file instead of the link
		});
		console.log('File shared successfully');
		// } else {
		// 	alert('Your browser does not support file sharing.');
		// }
	} catch (error) {
		console.error('Error sharing file:', error);
	}
}
