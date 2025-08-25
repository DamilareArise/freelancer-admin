import MemoLogo from "@/components/Logo"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useAppDispatch } from "@/hooks/redux.hooks"
import { useRequestPasswordResetMutation } from "@/services/auth.service"
import { setResetPasswordData } from "@/slices/app.slice"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, KeyRound } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().nonempty("Email is required").email("Email is invalid"),
})

type FormType = z.infer<typeof formSchema>

// const fields: {
//   name: keyof FormType,
//   label: string
// }[] = [
//   { name: "email", label: "Email" },
//   { name: "password", label: "Password" },
// ]

const ForgotPassword = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [requestPasswordReset, { isLoading }] =
    useRequestPasswordResetMutation()

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  })

  const onSubmit = async (values: FormType) => {
    const { data, error } = await requestPasswordReset(values)

    if (data) {
      dispatch(setResetPasswordData(values))
      navigate("/reset-password-otp")
    } else if (error && "message" in error) {
      toast.error("Oops", {
        description: error?.message,
        position: "bottom-center",
      })
    }
  }

  return (
    <div className="flex [&>div]:flex-1 h-screen fade">
      <div className="p-10 h-full no-scrollbar overflow-auto w-full">
        <Form {...form}>
          <form
            className="flex flex-col items-center gap-10 p-5 w-full max-w-[27rem] mx-auto h-full"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h3 className="flex items-center font-semibold gap-2 font-poppins text-4xl">
              <MemoLogo className="size-10 text-primary-400" />
              Freelancer
            </h3>
            <div className="flex w-full items-center flex-col gap-8 mt-[10%]">
              <div className="text-center flex flex-col items-center gap-2">
                <span className="size-10 rounded-full border bg-primary/15 border-primary flex items-center justify-center">
                  <KeyRound className="size-5 text-primary" />
                </span>
                <h3 className="text-2xl font-semibold">
                  Forgot your Password?
                </h3>
                <p className="text-neutral-600 text-sm">
                  No worries, we will send you reset instructions
                </p>
              </div>

              <div className="flex w-full flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FloatingLabelInput
                        {...field}
                        placeholder="myemail@gmail.com"
                        className="h-[3.38rem] shadow-none rounded-md"
                        id="emailfield"
                        label="Email"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  className="bg-primary text-white h-14 rounded-md hover:enabled:bg-primary-900 transition duration-500 disabled:opacity-60"
                  disabled={isLoading}
                >
                  {!isLoading ? "Send Mail" : "Sending Mail..."}
                </button>
              </div>

              <Link
                className="text-neutral-600 text-sm flex items-center gap-1"
                to={"/login"}
              >
                <ArrowLeft className="size-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ForgotPassword
