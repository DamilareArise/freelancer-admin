import MemoSecurity from "@/components/icons/Security"
import { passwordRegex } from "@/lib/constants"
import { useUpdateAdminPasswordMutation } from "@/services/auth.service"
import { selectApp } from "@/slices/app.slice"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { toast as sonnerToast } from "sonner"
import { z } from "zod"
import { useAppSelector } from "./redux.hooks"
import { toast } from "./use-toast"

const formSchema = z.object({
	password: z.string().nonempty("Current Password is required"),
	new_password: z.string().nonempty("New Password is required")
		.min(8, "Minimum length of 8 characters")
		// .max(128, "maximum length of 128 characters")
		.regex(
			passwordRegex,
			'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
		),
	confirm_password: z.string().nonempty("Last Name is required"),
}).superRefine(({ confirm_password, new_password }, ctx) => {
	if (confirm_password !== new_password) {
		ctx.addIssue({
			code: "custom",
			message: "The passwords did not match",
			path: ['confirm_password']
		});
	}
})

type ProfileFormType = z.infer<typeof formSchema>;

export const useSecurity = () => {
	const { profile } = useAppSelector(selectApp);
	const [updateAdmin, { isLoading }] = useUpdateAdminPasswordMutation();

	const form = useForm<ProfileFormType>({
		resolver: zodResolver(formSchema),
		defaultValues: { new_password: "" }
	})

	// useEffect(() => {
	// 	if (profile) {
	// 		form.setValue("first_name", profile?.first_name);
	// 		form.setValue("last_name", profile?.last_name);
	// 		form.setValue("email", profile?.email);
	// 		form.setValue("phone", profile?.phone);
	// 	}
	// }, [profile, form])

	const onSubmit = async (values: ProfileFormType) => {
		// const form = new FormData();
		// Object.entries(values).forEach(([key, value]) => {
		// 	form.append(key, value);
		// })
		const { data, error } = await updateAdmin(values);

		if (data) {
			sonnerToast("Success", {
				description: "Password updated Successfully",
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
				label: "Current Password",
				name: "password", type: "password",
				icon: MemoSecurity,
				placeholder: "Password",
			},
			{
				label: "New Password",
				name: "new_password", type: "password",
				icon: MemoSecurity,
				placeholder: "New Password",
			},
			{
				label: "Confirm Password",
				name: "confirm_password", type: "password",
				icon: MemoSecurity,
				placeholder: "Confirm Password",
			},
		]




	return {
		onSubmit, isLoading, form, profile,
		fields
	}
}
