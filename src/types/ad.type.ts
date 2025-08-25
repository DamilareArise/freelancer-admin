
export interface SuperAdDialogProps {
	open?: boolean
	close: () => void
	superAd?: SuperAd | null
}


export interface SuperAd {
	id: number;
	tier: number;
	price: number;
	title: string;
	features: string[];
	locations: AppLocation[];
}

export interface AppLocation {
	name: string,
	id: string,
}


export interface Ad {
	id: number;
	super_ads_category: Pick<SuperAd, "tier" | "title"> | null;
	type: string;
	start_date: string;
	end_date: string;
	status: "active" | "paused" | "expired";
	created_at: string;
	updated_at: string;
	listing: number;
}
