"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
    const { user, authStatus } = useAuthenticator((context) => [context.user, context.authStatus]);
    const router = useRouter();

    useEffect(() => {
        if (authStatus === 'unauthenticated') {
            router.push('/');
        }
    }, [authStatus, router]);

    if (authStatus === 'configuring') {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    // If unauthenticated, we render nothing while redirecting (or loading)
    if (authStatus === 'unauthenticated') {
        return null;
    }

    return <>{children}</>;
}
