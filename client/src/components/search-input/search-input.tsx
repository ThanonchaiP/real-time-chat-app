"use client";

import { Search } from "lucide-react";
import { ComponentProps, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks";

type SearchInputProps = ComponentProps<"input"> & {
  debounceDelay?: number;
  onDebounce?: (value: string) => void;
};

export function SearchInput({
  className,
  debounceDelay,
  onDebounce,
  ...props
}: SearchInputProps) {
  const [value, setValue] = useState("");

  const debouncedValue = useDebounce(value, debounceDelay ?? 500);

  useEffect(() => {
    if (onDebounce) {
      onDebounce(debouncedValue);
    }
  }, [debouncedValue, onDebounce]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="Search messages or users"
        className={cn(
          "pl-10 h-[45px] bg-[#E6EBF5] focus-visible:ring-0 focus-visible:outline-none focus-visible:border-transparent",
          className
        )}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
    </div>
  );
}
