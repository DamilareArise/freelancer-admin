import MemoLogo from "@/components/Logo"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useSignInMutation } from "@/services/auth.service"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email().nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
})

type FormType = z.infer<typeof formSchema>

console.log(import.meta.env)

// const fields: {
//   name: keyof FormType,
//   label: string
// }[] = [
//   { name: "email", label: "Email" },
//   { name: "password", label: "Password" },
// ]

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [signIn, { isLoading }] = useSignInMutation()
  const [searchParams] = useSearchParams()

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  })

  const onSubmit = async (values: FormType) => {
    const { data, error } = await signIn({
      ...values,
      username: values.email,
    })

    if (data) {
      localStorage.setItem("token", data.access_token)
      localStorage.setItem("rtoken", data.refresh_token)
      navigate(searchParams.get("_t") || "/admin")
      // shareImageFromUrl(
      //   "https://zca.edossier.app/edozzier/upload/company/zca-logo-zion.png"
      // )
    } else if (error && "message" in error) {
      toast.error("Oops", {
        description: error?.message,
        position: "bottom-left",
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
                <h3 className="text-2xl font-semibold">
                  Login to your account
                </h3>
                <p className="text-neutral-600 text-sm">
                  Effortlessly manage and control every aspect of your business
                  from a single, intuitive dashboard. Experience unmatched
                  flexibility and convenience—all in one place.
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <button
                        className="absolute z-10 right-4 top-4 text-neutral-700"
                        type="button"
                        onClick={() => setShowPassword((e) => !e)}
                      >
                        {showPassword ? (
                          <Eye className="size-5 stroke-[1.5]" />
                        ) : (
                          <EyeOff className="size-5 stroke-[1.5]" />
                        )}
                      </button>

                      <FloatingLabelInput
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="h-[3.38rem] shadow-none rounded-md"
                        id="passwordField"
                        label="Password"
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
                  {!isLoading ? "Sign In" : "Signing In..."}
                </button>
              </div>

              <Link
                className="text-neutral-600 text-sm"
                to={"/forget-password"}
              >
                Forget Password?
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Login
