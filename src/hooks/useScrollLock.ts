import { useEffect } from "react";

export function useScrollLock(locked: boolean) {
    useEffect(() => {
        if (!locked) return;

        const scrollY = window.scrollY;
        const { style } = document.body;
        const original = {
            overflow: style.overflow,
            position: style.position,
            top: style.top,
            width: style.width,
            paddingRight: style.paddingRight,
        };

        // 스크롤바 폭 보정(레이아웃 점프 방지)
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) style.paddingRight = `${scrollbarWidth}px`;

        // 바디 고정(모바일/사파리 대응)
        style.overflow = "hidden";
        style.position = "fixed";
        style.top = `-${scrollY}px`;
        style.width = "100%";

        return () => {
            style.overflow = original.overflow;
            style.position = original.position;
            style.top = original.top;
            style.width = original.width;
            style.paddingRight = original.paddingRight;

            // 기존 위치로 복구
            const y = Math.abs(parseInt(style.top || "0", 10)) || scrollY;
            window.scrollTo(0, y);
        };
    }, [locked]);
}
