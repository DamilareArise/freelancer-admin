
export type CreateFAQ = Omit<FAQ, "id"> & {

}


export interface FAQ {
	id: number;
	rank: number;
	question: string;
	question_hr: string;
	question_en: string;
	answer: string;
	answer_hr: string;
	answer_en: string;
}

export interface FAQDialogProps {
	open?: boolean
	close: () => void
	faq?: FAQ
}
