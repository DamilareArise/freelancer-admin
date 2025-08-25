
export type CreateFAQ = Omit<FAQ, "id"> & {

}


export interface FAQ {
	id: number;
	rank: number;
	question: string;
	answer: string
}

export interface FAQDialogProps {
	open?: boolean
	close: () => void
	faq?: FAQ
}
