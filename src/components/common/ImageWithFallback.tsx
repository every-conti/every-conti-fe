"use client";

import React, { useState } from "react";
import noImage from "src/assets/no-image.png";

const ERROR_IMG_SRC =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export function ImageWithFallback(
    props: React.ImgHTMLAttributes<HTMLImageElement>,
) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  // src 없거나 에러난 경우 -> 회색 배경 + noImage
  if (!src || didError) {
    return (
        <div
            className={`inline-flex items-center justify-center bg-gray-200 ${className ?? ""}`}
            style={style}
        >
          <img
              src={didError ? ERROR_IMG_SRC : noImage.src}
              alt={alt ?? "No image available"}
              {...rest}
          />
        </div>
    );
  }

  // 정상 이미지
  return (
      <img
          src={src}
          alt={alt}
          className={className}
          style={style}
          {...rest}
          onError={handleError}
      />
  );
}
