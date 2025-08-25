import MemoMessage from "@/components/icons/Message"
import MemoSettings from "@/components/icons/Settings"
import MemoLogo from "@/components/Logo"
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hooks"
import { adminNavLinks } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { selectApp, setNavIsOpen } from "@/slices/app.slice"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { Outlet, useLocation } from "react-router"
import { Link, NavLink } from "react-router-dom"

function Admin() {
  const { navIsOpen } = useAppSelector(selectApp)
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()
  const [openedLink, setOpenedLink] = useState<
    null | (typeof adminNavLinks)[0]
  >(null)

  return (
    <div className="flex">
      <div
        className={`flex fixed lg:static w-screen lg:w-fit transition duration-500 z-40 ${
          navIsOpen
            ? "bg-black/50"
            : "pointer-events-none lg:pointer-events-auto"
        }`}
      >
        <div
          className={`w-[17rem] ${
            navIsOpen ? "" : "-translate-x-full lg:translate-x-0"
          } px-4  overflowed transition text-white min-w-[15rem] sm:min-w-[17rem] duration-500 bg-primary-1000 h-dvh flex flex-col pt-6`}
        >
          <h3 className="flex relative mb-6 items-center font-semibold gap-2 font-poppins text-[1.75rem]">
            <MemoLogo className="size-8 text-primary-400" />
            <span>KLIKO</span>
          </h3>

          <div className="h-full max-h-[calc(100dvh_-_16rem)] overflow-auto no-scrollbar">
            <div className="flex w-full mt-2 flex-col gap-3 ">
              {adminNavLinks.map((each) => (
                <div
                  key={each.label}
                  id={each.key}
                  className={cn(
                    `text-primary-200 text-sm rounded-lg px-4 transition-all duration-300 hover:bg-primary-900 overflow-hidden`,
                    pathname.includes(each.path) && "bg-primary-900"
                  )}
                  style={{
                    maxHeight:
                      each.children && openedLink?.key == each.key
                        ? `${document.getElementById(each.key)?.scrollHeight}px`
                        : "3rem",
                  }}
                >
                  <Link
                    to={each.path}
                    onClick={() => {
                      if (!each.children) {
                        dispatch(setNavIsOpen(false))
                      }
                      setOpenedLink(openedLink?.key == each.key ? null : each)
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 h-12 min-h-12"
                    )}
                  >
                    <each.icon className="size-6 text-[#B8F9E3]" />
                    <span className="truncate">{each.label}</span>
                    {each.children && (
                      <ChevronDown
                        className={cn(
                          "ml-auto size-4.5 transition duration-300",
                          each.children &&
                            openedLink?.key == each.key &&
                            "rotate-180"
                        )}
                      />
                    )}
                  </Link>

                  {each.children && openedLink?.key == each.key && (
                    <div className="flex gap-4 px-5 pt-3 pb-5 overflow-hidden">
                      <div className="bg-white/15 rounded min-w-0.5"></div>
                      <div className="flex flex-col gap-2.5 w-full">
                        {each.children.map((eachChild) => (
                          <Link
                            onClick={() => {
                              dispatch(setNavIsOpen(false))
                              //   setOpenedLink(
                              //     openedLink?.key == each.key ? null : each
                              //   )
                            }}
                            to={eachChild.path}
                            key={eachChild.key}
                            className={cn(
                              "w-full flex items-center gap-2 min-h-8 text-white/90 px-3.5 transition duration-300 rounded-md",
                              pathname.includes(eachChild.path) && "bg-white/15"
                            )}
                          >
                            <span className="truncate">{eachChild.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pb-10 ">
            <div className="w-full text-primary-200 flex flex-col gap-2">
              <NavLink
                onClick={() => dispatch(setNavIsOpen(false))}
                to={"/admin/messages"}
                className={({ isActive }) =>
                  cn(
                    `w-full rounded-lg px-4 transition duration-300 h-12 text-sm flex hover:bg-primary-900 items-center gap-3`,
                    isActive && "bg-primary-900"
                  )
                }
              >
                <MemoMessage className="size-5 text-white" />
                Message
                <span className="size-5 flex items-center justify-center border border-primary [box-shadow:0px_0px_12px_0px_var(--primary)] bg-white text-primary-1000 rounded-full ml-2">
                  2
                </span>
              </NavLink>
              <NavLink
                onClick={() => dispatch(setNavIsOpen(false))}
                to={"/admin/settings"}
                className={({ isActive }) =>
                  cn(
                    `w-full rounded-lg px-4 transition duration-300 h-12 text-sm flex hover:bg-primary-900 items-center gap-3`,
                    isActive && "bg-primary-900"
                  )
                }
              >
                <MemoSettings className="size-5 text-white" />
                Settings
              </NavLink>
              {/* <button
                className={`w-full rounded-lg px-4 transition duration-300 h-12 text-sm flex hover:bg-primary-900 items-center gap-2 `}
              >
                <MemoAPIDoc className="size-6" />
                API Documentation
              </button> */}
            </div>
          </div>
        </div>
        <div
          onClick={() => dispatch(setNavIsOpen(false))}
          className={`w-full lg:hidden h-dvh`}
        ></div>
      </div>
      <div
        id="outletContainer"
        className="w-full h-dvh overflowed overflow-x-hidden lg:w-[calc(100%-17rem)] px-6 md:px-8"
      >
        <Outlet />
      </div>
    </div>
  )
}

export default Admin
