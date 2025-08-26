"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "src/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // ✅ 상태별 배경색
        "peer data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300",
        // ✅ 포커스 테두리
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
        // ✅ 다크모드
        "dark:data-[state=unchecked]:bg-gray-600 dark:data-[state=checked]:bg-blue-400",
        // ✅ 기본 스타일
        "inline-flex h-[1.25rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
