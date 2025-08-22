"use client";

import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingSkeleton />}>{children}</Suspense>;
}