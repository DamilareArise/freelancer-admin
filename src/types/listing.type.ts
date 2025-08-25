
// export type CreateListing = Pick<Listing, "price"> & {
// 	listing_features: CreateListingFeatures[],
// 	listing_pricing: CreateListingPricing[],
// 	subcategories: CreateSubCategories[],
// }

import { Ad } from "./ad.type";
import { UserData } from "./auth";
import { CategoryFeature, FeatureFieldType } from "./category.type";

// export type CreateListingFeatures = Pick<ListingFeature, | "label" | "type" | "unit" | "options" | "required"> & {
// 	id: string,
// 	saveId?: ListingFeature["id"]
// }
// export type CreateListingPricing = Pick<ListingPricing, "price" | "discount"> & {
// 	id: string, duration: number | null,
// 	saveId?: ListingPricing['id']
// }
// export type CreateSubCategories = Pick<SubCategories, "name"> & {
// 	id: string,
// 	saveId?: SubCategories['id']
// }

export interface Listing {
	id: number;
	location: ListingLocation;
	property: ListingProperty;
	contact: ListingContact;
	resources: ListingResource[];
	images: ListingResource[];
	videos: ListingResource[];
	category: number;
	regular_ad: Ad | null;
	super_ad: Ad | null;
	created_by: UserData,
	features: ListingFeature[];
	user_type: string;
	renting_type: string;
	price: string;
	price_unit: string;
	status: ListingStatus;
	created_at: Date;
	address: string;
	updated_at: Date;
	subcategory: number;
	impressions: number,
	clicks: number,
}

export interface SuperAdListing extends Listing {
	days_left: number,
}

export type ListingStatus = "pending" | "approved" | "rejected"

export interface ListingContact {
	id: number;
	fullname: string;
	email: string;
	phone: string;
	phone2: string;
	website: string;
	address: string;
}

export interface ListingFeature {
	feature_field: number;
	unit: string;
	type: FeatureFieldType;
	label: CategoryFeature['label'];
	value: string | number | string[];
}

export interface ListingLocation {
	id: number;
	country: string;
	county: string;
	city: string;
	street_name: string;
	street_number: string;
}

export interface ListingProperty {
	id: number;
	header: string;
	description_en: string;
	description_hr: string | null;
}

export interface ListingResource {
	id: number;
	listing: number;
	resource: string;
	is_cover: boolean;
	name: string;
	description: string;
	type: ListingResourceType
}

export type ListingResourceType = "image" | "video"

export interface ListingDialogProps {
	open?: boolean
	editing?: boolean
	close: () => void
	setListing: (listing: Listing) => void
	listing?: Listing | null
}


export interface ListingSummary {
	total: number;
	approved: number;
	pending: number;
	rejected: number;
	expired: number;
	free_listings: number;
	total_revenue: number;
}
