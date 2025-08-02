import { useState, useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "src/components/ui/select";
import { Input } from "src/components/ui/input";

type OptionType = { id: string; label: string };

interface SearchableSelectProps {
  options: OptionType[];
  selected: OptionType | null;
  onSelect: (option: OptionType | null) => void;
  placeholder?: string;
  className?: string;
  includeDefaultOption?: boolean; // 기본 옵션 포함 여부
  defaultLabel?: string; // 기본 옵션에 보여질 라벨 (ex. 전체, 선택 안함)
}

export default function SearchableSelect({
  options,
  selected,
  onSelect,
  placeholder = "선택하세요",
  className = "w-36",
  includeDefaultOption = true,
  defaultLabel = "전체",
}: SearchableSelectProps) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options]);

  return (
    <Select
      value={selected?.id ?? ""}
      onValueChange={(val) => {
        if (val === "") {
          onSelect(null);
        } else {
          const selectedOption = options.find((opt) => opt.id === val);
          if (selectedOption) onSelect(selectedOption);
        }
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="검색..."
            className="h-8 text-sm"
          />
        </div>

        {includeDefaultOption && (
          <SelectItem value={`${defaultLabel}`}>{defaultLabel}</SelectItem>
        )}

        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt.label}
            </SelectItem>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            검색 결과 없음
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
