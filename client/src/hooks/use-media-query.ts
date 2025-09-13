import { useEffect, useMemo, useState } from "react";

type UseMediaQueryOptions = {
  /** ค่าเริ่มต้นตอน SSR/ยังไม่มี window (กัน layout shift) */
  defaultValue?: boolean;
  /** ปิดเอฟเฟกต์ตอน mount (ถ้าคุณคุมค่าจาก server เอง) */
  initializeWithValue?: boolean;
};

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (): boolean => {
    if (typeof window === "undefined" || !initializeWithValue) {
      return defaultValue;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(() => getMatches());

  // เก็บ MediaQueryList เดิมไว้เพื่อไม่สร้างใหม่ทุก render
  const mql = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia(query);
  }, [query]);

  useEffect(() => {
    if (!mql) return;

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // ใช้ addEventListener เท่านั้น (API ปัจจุบัน)
    mql.addEventListener("change", handleChange);

    // อัปเดตค่าเริ่มต้น
    setMatches(mql.matches);

    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, [mql]);

  return matches;
}
