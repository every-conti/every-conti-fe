import { Button } from "src/components/ui/button";

import { Input } from "src/components/ui/input";
import { Badge } from "src/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Search, Filter, X } from "lucide-react";

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  selectedArtist: string;
  setSelectedArtist: (artist: string) => void;
}

export default function SearchFilters({
  searchTerm,
  setSearchTerm,
  selectedKey,
  setSelectedKey,
  selectedGenre,
  setSelectedGenre,
  selectedArtist,
  setSelectedArtist,
}: SearchFiltersProps) {
  const keys = ["전체", "C", "D", "E", "F", "G", "A", "B"];
  const genres = ["전체", "워십", "찬양", "CCM", "복음성가", "어린이찬양"];
  const artists = [
    "전체",
    "마커스워십",
    "어노인팅",
    "제이어스",
    "디사이플스",
    "청년부",
  ];

  const hasActiveFilters =
    selectedKey !== "전체" ||
    selectedGenre !== "전체" ||
    selectedArtist !== "전체";

  const clearFilters = () => {
    setSelectedKey("전체");
    setSelectedGenre("전체");
    setSelectedArtist("전체");
  };

  return (
    <div className="bg-white p-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 검색창 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="찬양 제목이나 아티스트를 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-base"
          />
        </div>

        {/* 필터 옵션 */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">필터:</span>
          </div>

          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="키 선택" />
            </SelectTrigger>
            <SelectContent>
              {keys.map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="장르 선택" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedArtist} onValueChange={setSelectedArtist}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="아티스트 선택" />
            </SelectTrigger>
            <SelectContent>
              {artists.map((artist) => (
                <SelectItem key={artist} value={artist}>
                  {artist}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600"
            >
              <X className="w-4 h-4 mr-1" />
              필터 초기화
            </Button>
          )}
        </div>

        {/* 활성 필터 표시 */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedKey !== "전체" && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                키: {selectedKey}
              </Badge>
            )}
            {selectedGenre !== "전체" && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                장르: {selectedGenre}
              </Badge>
            )}
            {selectedArtist !== "전체" && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
              >
                아티스트: {selectedArtist}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
