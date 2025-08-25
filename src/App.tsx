import { AlertTriangle, CheckCircle, Info, Loader, XCircle } from "lucide-react"
import { lazy } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import "./App.css"
import { Toaster as SoonerToaster } from "./components/ui/sonner"
import { Toaster } from "./components/ui/toaster"
import AdminAuthGuard from "./guards/AdminAuthGuard"
import ForgotPassword from "./routes/ForgotPassword"
import Login from "./routes/Login"
import ResetOTP from "./routes/ResetOTP"
import ResetPassword from "./routes/ResetPassword"
import Admin from "./routes/admin"
import NotFound from "./routes/admin/NotFound"
import Overview from "./routes/admin/Overview"
import SuperAdsList from "./routes/admin/ads/SuperAdsLists"
import Bookings from "./routes/admin/bookings/Bookings"
import Listings from "./routes/admin/listings/Listings"
import ListingReport from "./routes/admin/reports/ListingReport"
import PhysicalToursReport from "./routes/admin/reports/PhysicalToursReport"
import Reports from "./routes/admin/reports/Reports"
import SuperAdsPerformance from "./routes/admin/reports/SuperAdsPerformance"
import UserAnalytics from "./routes/admin/reports/UserAnalytics"
import Settings from "./routes/admin/settings"
import Permissions from "./routes/admin/settings/Permissions"
import Profile from "./routes/admin/settings/Profile"
import Support from "./routes/admin/support/Index"
import SupportMessaging from "./routes/admin/Messages"
import PaymentSettings from "./routes/admin/financials/settings/PaymentSettings"
import PaymentChargesSettings from "./routes/admin/financials/settings/PaymentChargesSettings"
import ServicePayments from "./routes/admin/financials/PaymentProcessing/ServicePayments"

const Security = lazy(() => import("./routes/admin/settings/Security"))
const Users = lazy(() => import("./routes/admin/Users"))
const AdsManagement = lazy(() => import("./routes/admin/ads/AdsManagement"))
const AdsOverview = lazy(() => import("./routes/admin/ads/AdsOverview"))
const SuperAdListing = lazy(() => import("./routes/admin/ads/SuperAdListing"))
const SuperAdsControl = lazy(() => import("./routes/admin/ads/SuperAdsControl"))
const Booking = lazy(() => import("./routes/admin/bookings/Booking"))
const BookingsList = lazy(() => import("./routes/admin/bookings/BookingsList"))
const BookingsOverview = lazy(
  () => import("./routes/admin/bookings/BookingsOverview")
)
const PaymentProcessing = lazy(
  () => import("./routes/admin/financials/PaymentProcessing/PaymentProcessing")
)
const SubscriptionPayments = lazy(
  () =>
    import("./routes/admin/financials/PaymentProcessing/SubscriptionPayments")
)
const SuperAdsPayments = lazy(
  () => import("./routes/admin/financials/PaymentProcessing/SuperAdsPayments")
)
const FinOverview = lazy(
  () => import("./routes/admin/financials/overview/FinOverview")
)
const SubscriptionControl = lazy(
  () => import("./routes/admin/financials/overview/SubscriptionControl")
)
const SubscriptionOverview = lazy(
  () => import("./routes/admin/financials/overview/SubscriptionOverview")
)
const SuperAdsOverview = lazy(
  () => import("./routes/admin/financials/overview/SuperAdsOverview")
)
const ListingCategories = lazy(
  () => import("./routes/admin/listings/ListingCategories")
)
const ListingManagement = lazy(
  () => import("./routes/admin/listings/ListingManagement")
)
const AdsDisputes = lazy(() => import("./routes/admin/support/AdsDisputes"))
const FAQs = lazy(() => import("./routes/admin/support/FAQs"))
const SupportOverview = lazy(
  () => import("./routes/admin/support/SupportOverview")
)
const SupportTickets = lazy(
  () => import("./routes/admin/support/SupportTickets")
)

const AdminManagement = lazy(() => import("./routes/admin/AdminManagement"))

function App() {
  return (
    <>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route key={"login"} path="login" Component={Login} />
          <Route
            key={"forget-password"}
            path="forget-password"
            Component={ForgotPassword}
          />
          <Route
            key={"reset-password-otp"}
            path="reset-password-otp"
            Component={ResetOTP}
          />
          <Route
            key={"reset-password"}
            path="reset-password"
            Component={ResetPassword}
          />
          <Route
            key={"admin-red"}
            path=""
            element={<Navigate to={"admin"} />}
          />

          <Route
            path="admin"
            key={"appmain"}
            element={<AdminAuthGuard Component={Admin} />}
            children={[
              <Route
                key={"overview"}
                path=""
                element={<Navigate to={"overview"} />}
              />,
              <Route key={"users"} path="users" Component={Users} />,
              <Route
                key={"admins"}
                path="admins"
                Component={AdminManagement}
              />,
              <Route
                key={"overviewmain"}
                path="overview"
                Component={Overview}
              />,

              <Route
                key={"adsg"}
                path="ads"
                Component={AdsManagement}
                children={[
                  <Route
                    key={"re-adsManage"}
                    path=""
                    element={<Navigate to={"overview"} />}
                  />,
                  <Route
                    key={"adsOverview"}
                    path="overview"
                    Component={AdsOverview}
                  />,
                  <Route
                    key={"ads/super-ads-control"}
                    path="super-ads-control"
                    Component={SuperAdsControl}
                  />,
                  <Route
                    key={"superads"}
                    path="super"
                    Component={SuperAdsList}
                  />,
                ]}
              />,
              <Route
                key={"superadlisting"}
                path="ads/super/:listing_id"
                Component={SuperAdListing}
              />,

              <Route
                key={"listings"}
                path="listings"
                Component={Listings}
                children={[
                  <Route
                    key={"re-listingManage"}
                    path=""
                    element={<Navigate to={"management"} />}
                  />,
                  <Route
                    key={"listingCategories"}
                    path="categories"
                    Component={ListingCategories}
                  />,
                  <Route
                    key={"listingManage"}
                    path="management"
                    Component={ListingManagement}
                  />,
                ]}
              />,

              <Route
                key={"financials"}
                path="financials"
                children={[
                  <Route
                    key={"fin-default"}
                    path=""
                    element={<Navigate to={"overview/subscription-overview"} />}
                  />,
                  <Route
                    key={"fin-overview"}
                    path="overview"
                    Component={FinOverview}
                    children={[
                      <Route
                        key={"overview/sub-overview"}
                        path=""
                        element={<Navigate to={"subscription-overview"} />}
                      />,
                      <Route
                        key={"overview/sub-overview"}
                        path="subscription-overview"
                        Component={SubscriptionOverview}
                      />,
                      <Route
                        key={"overview/sub-control"}
                        path="subscription-control"
                        Component={SubscriptionControl}
                      />,
                      <Route
                        key={"overview/super-ads-overiview"}
                        path="super-ads-overview"
                        Component={SuperAdsOverview}
                      />,
                    ]}
                  />,
                  <Route
                    key={"fin-ayment"}
                    path="payment-processing"
                    Component={PaymentProcessing}
                    children={[
                      <Route
                        key={"payment-processing/sub-payments-re"}
                        path=""
                        element={<Navigate to={"subscription-payments"} />}
                      />,
                      <Route
                        key={"payment-processing/subscription-payments"}
                        path="subscription-payments"
                        Component={SubscriptionPayments}
                      />,
                      <Route
                        key={"payment-processing/super-ads-payments"}
                        path="super-ads-payments"
                        Component={SuperAdsPayments}
                      />,
                      <Route
                        key={"payment-processing/service-payments"}
                        path="service-payments"
                        Component={ServicePayments}
                      />,
                    ]}
                  />,
                  <Route
                    key={"fin-settings"}
                    path="settings"
                    Component={PaymentSettings}
                    children={[
                      <Route
                        key={"payment-processing/sub-settings-re"}
                        path=""
                        element={<Navigate to={"charges"} />}
                      />,
                      <Route
                        key={"payment-processing/charges"}
                        path="charges"
                        Component={PaymentChargesSettings}
                      />,
                    ]}
                  />,
                ]}
              />,

              <Route
                key={"bookings-tours"}
                path="bookings"
                Component={Bookings}
                children={[
                  <Route
                    key={"re-bookings-overview"}
                    path=""
                    element={<Navigate to={"overview"} />}
                  />,
                  <Route
                    key={"bookings-overview"}
                    path="overview"
                    Component={BookingsOverview}
                  />,
                  <Route
                    key={"bookings-tours-list"}
                    path="list"
                    Component={BookingsList}
                  />,
                ]}
              />,
              <Route
                key={"one-booking"}
                path="bookings/:booking_id"
                Component={Booking}
              />,

              <Route
                key={"reports"}
                path="reports"
                Component={Reports}
                children={[
                  <Route
                    key={"re-user-analytics"}
                    path=""
                    element={<Navigate to={"user-analytics"} />}
                  />,
                  <Route
                    key={"user-analytics"}
                    path="user-analytics"
                    Component={UserAnalytics}
                  />,
                  <Route
                    key={"listing-report"}
                    path="listing"
                    Component={ListingReport}
                  />,
                  <Route
                    key={"physical-tours"}
                    path="physical-tours"
                    Component={PhysicalToursReport}
                  />,
                  <Route
                    key={"super-ads"}
                    path="super-ads"
                    Component={SuperAdsPerformance}
                  />,
                ]}
              />,

              <Route
                key={"support"}
                path="support"
                Component={Support}
                children={[
                  <Route
                    key={"re-support-overview"}
                    path=""
                    element={<Navigate to={"overview"} />}
                  />,
                  <Route
                    key={"support-overview"}
                    path="overview"
                    Component={SupportOverview}
                  />,
                  <Route
                    key={"support-ticket"}
                    path="tickets"
                    Component={SupportTickets}
                  />,
                  <Route
                    key={"ads-disputes"}
                    path="ads-disputes"
                    Component={AdsDisputes}
                  />,
                  <Route key={"modify-faqs"} path="faqs" Component={FAQs} />,
                ]}
              />,

              <Route
                key={"settings"}
                path="settings"
                Component={Settings}
                children={[
                  <Route
                    key={"settings-default"}
                    path=""
                    element={<Navigate to={"profile"} />}
                  />,
                  <Route
                    key={"setting-profile"}
                    path="profile"
                    Component={Profile}
                  />,
                  <Route
                    key={"security"}
                    path="security"
                    Component={Security}
                  />,
                  <Route
                    key={"permission"}
                    path="permissions"
                    Component={Permissions}
                  />,
                ]}
              />,

              <Route
                key={"messaging"}
                path="messages"
                Component={SupportMessaging}
              />,

              <Route path="*" key={"all-route"} Component={NotFound} />,
            ]}
          />

          {/* <Route path="*" element={<Navigate to={"admin"} />} /> */}
        </Routes>
      </BrowserRouter>

      <Toaster />
      <SoonerToaster
        theme="light"
        icons={{
          success: <CheckCircle className="h-4 w-4 text-green-500" />,
          info: <Info className="h-4 w-4 text-blue-500" />,
          warning: <AlertTriangle className="h-4 w-4 text-warning" />,
          error: <XCircle className="h-4 w-4 text-destructive" />,
          loading: <Loader className="h-4 w-4 text-gray-500 animate-spin" />,
        }}
        toastOptions={{
          duration: 5000,
          // unstyled: true,
          classNames: {
            // error: "bg-red-400",
            // success: "text-green-400",
            // warning: "text-yellow-400",
            // info: "bg-blue-400",
            // toast: "bg-red-6000",
            // success:
          },
        }}
      />
    </>
  )
}

export default App
