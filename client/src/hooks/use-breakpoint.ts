import { useMediaQuery } from "./use-media-query";

const screens = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

export const useBreakpoint = () => {
  const sm = useMediaQuery(screens.sm);
  const md = useMediaQuery(screens.md);
  const lg = useMediaQuery(screens.lg);
  const xl = useMediaQuery(screens.xl);
  const x2l = useMediaQuery(screens["2xl"]);

  // helper: ชี้ว่าตอนนี้อยู่ที่ breakpoint ไหน (ตรงสุด)
  const current =
    (x2l && "2xl") ||
    (xl && "xl") ||
    (lg && "lg") ||
    (md && "md") ||
    (sm && "sm") ||
    "base";

  return { sm, md, lg, xl, x2l, current };
};
