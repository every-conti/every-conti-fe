"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Checkbox } from "src/components/ui/checkbox";
import { cn } from "src/lib/utils";

type Option = { id: string; label: string };

interface MultiSelectProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "선택",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      // 캡처 단계에서 먼저 감지하게 함
      document.addEventListener("mousedown", handleClickOutside, true);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const isSelected = (id: string) => selected.some((s) => s.id === id);
  const toggle = (option: Option) => {
    if (isSelected(option.id)) {
      onChange(selected.filter((s) => s.id !== option.id));
    } else {
      onChange([...selected, option]);
    }
  };

  const filtered = options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        className="justify-between w-40 md:w-60"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={cn(
            "truncate overflow-hidden whitespace-nowrap max-w-[calc(100%-1.5rem)] text-left",
            selected.length === 0 && "text-muted-foreground"
          )}
        >
          {selected.length > 0 ? selected.map((s) => s.label).join(", ") : placeholder}
        </span>

        <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow-md">
          <div className="p-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="검색..."
              className="h-8 text-sm"
            />
          </div>
          <div className="max-h-60 overflow-y-auto px-2 py-1">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggle(opt)}
                  className={cn(
                    "flex items-center w-full px-2 py-1.5 text-sm rounded hover:bg-accent",
                    isSelected(opt.id) && "bg-accent"
                  )}
                >
                  <Checkbox checked={isSelected(opt.id)} className="mr-2" />
                  {opt.label}
                </button>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-gray-400">검색 결과 없음</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
