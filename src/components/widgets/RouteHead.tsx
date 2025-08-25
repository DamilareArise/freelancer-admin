import { cn } from "@/lib/utils"

const RouteHead = ({
  title,
  className,
}: {
  title: string
  className?: string
}) => {
  return (
    <>
      <h3
        className={cn(
          "text-primary-1000 text-xl md:text-2xl font-semibold",
          className
        )}
      >
        {title}
      </h3>
    </>
  )
}

export default RouteHead
