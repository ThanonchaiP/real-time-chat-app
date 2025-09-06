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
) {
  const getMatches = () => {
    if (typeof window === "undefined" || !initializeWithValue)
      return defaultValue;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState<boolean>(getMatches);

  // เก็บ MediaQueryList เดิมไว้เพื่อไม่สร้างใหม่ทุก render
  const mql = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.matchMedia(query);
  }, [query]);

  useEffect(() => {
    if (!mql) return;

    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    // รองรับทั้ง API ใหม่/เก่า
    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange);
      setMatches(mql.matches);
      return () => mql.removeEventListener("change", onChange);
    } else {
      // @ts-expect-error: fallback for old Safari
      mql.addListener(onChange);
      // @ts-expect-error
      setMatches(mql.matches);
      return () => {
        // @ts-expect-error
        mql.removeListener(onChange);
      };
    }
  }, [mql]);

  return matches;
}
