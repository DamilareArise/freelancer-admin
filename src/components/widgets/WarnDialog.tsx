import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"
import * as Alert from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { JSX } from "react"

const WarnDialog: React.FC<{
  title: string
  open: boolean
  desc?: string
  icon?: JSX.Element
  variant?: "primary" | "destructive"
  setOpen: (open: boolean) => void
  onConfirm: () => void
}> = ({
  open,
  setOpen,
  variant = "destructive",
  title,
  desc,
  onConfirm,
  icon,
}) => {
  return (
    <Alert.AlertDialog open={open} onOpenChange={setOpen}>
      <Alert.AlertDialogContent className="sm:max-w-md py-10">
        <Alert.AlertDialogHeader className="flex flex-col items-center gap-[16px]">
          <Alert.AlertDialogTitle>
            <div className="flex items-center flex-col gap-[16px]">
              <div
                className={cn(
                  "p-[16px]  rounded-[100px]",
                  variant == "destructive"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                )}
              >
                {icon || (
                  <AlertTriangle
                  // className={cn(
                  //   variant == "destructive"
                  //     ? "text-destructive"
                  //     : "text-primary"
                  // )}
                  />
                )}
              </div>
              <p>{title}</p>
            </div>
          </Alert.AlertDialogTitle>
        </Alert.AlertDialogHeader>
        <Alert.AlertDialogDescription>{desc}</Alert.AlertDialogDescription>
        <Alert.AlertDialogFooter className="gap-5 px-10">
          <Alert.AlertDialogCancel asChild>
            <Button className="w-full text-foreground border-primary h-12">
              No
            </Button>
          </Alert.AlertDialogCancel>
          <Button
            onClick={onConfirm}
            className={cn("w-full h-12", variant == "destructive" ? "" : "")}
            variant={variant == "destructive" ? "destructive" : "default"}
          >
            Yes
          </Button>
        </Alert.AlertDialogFooter>
      </Alert.AlertDialogContent>
    </Alert.AlertDialog>
  )
}

export default WarnDialog
