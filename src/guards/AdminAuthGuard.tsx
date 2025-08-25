import MemoLogo from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks"
import { useGetAdminQuery } from "@/services/auth.service"
import {
  closeAlertDialog,
  selectApp,
  setAdminProfile,
} from "@/slices/app.slice"
import { Check } from "lucide-react"
import { useEffect } from "react"
import { Navigate, useLocation } from "react-router"
import * as Alert from "../components/ui/alert-dialog"

const AdminAuthGuard = ({ Component }: { Component: React.FC }) => {
  const { data, error, isLoading } = useGetAdminQuery("")
  const dispatch = useAppDispatch()
  const { alertDialogData } = useAppSelector(selectApp)
  const { pathname } = useLocation()

  useEffect(() => {
    if (data) {
      dispatch(setAdminProfile(data))
    }
  }, [data, dispatch])

  useEffect(() => {
    if (error) {
      dispatch(setAdminProfile(null))
    }
  }, [error, dispatch])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {/* Loading... */}
        {/* <h3 className="animated-logo flex relative items-center font-semibold gap-2 font-poppins text-[1.75rem] text-base-black">
          <MemoLogo className="size-8 text-primary-400" />
          <span>Freelancer</span>
        </h3> */}

        <h3 className="animated-logo flex relative items-center font-semibold gap-2 font-poppins text-[3rem] text-base-black">
          <MemoLogo className="size-12 text-primary-400" />
          <span>Freelancer</span>
        </h3>
      </div>
    )
  }

  if (error) {
    return (
      <Navigate to={`/login?_t=${pathname}`} />
      // <div className='flex h-screen items-center justify-center'>An error occured, please refresh.</div>
    )
  }

  return (
    <>
      <Component />

      <Alert.AlertDialog
        open={alertDialogData.open}
        onOpenChange={(open) => {
          if (!open) dispatch(closeAlertDialog())
        }}
      >
        <Alert.AlertDialogContent>
          <Alert.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
            <Alert.AlertDialogTitle>
              <div className="flex items-center flex-col gap-[16px]">
                <div className="p-[16px] bg-primary/10 rounded-[100px]">
                  <Check className="text-primary" />
                </div>
                <p>{alertDialogData.title}</p>
              </div>
            </Alert.AlertDialogTitle>
          </Alert.AlertDialogHeader>
          <Alert.AlertDialogDescription>
            {alertDialogData.desc}
          </Alert.AlertDialogDescription>
          <Alert.AlertDialogFooter>
            <Button
              onClick={() => {
                dispatch(closeAlertDialog())
              }}
              className="w-full"
            >
              {alertDialogData.buttonLabel}
            </Button>
          </Alert.AlertDialogFooter>
        </Alert.AlertDialogContent>
      </Alert.AlertDialog>
    </>
  )
}

export default AdminAuthGuard
