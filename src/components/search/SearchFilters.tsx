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
import { SongTypeTypes } from "src/types/song/song-type.types";
import { SongKeyTypes } from "src/types/song/song-key.types";
import { SearchPropertiesDto } from "src/dto/search/search-properties.dto";
import PraiseTeamDto from "src/dto/common/praise-team.dto";

interface SearchFiltersProps {
  searchProperties: SearchPropertiesDto;
  searchTerm: string | null;
  setSearchTerm: (term: string) => void;
  selectedKey: SongKeyTypes | null;
  setSelectedKey: (key: SongKeyTypes | null) => void;
  selectedSongType: SongTypeTypes | null;
  setSelectedSongType: (type: SongTypeTypes | null) => void;
  selectedPraiseTeam: PraiseTeamDto | null;
  setSelectedPraiseTeam: (team: PraiseTeamDto | null) => void;
}

export default function SearchFilters({
  searchProperties,
  searchTerm,
  setSearchTerm,
  selectedKey,
  setSelectedKey,
  selectedSongType,
  setSelectedSongType,
  selectedPraiseTeam,
  setSelectedPraiseTeam,
}: SearchFiltersProps) {
  const keys = searchProperties.songKeys;
  const songTypes = searchProperties.songTypes;
  const praiseTeams = searchProperties.praiseTeams;
  const bibles = searchProperties.bibles;
  const songThemes = searchProperties.songThemes.map(
    (theme) => theme.songThemeName
  );
  const songTempos = searchProperties.songTempos;
  const seasons = searchProperties.seasons.map((season) => season.seasonName);

  const hasActiveFilters =
    selectedKey !== null ||
    selectedSongType !== null ||
    selectedPraiseTeam !== null;

  const clearFilters = () => {
    setSelectedKey(null);
    setSelectedSongType(null);
    setSelectedPraiseTeam(null);
  };

  return (
    <div className="bg-white p-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 검색창 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="찬양 제목이나 아티스트를 검색하세요..."
            value={searchTerm || ""}
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

          <Select
            value={selectedKey ? selectedKey : "전체"}
            onValueChange={(value) =>
              setSelectedKey(value === "전체" ? null : (value as SongKeyTypes))
            }
          >
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

          <Select
            value={selectedSongType ? selectedSongType : "전체"}
            onValueChange={(value) =>
              setSelectedSongType(
                value === "전체" ? null : (value as SongTypeTypes)
              )
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="장르 선택" />
            </SelectTrigger>
            <SelectContent>
              {songTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedPraiseTeam ? selectedPraiseTeam.id : "전체"}
            onValueChange={(value) =>
              setSelectedPraiseTeam(
                value === "전체"
                  ? null
                  : (praiseTeams.find(
                      (team) => team.id === value
                    ) as PraiseTeamDto)
              )
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="아티스트 선택" />
            </SelectTrigger>
            <SelectContent>
              {praiseTeams.map((team: PraiseTeamDto) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.praiseTeamName}
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
            {selectedKey !== null && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                키: {selectedKey}
              </Badge>
            )}
            {selectedSongType !== null && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                장르: {selectedSongType}
              </Badge>
            )}
            {selectedPraiseTeam !== null && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800"
              >
                아티스트: {selectedPraiseTeam?.praiseTeamName}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
