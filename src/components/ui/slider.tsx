"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {cn} from "src/lib/utils";


interface SliderWithLoad extends React.ComponentProps<typeof SliderPrimitive.Root>{
    loadedPercent?: number;
    variant?: "default" | "thin";
    sliderBarBG?: string;
}

function Slider({
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    loadedPercent = 0,
    sliderBarBG,
    variant = "default",
    ...props
}: SliderWithLoad) {
    const _values = React.useMemo(
        () =>
            Array.isArray(value)
                ? value
                : Array.isArray(defaultValue)
                    ? defaultValue
                    : [min, max],
        [value, defaultValue, min, max],
    );
    const isThin = variant === "thin";

    return (
        <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className={cn(
                "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
                // vertical 공통
                "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
                className,
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className={cn(
                    "bg-muted relative grow overflow-hidden rounded-full",
                    // 두께: variant에 따라
                    isThin
                        ? "data-[orientation=horizontal]:h-[3px] data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-[3px] data-[orientation=vertical]:h-full"
                        : "data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-1.5 data-[orientation=vertical]:h-full",
                )}
            >
                {/* 로드된 구간: 트랙 높이에 맞춰 꽉 채우기 */}
                {loadedPercent > 0 && (
                    <div
                        className={cn(
                            "absolute left-0 bg-gray-300/60 pointer-events-none transition-all",
                            "data-[orientation=horizontal]:inset-y-0 data-[orientation=vertical]:inset-x-0",
                        )}
                        style={{ width: `${loadedPercent}%`, zIndex: 0 }}
                    />
                )}

                <SliderPrimitive.Range
                    data-slot="slider-range"
                    className={cn("absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
                        sliderBarBG ?? "bg-primary"
                    )}
                />
            </SliderPrimitive.Track>

            {Array.from({ length: _values.length }, (_, index) => (
                <SliderPrimitive.Thumb
                    data-slot="slider-thumb"
                    key={index}
                    className={cn(
                        "border-primary bg-background ring-ring/50 block rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
                        isThin ? "size-3" : "size-4",
                    )}
                />
            ))}
        </SliderPrimitive.Root>
    );
}

export { Slider };
