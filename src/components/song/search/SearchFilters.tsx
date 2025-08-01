"use client";
import { useEffect, useState } from "react";

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
import { SongTypeKorean, SongTypeTypes } from "src/types/song/song-type.types";
import { SongKeyKorean, SongKeyTypes } from "src/types/song/song-key.types";
import { SearchPropertiesDto } from "src/dto/search/search-properties.dto";
import PraiseTeamDto from "src/dto/common/praise-team.dto";
import {
  SongTempoKorean,
  SongTempoTypes,
} from "src/types/song/song-tempo.types";
import SongSeasonDto from "src/dto/common/song-season.dto";
import BibleDto from "src/dto/common/bible.dto";
import SongThemeDto from "src/dto/common/song-theme.dto";
import SearchableSelect from "./SearchableSelect";
import MultiSelect from "./MultiSelect";
import BibleChapterDto from "src/dto/common/bible-chapter.dto";
import BibleVerseDto from "src/dto/common/bible-verse.dto";
import { fetchBibleChapter, fetchBibleVerse } from "src/app/api/song";
import {SONG_SELECT_PLACEHOLDERS} from "src/constant/song-select-placeholders.constant";
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
  selectedThemes: SongThemeDto[];
  setSelectedThemes: (themes: SongThemeDto[]) => void;
  selectedTempo: SongTempoTypes | null;
  setSelectedTempo: (tempo: SongTempoTypes | null) => void;
  selectedSeason: SongSeasonDto | null;
  setSelectedSeason: (season: SongSeasonDto | null) => void;
  selectedDuration: number | null;
  setSelectedDuration: (duration: number | null) => void;
  selectedBible: BibleDto | null;
  setSelectedBible: (bible: BibleDto | null) => void;
  selectedBibleChapter: BibleChapterDto | null;
  setSelectedBibleChapter: (chapter: BibleChapterDto | null) => void;
  selectedBibleVerse: BibleVerseDto | null;
  setSelectedBibleVerse: (verse: BibleVerseDto | null) => void;
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
  selectedThemes,
  setSelectedThemes,
  selectedTempo,
  setSelectedTempo,
  selectedSeason,
  setSelectedSeason,
  selectedDuration,
  setSelectedDuration,
  selectedBible,
  setSelectedBible,
  selectedBibleChapter,
  setSelectedBibleChapter,
  selectedBibleVerse,
  setSelectedBibleVerse,
}: SearchFiltersProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     const allDropdowns = document.querySelectorAll("button");
  //     console.log(allDropdowns);
  //     const clickedInsideSome = Array.from(allDropdowns).some((el) =>
  //       el.contains(event.target as Node)
  //     );
  //     if (!clickedInsideSome) {
  //       setOpenSelectId(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // useEffect(() => {
  //   console.log("openSelectId", openSelectId);
  // }, [openSelectId]);

  const keys = searchProperties.songKeys;
  const songTypes = searchProperties.songTypes;
  const praiseTeams = searchProperties.praiseTeams;
  const bibles = searchProperties.bibles;
  const songThemes = searchProperties.songThemes;
  const songTempos = searchProperties.songTempos;
  const seasons = searchProperties.seasons;
  const [chapters, setChapters] = useState<BibleChapterDto[]>([]);
  const [verses, setVerses] = useState<BibleVerseDto[]>([]);

  const hasActiveFilters =
    selectedKey !== null ||
    selectedSongType !== null ||
    selectedPraiseTeam !== null ||
    (selectedThemes && selectedThemes.length > 0) ||
    selectedTempo !== null ||
    selectedSeason !== null ||
    selectedBible !== null ||
    selectedDuration !== null ||
    selectedBibleChapter !== null ||
    selectedBibleVerse !== null;

  const clearFilters = () => {
    setSelectedKey(null);
    setSelectedSongType(null);
    setSelectedPraiseTeam(null);
    setSelectedThemes([]);
    setSelectedTempo(null);
    setSelectedSeason(null);
    setSelectedBible(null);
    setSelectedDuration(null);
    setSelectedBibleChapter(null);
    setSelectedBibleVerse(null);
  };

  async function getBibleChapter(bibleId: string) {
    const chapters = await fetchBibleChapter(bibleId);
    setChapters(chapters || []);
  }
  async function getBibleVerse(bibleChapterId: string) {
    const verses = await fetchBibleVerse(bibleChapterId);
    setVerses(verses || []);
  }

  useEffect(() => {
    if (selectedBible == null) {
      setSelectedBibleChapter(null);
      setSelectedBibleVerse(null);
      return;
    } else {
      getBibleChapter(selectedBible.id);
    }
  }, [selectedBible]);

  useEffect(() => {
    if (selectedBibleChapter == null) {
      setSelectedBibleVerse(null);
      return;
    } else {
      getBibleVerse(selectedBibleChapter.id);
    }
  }, [selectedBibleChapter]);

  return (
    <div className="bg-white p-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 검색창 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="찬양 제목이나 가사를 검색하세요..."
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-base"
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <Button
            size="sm"
            className={
              filterOpen
                ? "w-18 justify-between bg-blue-700"
                : "w-18 justify-between bg-blue-500"
            }
            onClick={() => setFilterOpen((prev) => !prev)}
          >
            <Filter className="w-4 h-4 text-white" />
            <span className="text-sm text-white">필터</span>
          </Button>
          {/* <div className="flex items-center space-x-2">
            
          </div> */}
          {filterOpen && (
            <>
              <Select
                open={openSelectId === "songType"}
                onOpenChange={(isOpen) =>
                  setOpenSelectId(isOpen ? "songType" : null)
                }
                value={selectedSongType ? selectedSongType : "장르 선택"}
                onValueChange={(value) =>
                  setSelectedSongType(
                    value === "장르 선택" ? null : (value as SongTypeTypes)
                  )
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="장르 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="장르 선택">장르 선택</SelectItem>
                  {songTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {SongTypeKorean[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <SearchableSelect
                options={praiseTeams.map((t) => ({
                  id: t.id,
                  label: t.praiseTeamName,
                }))}
                selected={
                  selectedPraiseTeam
                    ? {
                        id: selectedPraiseTeam.id,
                        label: selectedPraiseTeam.praiseTeamName,
                      }
                    : null
                }
                onSelect={(opt) => {
                  const team = praiseTeams.find((t) => t.id === opt?.id);
                  setSelectedPraiseTeam(team ?? null);
                }}
                placeholder="찬양팀 선택"
                includeDefaultOption={true}
                defaultLabel="전체"
              />

              <MultiSelect
                open={openSelectId === "songThemes"}
                onOpenChange={(isOpen) => {
                  console.log("isOpen", isOpen);
                  setOpenSelectId(isOpen ? "songThemes" : null);
                }}
                options={songThemes.map((t) => ({
                  id: t.id,
                  label: t.themeName,
                }))}
                placeholder="테마 선택"
                selected={
                  selectedThemes
                    ? selectedThemes.map((t) => ({
                        id: t.id,
                        label: t.themeName,
                      }))
                    : []
                }
                onChange={(selectedOptions) => {
                  const selectedDtos =
                    selectedOptions.length > 0
                      ? songThemes.filter((theme) =>
                          selectedOptions.some((opt) => opt.id === theme.id)
                        )
                      : [];
                  setSelectedThemes(selectedDtos);
                }}
              />
            </>
          )}
        </div>

        {filterOpen && (
          <>
            {/* 필터 옵션 */}
            <div className="flex flex-wrap gap-4 items-center">
              <Select
                open={openSelectId === "songTempo"}
                onOpenChange={(isOpen) => {
                  setOpenSelectId(isOpen ? "songTempo" : null);
                }}
                value={selectedTempo ? selectedTempo : SONG_SELECT_PLACEHOLDERS.songTempo}
                onValueChange={(value) =>
                  setSelectedTempo(
                    value === SONG_SELECT_PLACEHOLDERS.songTempo
                      ? null
                      : (value as SongTempoTypes)
                  )
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songTempo} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SONG_SELECT_PLACEHOLDERS.songTempo}>템포 선택</SelectItem>
                  {songTempos.map((tempo) => (
                    <SelectItem key={tempo} value={tempo}>
                      {SongTempoKorean[tempo]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                open={openSelectId === "songKey"}
                onOpenChange={(isOpen) =>
                  setOpenSelectId(isOpen ? "songKey" : null)
                }
                value={selectedKey ? selectedKey : SONG_SELECT_PLACEHOLDERS.songKey}
                onValueChange={(value) =>
                  setSelectedKey(
                    value === SONG_SELECT_PLACEHOLDERS.songKey ? null : (value as SongKeyTypes)
                  )
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songKey} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SONG_SELECT_PLACEHOLDERS.songKey}>키 선택</SelectItem>
                  {keys.map((key) => (
                    <SelectItem key={key} value={key}>
                      {SongKeyKorean[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                open={openSelectId === "songSeason"}
                onOpenChange={(isOpen) =>
                  setOpenSelectId(isOpen ? "songSeason" : null)
                }
                value={selectedSeason ? selectedSeason.id : SONG_SELECT_PLACEHOLDERS.songSeason}
                onValueChange={(value) =>
                  setSelectedSeason(
                    value === SONG_SELECT_PLACEHOLDERS.songSeason
                      ? null
                      : (seasons.find(
                          (season) => season.id === value
                        ) as SongSeasonDto)
                  )
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songSeason} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SONG_SELECT_PLACEHOLDERS.songSeason}>
                    {SONG_SELECT_PLACEHOLDERS.songSeason}
                  </SelectItem>
                  {seasons.map((season) => (
                    <SelectItem key={season.id} value={season.id}>
                      {season.seasonName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                open={openSelectId === "songBible"}
                onOpenChange={(isOpen) =>
                  setOpenSelectId(isOpen ? "songBible" : null)
                }
                value={selectedBible ? selectedBible.id : SONG_SELECT_PLACEHOLDERS.songBible}
                onValueChange={(value) =>
                  setSelectedBible(
                    value === SONG_SELECT_PLACEHOLDERS.songBible
                      ? null
                      : (bibles.find((bible) => bible.id === value) as BibleDto)
                  )
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songBible} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SONG_SELECT_PLACEHOLDERS.songBible}>성경 선택</SelectItem>
                  {bibles.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.bibleKoName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedBible && (
                <Select
                  open={openSelectId === "songBibleChapter"}
                  onOpenChange={(isOpen) =>
                    setOpenSelectId(isOpen ? "songBibleChapter" : null)
                  }
                  value={
                    selectedBibleChapter
                      ? selectedBibleChapter.id
                      : SONG_SELECT_PLACEHOLDERS.songBibleChapter
                  }
                  onValueChange={(value) =>
                    setSelectedBibleChapter(
                      value === SONG_SELECT_PLACEHOLDERS.songBibleChapter
                        ? null
                        : (chapters.find(
                            (chapter) => chapter.id === value
                          ) as BibleChapterDto)
                    )
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="장 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SONG_SELECT_PLACEHOLDERS.songBibleChapter}>
                      {SONG_SELECT_PLACEHOLDERS.songBibleChapter}
                    </SelectItem>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.chapterNum}장
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {selectedBibleChapter && (
                <Select
                  open={openSelectId === "songBibleVerse"}
                  onOpenChange={(isOpen) =>
                    setOpenSelectId(isOpen ? "songBibleVerse" : null)
                  }
                  value={
                    selectedBibleVerse
                      ? selectedBibleVerse.id
                      : SONG_SELECT_PLACEHOLDERS.songBibleVerse
                  }
                  onValueChange={(value) =>
                    setSelectedBibleVerse(
                      value === SONG_SELECT_PLACEHOLDERS.songBibleVerse
                        ? null
                        : (verses.find(
                            (verse) => verse.id === value
                          ) as BibleVerseDto)
                    )
                  }
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songBibleVerse} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SONG_SELECT_PLACEHOLDERS.songBibleVerse}>
                      {SONG_SELECT_PLACEHOLDERS.songBibleVerse}
                    </SelectItem>
                    {verses.map((verse) => (
                      <SelectItem key={verse.id} value={verse.id}>
                        {verse.verseNum}절
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </>
        )}

        {/* 활성 필터 표시 */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedKey !== null && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 flex items-center gap-1 cursor-pointer"
                onClick={() => setSelectedKey(null)}
              >
                키: {selectedKey}
                <X className="w-3 h-3" />
              </Badge>
            )}

            {selectedSongType !== null && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 flex items-center gap-1 cursor-pointer"
                onClick={() => setSelectedSongType(null)}
              >
                장르: {SongTypeKorean[selectedSongType]}
                <X className="w-3 h-3 " />
              </Badge>
            )}

            {selectedPraiseTeam !== null && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 flex items-center gap-1 cursor-pointer"
                onClick={() => setSelectedPraiseTeam(null)}
              >
                찬양팀: {selectedPraiseTeam?.praiseTeamName}
                <X className="w-3 h-3" />
              </Badge>
            )}

            {selectedThemes &&
              selectedThemes.length > 0 &&
              selectedThemes.map((theme) => (
                <Badge
                  key={theme.id}
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 flex items-center gap-1 curor-pointer"
                  onClick={() =>
                    setSelectedThemes(
                      selectedThemes.filter((t) => t.id !== theme.id)
                    )
                  }
                >
                  테마: {theme.themeName}
                  <X className="w-3 h-3" />
                </Badge>
              ))}

            {selectedTempo !== null && (
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-800 flex items-center gap-1 cursor-pointer"
                onClick={() => setSelectedTempo(null)}
              >
                템포: {SongTempoKorean[selectedTempo]}
                <X className="w-3 h-3" />
              </Badge>
            )}

            {selectedSeason !== null && (
              <Badge
                variant="secondary"
                className="bg-teal-100 text-teal-800 flex items-center gap-1 cursor-pointer"
                onClick={() => setSelectedSeason(null)}
              >
                절기: {selectedSeason.seasonName}
                <X className="w-3 h-3" />
              </Badge>
            )}

            {selectedBible !== null && (
              <Badge
                variant="secondary"
                className="bg-pink-100 text-pink-800 flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  console.log("clear bible filter");
                  setSelectedBible(null);
                  setSelectedBibleChapter(null);
                  setSelectedBibleVerse(null);
                }}
              >
                성경: {selectedBible.bibleKoName}
                {selectedBibleChapter
                  ? ` ${selectedBibleChapter.chapterNum}장`
                  : ""}
                {selectedBibleVerse ? ` ${selectedBibleVerse.verseNum}절` : ""}
                <X className="w-3 h-3" />
              </Badge>
            )}

            {selectedDuration !== null && (
              <Badge
                variant="secondary"
                className="bg-gray-100 text-gray-800 flex items-center gap-1 cursor-pointer"
                onClick={() => {
                  console.log("clear duration filter");
                  setSelectedDuration(null);
                }}
              >
                지속시간: {selectedDuration}분
                <X className="w-3 h-3" />
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600"
            >
              <X className="w-4 h-4 mr-1" />
              필터 초기화
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
