import MemoMail from "@/components/icons/Mail"
import MemoUser from "@/components/icons/User"
import { useUpdateAuthAdminMutation } from "@/services/auth.service"
import { countriesWithCode } from "@/services/country.service"
import { selectApp } from "@/slices/app.slice"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast as sonnerToast } from "sonner"
import { z } from "zod"
import { useAppSelector } from "./redux.hooks"
import { toast } from "./use-toast"

const formSchema = z.object({
	first_name: z.string().nonempty("First Name is required"),
	last_name: z.string().nonempty("Last Name is required"),
	email: z.string().email("Email must be valid").nonempty("Last Name is required"),
	phone: z.string()
		.nonempty("Phone is required")
		.max(15, "Phone can't exceed 15 numbers"),
	// .regex(/^\d+$/, 'Only numbers are allowed'),
	code: z.string().optional(),
	// code: z.string().nonempty("Code is required"),
})

type ProfileFormType = z.infer<typeof formSchema>;

export const useProfile = () => {
	const { profile } = useAppSelector(selectApp);
	// const countries = countriesWithCode
	// const { data: _countries } = useGetCountriesQuery(["idd", "cca2", "name", "flag"]);
	const [countries, setCountries] = useState<{ label: string, value: string, name: string }[]>([])
	const [updateAdmin, { isLoading }] = useUpdateAuthAdminMutation();

	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setImage(event.target.files[0]);
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(event.target.files[0]);
		}
	};

	useEffect(() => {
		// if (_countries) {
		// const countries: { label: string, value: string }[] = [];
		// countriesWithCode.forEach(country => {
		// 	country.idd.suffixes.forEach(suffix => {
		// 		const code = `${country.idd.root}${suffix}`;
		// 		countries.push({
		// 			label: `${country.flag} ${country.cca2} ${code}`,
		// 			value: code
		// 		});
		// 	});
		// });

		// setCountries(countries);

		setCountries(countriesWithCode.map(({ code, flag, dial_code, name }) => ({
			label: `${flag} ${code} ${dial_code}`, name, value: dial_code
		})));
		// }
	}, [
		// _countries
	])

	const form = useForm<ProfileFormType>({
		resolver: zodResolver(formSchema),
	})
	useEffect(() => {
		if (profile) {
			form.setValue("first_name", profile?.first_name);
			form.setValue("last_name", profile?.last_name);
			form.setValue("email", profile?.email);
			form.setValue("phone", profile?.phone, { shouldValidate: true });
		}
	}, [profile, form])

	const onSubmit = async (values: ProfileFormType) => {
		// const request =

		const form = new FormData();
		if (image) {
			form.append("passport", image);
		}
		Object.entries(values).forEach(([key, value]) => {
			form.append(key, value);
		})
		const { data, error } = await updateAdmin(form);

		if (data) {
			sonnerToast("Success", {
				description: "Profile updated Successfully",
			})
		} else if (error && "message" in error) {
			toast({
				variant: "destructive",
				title: "Oops",
				description: error?.message,
			})
		}
	}


	const fields: {
		label: string, name: keyof ProfileFormType, type?: string, className?: string,
		placeholder?: string, icon: React.FC<React.SVGProps<SVGSVGElement>>
	}[] = [
			{
				label: "First Name",
				name: "first_name",
				icon: MemoUser,
				placeholder: "First Name",
			},
			{
				label: "Last Name",
				name: "last_name",
				icon: MemoUser,
				placeholder: "Last Name",
			},
			// {
			// 	label: "Code",
			// 	name: "code",
			// 	icon: MemoMail, className: "col-span-1",
			// 	placeholder: "Code", type: "select"
			// },
			{
				label: "Phone",
				name: "phone",
				icon: MemoMail,
				// className: "col-span-2",
				placeholder: "Phone",
			},
			{
				label: "Email",
				name: "email",
				icon: MemoMail,
				placeholder: "Email",
			},
		]




	return {
		onSubmit, isLoading, form, profile,
		fields, countries, handleImageChange, passportPreview: preview
	}
}
