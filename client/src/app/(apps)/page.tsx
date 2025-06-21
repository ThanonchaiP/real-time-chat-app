"use client";

import { useGetMe } from "@/features/auth";

export default function HomePage() {
  const { data, isError } = useGetMe();

  return (
    <>
      <div>Please Select Room</div>
    </>
  );
}
