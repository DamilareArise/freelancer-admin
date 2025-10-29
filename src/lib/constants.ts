import MemoAdminManage from "@/components/icons/AdminManage";
import MemoAds from "@/components/icons/Ads";
import MemoBooking from "@/components/icons/Booking";
import MemoCancel from "@/components/icons/Cancel";
import MemoCheckCircle from "@/components/icons/CheckCircle";
import MemoClock from "@/components/icons/Clock";
import MemoFinancials from "@/components/icons/Financials";
import MemoList from "@/components/icons/List";
import MemoNotifications from "@/components/icons/Notifications";
import MemoOverview from "@/components/icons/Overview";
import MemoReport from "@/components/icons/Report";
import MemoSupport from "@/components/icons/Support";
import MemoUsers from "@/components/icons/Users";
import { ListCheck, PlayCircle } from "lucide-react";

export const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!\\|@#$%+=^&*().]).+$/;

export const adminNavLinks = [
	{ key: "Overview", label: "Overview", icon: MemoOverview, path: "/admin/overview" },
	{
		key: "Listings", label: "Listings", icon: MemoList, path: "/admin/listings",
		sub: [
			{ key: "listing-management", label: "Management", path: "/admin/listings/management" },
			{ key: "listing-cat", label: "Categories", path: "/admin/listings/categories" },
		]
	},
	{
		key: "Financials", label: "Financials", icon: MemoFinancials, path: "/admin/financials",
		sub: [
			{
				key: "fin-overview", label: "Overview", path: "/admin/financials/overview", sub: [
					{ key: "fin-overview-sub", label: "Subscription", path: "/admin/financials/overview/subscription-overview" },
					{ key: "fin-overview-super", label: "Super Ads", path: "/admin/financials/overview/super-ads-overview" },
				]
			},
			{
				key: "fin-processing", label: "Payment History", path: "/admin/financials/payment-processing", sub: [
					{ key: "fin-processing-sub", label: "Subscription", path: "/admin/financials/payment-processing/subscription-payments", },
					{ key: "fin-processing-super", label: "Super Ads", path: "/admin/financials/payment-processing/super-ads-payments", },
					{ key: "fin-service-payments", label: "Service Payments", path: "/admin/financials/payment-processing/service-payments", },
				]
			},
			{
				key: "fin-settings", label: "Payment Settings", path: "/admin/financials/settings", sub: [
					{ key: "fin-settings-charges", label: "Charges", path: "/admin/financials/settings/charges", },
				]
			},
		],
		children: [
			{ key: "fin-overview", label: "Overview", path: "/admin/financials/overview" },
			{ key: "fin-processing", label: "Payment History", path: "/admin/financials/payment-processing" },
			{ key: "fin-settings", label: "Settings", path: "/admin/financials/settings" },
		]
	},
	{ key: "Users", label: "Users", icon: MemoUsers, path: "/admin/users" },
	{
		key: "Ads", label: "Ads Management", icon: MemoAds, path: "/admin/ads", sub: [
			{ key: "ads-overview", label: "Overview", path: "/admin/ads/overview" },
			{ key: "super-ads-control", label: "Super Ads Control", path: "/admin/ads/super-ads-control" },
			{ key: "super-ads-list", label: "Super Ads List", path: "/admin/ads/super" },

		]
	},
	{
		key: "Booking", label: "Booking & Physical Tour", icon: MemoBooking, path: "/admin/bookings", sub: [
			{ key: "booking-overview", label: "Overview", path: "/admin/bookings/overview" },
			{ key: "booking-tours", label: "Bookings/Tours", path: "/admin/bookings/list" },

		]
	},
	{
		key: "Support", label: "Support", icon: MemoSupport, path: "/admin/support",
		sub: [
			{ key: "support-overview", label: "Overview", path: "/admin/support/overview" },
			{ key: "support-tickets", label: "Support Tickets", path: "/admin/support/tickets" },
			{ key: "ads-disputes", label: "Ads Disputes", path: "/admin/support/ads-disputes" },
			{ key: "support-faqs", label: "Modify FAQs", path: "/admin/support/faqs" },
		],
		children: [
			{ key: "support-overview", label: "Overview", path: "/admin/support/overview" },
			{ key: "support-tickets", label: "Support Tickets", path: "/admin/support/tickets" },
			{ key: "ads-disputes", label: "Ads Disputes", path: "/admin/support/ads-disputes" },
			{ key: "support-faqs", label: "Modify FAQs", path: "/admin/support/faqs" },
		]
	},
	{
		key: "Reports", label: "Reports and Analytics", icon: MemoReport, path: "/admin/reports", sub: [
			{ label: "User Ananlytics", key: "user-analytics", path: "/admin/reports/user-analytics" },
			{ label: "Listing Report", key: "listing-report", path: "/admin/reports/listing" },
			{ label: "Physical Tours", key: "physical-tours", path: "/admin/reports/physical-tours" },
			{ label: "Super Ads Performance", key: "super-ads", path: "/admin/reports/super-ads" },
		]
	},
	{ key: "Admin", label: "Admin Management", icon: MemoAdminManage, path: "/admin/admins" },
	{ key: "Notification", label: "Notifications", icon: MemoNotifications, path: "/admin/notifications" },
]


export const statusMap
	// : Record<string, {
	// value: string
	// label: string
	// bg: string
	// color: string,
	// icon?: React.FC
	// }>
	= {
	"pending": {
		value: "pending",
		label: "Pending",
		bg: "#FFF1E5",
		color: "var(--warning)",
		icon: MemoClock
	},
	"success": {
		label: "Success",
		value: "success",
		bg: "",
		color: "var(--primary)",
		icon: MemoCheckCircle
	},
	"approved": {
		label: "Approved",
		value: "approved",
		bg: "",
		color: "var(--primary)",
		icon: MemoCheckCircle
	},
	"verified": {
		label: "Verified",
		value: "verified",
		bg: "",
		color: "var(--primary)",
		icon: MemoCheckCircle
	},
	"resolved": {
		label: "Resolved",
		value: "resolved",
		bg: "",
		color: "var(--primary)",
		icon: MemoCheckCircle
	},
	"completed": {
		label: "Completed",
		value: "completed",
		bg: "",
		color: "var(--primary)",
		icon: MemoCheckCircle
	},
	"active": {
		label: "Active",
		value: "active",
		bg: "",
		color: "var(--primary)",
		icon: MemoCheckCircle
	},
	"failed": {
		value: "failed",
		label: "Failed",
		bg: "#FFE7F0",
		color: "var(--secondary-800)",
		icon: MemoCancel
	},
	"canceled": {
		value: "canceled",
		label: "Cancelled",
		// bg: "#FFE7F0",
		// color: "var(--secondary-800)",
		bg: "#F5F5F5",
		color: "#6B7280",
		icon: MemoCancel
	},
	"rejected": {
		value: "rejected",
		label: "Rejected",
		bg: "#FFE7F0",
		color: "var(--secondary-800)",
		icon: MemoCancel
	},
	"suspended": {
		value: "suspended",
		label: "Suspended",
		bg: "#FFE7F0",
		color: "var(--secondary-800)",
		icon: MemoCancel
	},
	"escalated": {
		value: "escalated",
		label: "Escalated",
		bg: "#FFE7F0",
		color: "var(--secondary-800)",
		icon: MemoCancel
	},
	"opened": {
		value: "opened",
		label: "Opened",
		bg: "#3871B21A",
		color: "#104BB9",
		icon: ListCheck
	},
	"confirmed": {
		value: "confirmed",
		label: "Confirmed",
		bg: "#3871B21A",
		color: "#104BB9",
		icon: ListCheck
	},
	"muted": {
		value: "muted",
		label: "Muted",
		bg: "#F5F5F5",
		color: "#6B7280",
		icon: MemoCancel
	},
	"paused": {
		value: "paused",
		label: "Paused",
		bg: "#F5F5F5",
		color: "#6B7280",
		icon: PlayCircle
	},
}


export const listingSummaryCards = {
	total_revenue: {
		value: 0,
		title: "Total revenue",
		rate: 0,
		isAmount: true,
		desc: "from last month",
	},
	total_listings: {
		value: 0,
		title: "Total listings",
		rate: 0,
		desc: "from last month",
	},
	active_listings: {
		value: 0,
		title: "Active listings",
		rate: 0,
		desc: "from last month",
	},
	pending_listings: {
		value: 0,
		title: "Pending listings",
		rate: 0,
		desc: "from last month",
	},
	rejected_listings: {
		value: 0,
		title: "Rejected listings",
		rate: 0,
		desc: "from last month",
	},
	paid_listings: {
		value: 0,
		title: "Paid listings",
		rate: 0,
		desc: "from last month",
	},
	free_listings: {
		value: 0,
		title: "Free listings",
		rate: 0,
		desc: "from last month",
	},
	expired_listings: {
		value: 0,
		title: "Expired listings",
		rate: 0,
		desc: "from last month",
	},
	// total_active_listings_for_sales: {
	// 	value: 0,
	// 	title: "Total active listings for sales",
	// 	rate: 0,
	// 	desc: "from last month",
	// },
	// total_active_listings_for_rent: {
	// 	value: 0,
	// 	title: "Total active listings for rent",
	// 	rate: 0,
	// 	desc: "from last month",
	// },
}


export const staticUnits = [
	{ label: "- None -", value: "none" },
	{ label: "Square Feet", value: "sqft" },
	{ label: "Square Meters", value: "sqm" },
	{ label: "Acre", value: "acre" },
	{ label: "Hectare", value: "hectare" },
];

export const fieldTypes = [
	{ label: "Text", value: "text" },
	{ label: "Number", value: "number" },
	{ label: "Radio", value: "radio" },
	{ label: "Select", value: "select" },
	{ label: "Checkbox", value: "checkbox" },
]


export const statusColors: Record<string, string> = {
	active: "bg-[#2202DA1A] text-[#2202DA]",
	suspended: "bg-[#FFE7F0] text-[#990D41]",
	expired: "bg-[#FFE7F0] text-[#990D41]",
	pending: "bg-[#FFF1E5] text-[#F59E0B]",
	inactive: "bg-[#2B29281A] text-[#2B2928]",
}

export const demoImage = "https://avatar.iran.liara.run/public";


// export const categoryIcons = {
// 	house: { url: house },
// 	apartment: { url: apartment },
// 	story: { url: story },
// }



const categoryIconImages = import.meta.glob("../assets/categories-svgs/*.svg", { eager: true }) as Record<string, { default: string }>;

export const categoryIcons: Record<string, { url: string }> = Object.keys(categoryIconImages).reduce((acc, path) => {
	const key = path.split("/").pop()?.replace(".svg", "") || ""; // Extract filename without extension
	acc[key] = { url: categoryIconImages[path].default }
	return acc;
}, {} as Record<string, { url: string }>);


export const MAPBOX_TOKEN = "pk.eyJ1Ijoib25pZmFkam9zaCIsImEiOiJjbTcxMzRlMncwODV4MmxwY3g2YmFlaXlyIn0.qYhRqhmdl7sUHzZyGCf-8g"

export const demoSubscriptionPayments = [
	{
		property: { image: `https://source.unsplash.com/random/200x200?sig=${Math.floor(Math.random() * 4) + 1}`, name: "Modern Apartment" },
		user: { passport: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 11) + 20}`, firstname: "John", lastname: "Doe" },
		category: { id: "1", label: "Apartment" },
		amount: 50,
		due_date: "2024-10-10",
		attempts: 1,
		status: "active"
	},
	{
		property: { image: `https://source.unsplash.com/random/200x200?sig=${Math.floor(Math.random() * 4) + 1}`, name: "Suburban Home" },
		user: { passport: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 11) + 20}`, firstname: "Jane", lastname: "Smith" },
		category: { id: "2", label: "Home" },
		amount: 75,
		due_date: "2024-10-12",
		attempts: 2,
		status: "pending"
	},
	{
		property: { image: `https://source.unsplash.com/random/200x200?sig=${Math.floor(Math.random() * 4) + 1}`, name: "Downtown Condo" },
		user: { passport: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 11) + 20}`, firstname: "Michael", lastname: "Brown" },
		category: { id: "3", label: "Condo" },
		amount: 100,
		due_date: "2024-10-15",
		attempts: 1,
		status: "failed"
	},
	{
		property: { image: `https://source.unsplash.com/random/200x200?sig=${Math.floor(Math.random() * 4) + 1}`, name: "Luxury Villa" },
		user: { passport: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 11) + 20}`, firstname: "Emily", lastname: "Davis" },
		category: { id: "4", label: "Villa" },
		amount: 250,
		due_date: "2024-10-18",
		attempts: 3,
		status: "active"
	},
	{
		property: { image: `https://source.unsplash.com/random/200x200?sig=${Math.floor(Math.random() * 4) + 1}`, name: "Cozy Cottage" },
		user: { passport: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 11) + 20}`, firstname: "Daniel", lastname: "Miller" },
		category: { id: "5", label: "Cottage" },
		amount: 60,
		due_date: "2024-10-20",
		attempts: 1,
		status: "pending"
	},
	{
		property: { image: `https://source.unsplash.com/random/200x200?sig=${Math.floor(Math.random() * 4) + 1}`, name: "Farmhouse" },
		user: { passport: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 11) + 20}`, firstname: "Sophia", lastname: "Wilson" },
		category: { id: "6", label: "Farm" },
		amount: 90,
		due_date: "2024-10-22",
		attempts: 2,
		status: "failed"
	},
	{
		property: { image: `https://source.unsplash.com/random/200x200?sig=${Math.floor(Math.random() * 4) + 1}`, name: "Mountain Cabin" },
		user: { passport: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 11) + 20}`, firstname: "William", lastname: "Taylor" },
		category: { id: "7", label: "Cabin" },
		amount: 80,
		due_date: "2024-10-25",
		attempts: 1,
		status: "active"
	},
	{
		property: { image: `https://source.unsplash.com/random/200x200?sig=${Math.floor(Math.random() * 4) + 1}`, name: "Urban Loft" },
		user: { passport: `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 11) + 20}`, firstname: "Olivia", lastname: "Anderson" },
		category: { id: "8", label: "Loft" },
		amount: 120,
		due_date: "2024-10-28",
		attempts: 2,
		status: "pending"
	},
]