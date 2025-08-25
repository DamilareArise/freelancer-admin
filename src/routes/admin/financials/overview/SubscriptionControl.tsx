import { CustomTab, TabsContent } from "@/components/ui/tabs"

const SubscriptionControl = () => {
  return (
    <div className="">
      <CustomTab
        defaultValue="categoryPricing"
        tabs={[
          { label: "Categories Pricing", value: "categoryPricing" },
          { label: "Subscription Pricing", value: "subscriptionPricing" },
        ]}
      >
        <TabsContent value="categoryPricing"></TabsContent>
      </CustomTab>
    </div>
  )
}

export default SubscriptionControl
