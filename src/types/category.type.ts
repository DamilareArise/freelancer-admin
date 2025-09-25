import { categoryIcons } from "@/lib/constants"

export type CreateCategory = Pick<Category, "name"> & {
	category_features: Omit<CreateCategoryFeatures, 'id' | 'action'>[],
	category_pricing: Omit<CreateCategoryPricing, 'id' | 'action'>[],
	subcategories: Omit<CreateSubCategories, 'id' | 'action'>[],
}

export type ChildActionType = "delete" | "update" | "new";

export type CreateCategoryFeatures = Omit<CategoryFeature, "id" | "category" | "created_by"> & {
	id: string,
	rank: number,
	action: ChildActionType,
	saveId?: CategoryFeature["id"]
}
export type CreateCategoryPricing = Pick<CategoryPricing, "price" | "discount"> & {
	action: ChildActionType,
	id: string, duration: number | null,
	saveId?: CategoryPricing['id']
}
export type CreateSubCategories = Pick<SubCategories, "name"> & {
	action: ChildActionType,
	id: string,
	saveId?: SubCategories['id']
}

export interface Category {
	id: number;
	category_pricing: CategoryPricing[];
	category_features: CategoryFeature[];
	subcategories: SubCategories[];
	created_by: number;
	icon: (keyof typeof categoryIcons) | null;
	updated_by: null;
	name: string;
	type: "regular" | "earnings";
	charging_unit: string | null;
	checked: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface CategoryFeature {
	id: number;
	category: number;
	created_by: number;
	label: string;
	label_en: string;
	label_hr: string;
	unit?: string;
	type: FeatureFieldType;
	required: boolean;
	options?: string[] | null;
}

export type FeatureFieldType = "radio" | "checkbox" | "textarea" | "select" | "text" | "number"

export interface CategoryPricing {
	id: number;
	category: number;
	created_by: number;
	price: string | number;
	duration: number;
	discount: string | number;
}

export interface SubCategories {
	id: number;
	name: string;
}


export interface CategoryDialogProps {
	open?: boolean
	close: () => void
	category?: Category | null
	copying?: boolean
}
