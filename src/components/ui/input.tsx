import * as React from "react"
import { cn } from "@/lib/utils"
import CurrencyFormat from "react-currency-format"
import { currency } from "@/lib/helpers"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </>
    )
  }
)
Input.displayName = "Input"

const CurrencyInput: React.FC<CurrencyFormat.StrictProps> =
  // const CurrencyInput = React.forwardRef<
  //   HTMLInputElement,
  //   CurrencyFormat.StrictProps
  //   >
  ({ className, ...props }) =>
    // ref
    {
      return (
        <CurrencyFormat
          thousandSeparator=","
          prefix={`${currency.symbol} `}
          // decimalScale={2}
          min={0}
          // ₦
          // ref={ref}
          // onval
          className={cn(
            "flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          // ref={ref}
          {...props}
        />
      )
    }

CurrencyInput.displayName = "CurrencyInput"

export { Input, CurrencyInput }
