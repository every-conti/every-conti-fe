"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "src/store/useAuthStore";
import type { ComponentType, FC } from "react";

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>): FC<P> {
    const ProtectedComponent: FC<P> = (props) => {
        const { user, loading } = useAuthStore();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.replace("/login");
            }
        }, [loading, user]);

        if (loading || !user) return null;

        return <WrappedComponent {...props} />;
    };

    return ProtectedComponent;
}
