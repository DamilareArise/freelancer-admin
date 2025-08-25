import MemoPermission from "@/components/icons/Permission"
import MemoSecurity from "@/components/icons/Security"
import MemoUser from "@/components/icons/User"
import { Button } from "@/components/ui/button"
import Header from "@/components/widgets/Header"
import { cn } from "@/lib/utils"
import { useAdminLogoutMutation } from "@/services/auth.service"
import { LogOut } from "lucide-react"
import { Outlet, useNavigate } from "react-router"
import { NavLink } from "react-router-dom"
import { toast } from "sonner"

const Settings = () => {
  const [logout, { isLoading }] = useAdminLogoutMutation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { data, error } = await logout({
      refresh: localStorage.getItem("rtoken"),
    })
    if (data) {
      localStorage.removeItem("token")
      localStorage.removeItem("rtoken")
      toast.success("Success", {
        description: "You've logged out.",
        position: "bottom-left",
      })
      navigate("/login")
    } else if (error && "message" in error) {
      toast.error("Oops", { description: error.message })
    }
  }

  return (
    <>
      <Header />
      <div className="flex items-center gap-4 justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-[#242424]">Profile Settings</h3>
          <p className="text-xs text-[#868686]">
            Your personal information and account security settings
          </p>
        </div>

        <Button
          isLoading={isLoading}
          onClick={handleLogout}
          variant={"outline"}
          className="text-destructive border-destructive"
        >
          Logout <LogOut />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-8 h-[calc(100dvh_-_12rem)]">
        <div className="w-full overflow-auto md:max-w-48 rounded-l-md bg-[#FCFCFD] border border-[rgba(204,_204,_204,_0.08)] flex md:flex-col gap-6 p-4">
          {[
            { label: "Profile", path: "profile", icon: MemoUser },
            { label: "Security", path: "security", icon: MemoSecurity },
            { label: "Permissions", path: "permissions", icon: MemoPermission },
          ].map((each, i) => (
            <NavLink
              key={"settingslink" + i}
              to={each.path}
              className={({ isActive }) =>
                cn(
                  "flex transition duration-300 text-[#6B7280] text-xs items-center gap-1 px-2 py-1 rounded-xs font-medium",
                  isActive && "bg-white border-l-2 border-primary"
                )
              }
            >
              {" "}
              <each.icon /> {each.label}
            </NavLink>
          ))}
        </div>
        <div className="w-full overflow-auto rounded-r-md bg-[#FCFCFD] border border-[rgba(204,_204,_204,_0.08)] flex flex-col gap-6 p-4">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default Settings
