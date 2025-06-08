"use client";

import { useGetMe } from "@/features/auth";

export default function HomePage() {
  const { data: user } = useGetMe();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      HomePage
    </div>
  );
}
