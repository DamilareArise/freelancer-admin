import MemoLogo from "@/components/Logo"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks"
import { passwordRegex } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useResetPasswordMutation } from "@/services/auth.service"
import { selectApp, setResetPasswordData } from "@/slices/app.slice"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Eye, EyeOff, KeyRound } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z
  .object({
    new_password: z
      .string()
      .nonempty("New Password is required")
      .min(8, "Minimum length of 8 characters")
      // .max(128, "maximum length of 128 characters")
      .regex(
        passwordRegex,
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      ),
    confirm_password: z.string().nonempty("Last Name is required"),
  })
  .superRefine(({ confirm_password, new_password }, ctx) => {
    if (confirm_password !== new_password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirm_password"],
      })
    }
  })

type FormType = z.infer<typeof formSchema>

const ResetPassword = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {
    resetPasswordData: { otp, email },
  } = useAppSelector(selectApp)
  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState(false)
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    // mode: "onTouched",
    defaultValues: { new_password: "" },
  })

  const onSubmit = async (values: FormType) => {
    const { data, error } = await resetPassword({
      otp,
      email,
      ...values,
    })
    if (data) {
      setDone(true)
    } else if (error && "message" in error) {
      toast.error("Oops", {
        description: error?.message,
        position: "bottom-center",
      })
      if (error.message?.includes("Invalid OTP")) {
        navigate(`/reset-password-otp?email=${email}`)
      }
    }
  }

  useEffect(() => {
    if (!email) {
      navigate("/forget-password")
    } else if (!otp) {
      navigate("/reset-password-otp")
    }
  }, [email, otp, navigate])

  const doneAction = () => {
    dispatch(setResetPasswordData({}))
    navigate("/login")
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

            {!done ? (
              <div className="flex w-full items-center flex-col gap-8 mt-[10%]">
                <div className="text-center flex flex-col items-center gap-2">
                  <span className="size-10 rounded-full border bg-primary/15 border-primary flex items-center justify-center">
                    <KeyRound className="size-5 text-primary" />
                  </span>
                  <h3 className="text-2xl font-semibold">Set new password</h3>
                  <p className="text-neutral-600 max-w-xs text-sm">
                    {/* Enter a strong password to secure your account. */}
                    Enter a strong password to keep your account safe and secure
                    {/* Your new password must be different from your previous ones */}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <button
                          className="absolute z-10 right-4 top-5 text-neutral-700"
                          type="button"
                          onClick={() => setShowPassword((e) => !e)}
                        >
                          {showPassword ? (
                            <Eye className="size-4 stroke-[1.5]" />
                          ) : (
                            <EyeOff className="size-4 stroke-[1.5]" />
                          )}
                        </button>
                        <FloatingLabelInput
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="h-[3.38rem] shadow-none rounded-md"
                          id="passwordField"
                          label="New Password"
                        />
                        <ul
                          className={cn(
                            "list-disc flex flex-col gap-2 text-neutral-500 text-xs pl-6 mt-1"
                          )}
                        >
                          {[
                            {
                              condition: /.*[A-Z]/.test(field.value),
                              desc: "At least one uppercase letter",
                            },
                            {
                              condition: /.*[a-z]/.test(field.value),
                              desc: "At least one lower letter",
                            },
                            {
                              condition: /.*\d/.test(field.value),
                              desc: "At least one digit",
                            },
                            {
                              condition: /.*[!\\|@#$%+=^&*().]/.test(
                                field.value
                              ),
                              desc: "At least one special character",
                            },
                            {
                              condition: field.value?.length >= 8,
                              desc: "At least eight characters",
                            },
                          ].map(({ condition, desc }) => (
                            <li
                              className={cn(
                                // "text-primary",
                                condition && "text-primary",
                                !condition &&
                                  form.getFieldState("new_password")
                                    .isTouched &&
                                  "text-destructive"
                              )}
                            >
                              {desc}
                            </li>
                          ))}
                        </ul>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <button
                          className="absolute z-10 right-4 top-5 text-neutral-700"
                          type="button"
                          onClick={() => setShowPassword((e) => !e)}
                        >
                          {showPassword ? (
                            <Eye className="size-4 stroke-[1.5]" />
                          ) : (
                            <EyeOff className="size-4 stroke-[1.5]" />
                          )}
                        </button>
                        <FloatingLabelInput
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="h-[3.38rem] shadow-none rounded-md"
                          id="confirmPasswordField"
                          label="Confirm Password"
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
                    {!isLoading ? "Submit" : "Submitting..."}
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
            ) : (
              <div className="flex w-full items-center flex-col gap-8 mt-[10%]">
                <div className="text-center flex flex-col items-center gap-2">
                  <span className="size-10 rounded-full border bg-primary/15 border-primary flex items-center justify-center">
                    <KeyRound className="size-5 text-primary" />
                  </span>
                  <h3 className="text-2xl font-semibold">Successful!</h3>
                  <p className="text-neutral-600 max-w-xs text-sm">
                    Your password has been set successfully. <br />
                    Click the button below to login
                  </p>
                </div>

                <button
                  type="button"
                  onClick={doneAction}
                  className="bg-primary w-full text-white h-14 rounded-md hover:enabled:bg-primary-900 transition duration-500 disabled:opacity-60"
                >
                  Continue
                </button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}

export default ResetPassword
