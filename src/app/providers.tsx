"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { DarkModeProvider } from "@/components/DarkModeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            })
    );

    return (
        <DarkModeProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </DarkModeProvider>
    );
}
