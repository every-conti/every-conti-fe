"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "src/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      align="center"
      sideOffset={8}
      className={cn("z-50 rounded-md border bg-white p-4 shadow-md outline-none", className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
);

export { Popover, PopoverTrigger, PopoverContent };
