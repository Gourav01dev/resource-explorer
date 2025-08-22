import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SuspenseWrapper } from "./SuspenseWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Resource Explorer - Rick and Morty",
    description: "Explore characters from the Rick and Morty universe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-white dark:bg-gray-900 transition-colors duration-200`}>
                <Providers>
                    <SuspenseWrapper>
                        {children}
                    </SuspenseWrapper>
                </Providers>
            </body>
        </html>
    );
}
