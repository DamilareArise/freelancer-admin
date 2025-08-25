import MemoLogo from "@/components/Logo"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks"
import { cn } from "@/lib/utils"
import {
  useRequestPasswordResetMutation,
  useVerifyResetOtpMutation,
} from "@/services/auth.service"
import { selectApp, setResetPasswordData } from "@/slices/app.slice"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  otp: z.string().length(4, "OTP should contain 4 digits"),
})

type FormType = z.infer<typeof formSchema>

const ResetOTP = () => {
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyResetOtpMutation()
  const [requestPasswordReset, { isLoading: isSending }] =
    useRequestPasswordResetMutation()
  const submitRef = useRef<HTMLButtonElement>(null)
  const { resetPasswordData } = useAppSelector(selectApp)
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [bigLoad, setBigLoad] = useState(false)

  const sendOtp = useCallback(
    async (resending = false, email = resetPasswordData.email) => {
      const { data, error } = await requestPasswordReset({ email })
      if (data) {
        if (resending) {
          setBigLoad(false)
          toast.success("Success", {
            description: "OTP has been sent to your email",
            position: "bottom-center",
          })
        }
      } else if (error && "message" in error) {
        toast.error("Oops", {
          description: error?.message,
          position: "bottom-center",
        })
      }
    },
    [requestPasswordReset, resetPasswordData.email]
  )

  useEffect(() => {
    const email = searchParams.get("email")
    if (email) {
      setBigLoad(true)
      dispatch(setResetPasswordData({ email }))
      sendOtp(false, email)
    } else if (!resetPasswordData.email) {
      navigate("/forget-password")
    }
  }, [dispatch, searchParams, resetPasswordData.email, navigate, sendOtp])

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: FormType) => {
    const { data, error } = await verifyOtp({
      ...values,
      email: resetPasswordData.email,
    })
    if (data) {
      dispatch(setResetPasswordData(values))
      navigate("/reset-password")
    } else if (error && "message" in error) {
      toast.error("Oops", {
        description: error?.message,
        position: "bottom-center",
      })
    }
  }

  return (
    <div className="flex [&>div]:flex-1 h-screen">
      <div className="p-10 h-full no-scrollbar overflow-auto w-full">
        <Form {...form}>
          <form
            className="flex flex-col items-center gap-10 p-5 w-full max-w-[27rem] mx-auto h-full relative"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {bigLoad && isSending && (
              <div
                className={cn(
                  "absolute text-sm inset-0 flex p-10 pt-20 flex-col items-center gap-2 z-10 backdrop-blur-sm bg-white/70"
                )}
              >
                <Loader2 className="animate-spin" />
                <p className="max-w-xs text-center">
                  We are sending a verification code to you.
                </p>
              </div>
            )}
            <h3 className="flex items-center font-semibold gap-2 font-poppins text-4xl">
              <MemoLogo className="size-10 text-primary-400" />
              KLIKO
            </h3>
            <div className="flex w-full items-center flex-col gap-8 mt-[10%]">
              <div className="text-center flex flex-col items-center gap-2">
                <span className="size-10 rounded-full border bg-primary/15 border-primary flex items-center justify-center">
                  <Mail className="size-5 text-primary" />
                </span>
                <h3 className="text-2xl font-semibold">Check your Mail</h3>
                <p className="text-neutral-600 max-w-xs text-sm">
                  We sent a code to{" "}
                  {resetPasswordData.email ? (
                    <span className="font-semibold text-black">
                      {resetPasswordData.email}
                    </span>
                  ) : (
                    "your email"
                  )}
                  . <br />
                  Copy and paste code to proceed
                </p>
              </div>

              <div className="flex w-full flex-col gap-6">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP
                          type="password"
                          placeholder="-"
                          maxLength={4}
                          disabled={isSending || isVerifying}
                          // {...{
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            if (e.length == 4) {
                              submitRef.current?.click()
                            }
                          }}
                        >
                          <InputOTPGroup className="gap-1 justify-center w-full [&>div]:rounded-lg [&>div]:ring-0 [&>div]:w-24 [&>div]:h-[4.7rem] [&>div]:border">
                            <InputOTPSlot
                              className="first:rounded-l-lg"
                              index={0}
                            />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot
                              className="last:rounded-r-lg"
                              index={3}
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <button className="hidden" ref={submitRef}></button>
              <span className="text-neutral-600 text-sm">
                {isSending ? (
                  "Sending Mail..."
                ) : isVerifying ? (
                  "Verifying OTP..."
                ) : (
                  <>
                    Didn’t receive the mail?{" "}
                    <button
                      type="button"
                      onClick={() => sendOtp(true)}
                      className="text-primary font-semibold"
                    >
                      Click to resend
                    </button>
                  </>
                )}
              </span>

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

export default ResetOTP
