"use client";
import {useEffect, useRef, useState} from "react";

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "src/components/ui/collapsible";

import {Search, Filter, X, ChevronUp, ChevronDown, Clock} from "lucide-react";
import { SongTypeKorean, SongTypeTypes } from "src/types/song/song-type.types";
import { SongKeyKorean, SongKeyTypes } from "src/types/song/song-key.types";
import { SearchPropertiesDto } from "src/dto/search/search-properties.dto";
import PraiseTeamDto from "src/dto/common/praise-team.dto";
import { SongTempoKorean, SongTempoTypes } from "src/types/song/song-tempo.types";
import SongSeasonDto from "src/dto/common/song-season.dto";
import BibleDto from "src/dto/common/bible.dto";
import SongThemeDto from "src/dto/common/song-theme.dto";
import SearchableSelect from "./SearchableSelect";
import MultiSelect from "./MultiSelect";
import BibleChapterDto from "src/dto/common/bible-chapter.dto";
import BibleVerseDto from "src/dto/common/bible-verse.dto";
import { fetchBibleChapter, fetchBibleVerse } from "src/app/api/song";
import { SONG_SELECT_PLACEHOLDERS } from "src/constant/song-select-placeholders.constant";
import {reset} from "next/dist/lib/picocolors";
import {Slider} from "src/components/ui/slider";
import {
    MAX_SONG_DURATION,
    MIN_SONG_DURATION,
} from "src/constant/conti/conti-search.constant";

interface SearchFiltersProps {
    searchSongProperties: SearchPropertiesDto;
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
  duration: [number, number];
  setDuration: (duration: [number, number]) => void;
  selectedBible: BibleDto | null;
  setSelectedBible: (bible: BibleDto | null) => void;
  selectedBibleChapter: BibleChapterDto | null;
  setSelectedBibleChapter: (chapter: BibleChapterDto | null) => void;
  selectedBibleVerse: BibleVerseDto | null;
  setSelectedBibleVerse: (verse: BibleVerseDto | null) => void;
  chapters: BibleChapterDto[];
  setChapters: (chapters: BibleChapterDto[]) => void;
  verses: BibleVerseDto[];
  setVerses: (verses: BibleVerseDto[]) => void;
}

export default function SearchFilters({
    searchSongProperties,
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
      duration,
      setDuration,
    selectedBible,
    setSelectedBible,
    selectedBibleChapter,
    setSelectedBibleChapter,
    selectedBibleVerse,
    setSelectedBibleVerse,
    chapters,
    setChapters,
    verses,
    setVerses,
  }: SearchFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [openSelectId, setOpenSelectId] = useState<string | null>(null);

  const keys = searchSongProperties.songKeys;
  const songTypes = searchSongProperties.songTypes;
  const praiseTeams = searchSongProperties.praiseTeams;
  const bibles = searchSongProperties.bibles;
  const songThemes = searchSongProperties.songThemes;
  const songTempos = searchSongProperties.songTempos;
  const seasons = searchSongProperties.seasons;

    const [durationChanging, setDurationChanging] = useState<[number, number]>(duration);
    const durationChangingRef = useRef<[number, number]>(durationChanging);
    useEffect(() => {
        durationChangingRef.current = durationChanging;
    }, [durationChanging]);
    const [isAdjustingDuration, setIsAdjustingDuration] = useState(false);
    useEffect(() => {
        if (!isAdjustingDuration) {
            setDurationChanging(duration);
        }
    }, [duration, isAdjustingDuration]);

  const hasActiveFilters =
      selectedKey !== null ||
      selectedSongType !== null ||
      selectedPraiseTeam !== null ||
      (selectedThemes && selectedThemes.length > 0) ||
      selectedTempo !== null ||
      selectedSeason !== null ||
      selectedBible !== null ||
      duration[0] !== MIN_SONG_DURATION && duration[1] == MAX_SONG_DURATION ||
      selectedBibleChapter !== null ||
      selectedBibleVerse !== null;

  const activeCount = [
    selectedKey,
    selectedSongType,
    selectedPraiseTeam,
    selectedTempo,
    selectedSeason,
    selectedBible,
      duration[0] !== MIN_SONG_DURATION && duration[1],
    selectedBibleChapter,
    selectedBibleVerse,
  ].filter(Boolean).length + (selectedThemes?.length ?? 0);

  const clearFilters = () => {
    setSelectedKey(null);
    setSelectedSongType(null);
    setSelectedPraiseTeam(null);
    setSelectedThemes([]);
    setSelectedTempo(null);
    setSelectedSeason(null);
    setSelectedBible(null);
    setDuration([MIN_SONG_DURATION, MAX_SONG_DURATION]);
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
    if (!selectedBible) {
      setSelectedBibleChapter(null);
      setSelectedBibleVerse(null);
    } else {
      getBibleChapter(selectedBible.id);
    }
  }, [selectedBible]);

  useEffect(() => {
    if (!selectedBibleChapter) {
      setSelectedBibleVerse(null);
    } else {
      getBibleVerse(selectedBibleChapter.id);
    }
  }, [selectedBibleChapter]);

    const handleSeekDuration = (vals: number[]) => {
        setIsAdjustingDuration(true);
        setDurationChanging([vals[0], vals[1]]);
    };

    useEffect(() => {
        const onPointerUp = () => {
            if (!isAdjustingDuration) return;
            setIsAdjustingDuration(false);
            const next = durationChangingRef.current;
            if (duration[0] !== next[0] || duration[1] !== next[1]) setDuration(next);
        };
        window.addEventListener("pointerup", onPointerUp);
        return () => window.removeEventListener("pointerup", onPointerUp);
    }, [isAdjustingDuration, duration]);

  return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        placeholder="찬양 제목이나 가사를 검색하세요..."
                        value={searchTerm || ""}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 py-3 text-base"
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                        <CollapsibleTrigger asChild>
                            <Button
                                className={`relative text-white whitespace-nowrap
                                    ${isAdvancedOpen ? "bg-blue-700 hover:bg-blue-700/90" : "bg-blue-500 hover:bg-blue-600"}`}
                            >
                                <Filter className="w-4 h-4 mr-2 text-white" />
                                고급 필터
                                {hasActiveFilters && (
                                    <Badge
                                        variant="secondary"
                                        className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-white/20 text-white border-0"
                                    >
                                        {activeCount}
                                    </Badge>
                                )}
                                {isAdvancedOpen ? (
                                    <ChevronUp className="w-4 h-4 ml-2 text-white" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 ml-2 text-white" />
                                )}
                            </Button>
                        </CollapsibleTrigger>
                    </Collapsible>

                    {activeCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="w-4 h-4 mr-1" />
                            초기화
                        </Button>
                    )}
                </div>
            </div>

          {/* 고급 필터 토글 + (열렸을 때) 컨텐츠 */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleContent className="mt-4 space-y-6">
              {/* 1열: 팀/장르/테마 */}
              <div className="flex flex-wrap gap-4 items-center">
                <SearchableSelect
                    options={praiseTeams.map((t) => ({
                      id: t.id,
                      label: t.praiseTeamName,
                    }))}
                    selected={
                      selectedPraiseTeam
                          ? { id: selectedPraiseTeam.id, label: selectedPraiseTeam.praiseTeamName }
                          : null
                    }
                    onSelect={(opt) => {
                      const team = praiseTeams.find((t) => t.id === opt?.id);
                      setSelectedPraiseTeam(team ?? null);
                    }}
                    className="w-32 md:w-50"
                    placeholder="찬양팀 선택"
                    includeDefaultOption={true}
                    defaultLabel="전체"
                />

                <Select
                    open={openSelectId === "songType"}
                    onOpenChange={(isOpen) => setOpenSelectId(isOpen ? "songType" : null)}
                    value={selectedSongType ? selectedSongType : SONG_SELECT_PLACEHOLDERS.songType}
                    onValueChange={(value) =>
                        setSelectedSongType(
                            value === SONG_SELECT_PLACEHOLDERS.songType ? null : (value as SongTypeTypes)
                        )
                    }
                >
                  <SelectTrigger className="w-32 md:w-50">
                    <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SONG_SELECT_PLACEHOLDERS.songType}>
                      <p className="text-muted-foreground">{SONG_SELECT_PLACEHOLDERS.songType}</p>
                    </SelectItem>
                    {songTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {SongTypeKorean[type]}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <MultiSelect
                    open={openSelectId === "songThemes"}
                    onOpenChange={(isOpen) => setOpenSelectId(isOpen ? "songThemes" : null)}
                    options={songThemes.map((t) => ({ id: t.id, label: t.themeName }))}
                    placeholder={SONG_SELECT_PLACEHOLDERS.songThemes}
                    selected={
                      selectedThemes
                          ? selectedThemes.map((t) => ({ id: t.id, label: t.themeName }))
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

                  <div className="space-y-2 flex-1 min-w-30 md:col-span-1">
                      <div className="flex items-center justify-between mb-3 md:mb-5">
                          <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <label className="text-sm text-gray-700">총 길이</label>
                          </div>
                          <span className="text-sm text-gray-500">
                                {durationChanging[0]}분 - {durationChanging[1]}분
                            </span>
                      </div>
                      <div className="px-3">
                          <Slider
                              value={[durationChanging[0], durationChanging[1]]}
                              variant="thin"
                              onValueChange={handleSeekDuration}
                              min={MIN_SONG_DURATION}
                              max={MAX_SONG_DURATION}
                              step={1}
                              className="w-full"
                          />
                      </div>
                  </div>
              </div>

              {/* 2열: 템포/키/절기/성경/장/절 */}
              <div className="flex flex-wrap gap-4 items-center">
                <Select
                    open={openSelectId === "songTempo"}
                    onOpenChange={(isOpen) => setOpenSelectId(isOpen ? "songTempo" : null)}
                    value={selectedTempo ? selectedTempo : SONG_SELECT_PLACEHOLDERS.songTempo}
                    onValueChange={(value) =>
                        setSelectedTempo(
                            value === SONG_SELECT_PLACEHOLDERS.songTempo ? null : (value as SongTempoTypes)
                        )
                    }
                >
                  <SelectTrigger className="w-32 md:w-40">
                    <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songTempo} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SONG_SELECT_PLACEHOLDERS.songTempo}>
                      <p className="text-muted-foreground">{SONG_SELECT_PLACEHOLDERS.songTempo}</p>
                    </SelectItem>
                    {songTempos.map((tempo) => (
                        <SelectItem key={tempo} value={tempo}>
                          {SongTempoKorean[tempo]}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                    open={openSelectId === "songKey"}
                    onOpenChange={(isOpen) => setOpenSelectId(isOpen ? "songKey" : null)}
                    value={selectedKey ? selectedKey : SONG_SELECT_PLACEHOLDERS.songKey}
                    onValueChange={(value) =>
                        setSelectedKey(value === SONG_SELECT_PLACEHOLDERS.songKey ? null : (value as SongKeyTypes))
                    }
                >
                  <SelectTrigger className="w-32 md:w-40">
                    <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songKey} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SONG_SELECT_PLACEHOLDERS.songKey}>
                      <p className="text-muted-foreground">{SONG_SELECT_PLACEHOLDERS.songKey}</p>
                    </SelectItem>
                    {keys.map((key) => (
                        <SelectItem key={key} value={key}>
                          {SongKeyKorean[key]}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                    open={openSelectId === "songSeason"}
                    onOpenChange={(isOpen) => setOpenSelectId(isOpen ? "songSeason" : null)}
                    value={selectedSeason ? selectedSeason.id : SONG_SELECT_PLACEHOLDERS.songSeason}
                    onValueChange={(value) =>
                        setSelectedSeason(
                            value === SONG_SELECT_PLACEHOLDERS.songSeason
                                ? null
                                : (seasons.find((season) => season.id === value) as SongSeasonDto)
                        )
                    }
                >
                  <SelectTrigger className="w-32 md:w-40">
                    <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songSeason} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SONG_SELECT_PLACEHOLDERS.songSeason}>
                      <p className="text-muted-foreground">{SONG_SELECT_PLACEHOLDERS.songSeason}</p>
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
                    onOpenChange={(isOpen) => setOpenSelectId(isOpen ? "songBible" : null)}
                    value={selectedBible ? selectedBible.id : SONG_SELECT_PLACEHOLDERS.songBible}
                    onValueChange={(value) =>
                        setSelectedBible(
                            value === SONG_SELECT_PLACEHOLDERS.songBible
                                ? null
                                : (bibles.find((bible) => bible.id === value) as BibleDto)
                        )
                    }
                >
                  <SelectTrigger className="w-32 md:w-40">
                    <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songBible} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SONG_SELECT_PLACEHOLDERS.songBible}>
                      <p className="text-muted-foreground">{SONG_SELECT_PLACEHOLDERS.songBible}</p>
                    </SelectItem>
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
                        onOpenChange={(isOpen) => setOpenSelectId(isOpen ? "songBibleChapter" : null)}
                        value={selectedBibleChapter ? selectedBibleChapter.id : SONG_SELECT_PLACEHOLDERS.songBibleChapter}
                        onValueChange={(value) =>
                            setSelectedBibleChapter(
                                value === SONG_SELECT_PLACEHOLDERS.songBibleChapter
                                    ? null
                                    : (chapters.find((chapter) => chapter.id === value) as BibleChapterDto)
                            )
                        }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songBibleChapter} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SONG_SELECT_PLACEHOLDERS.songBibleChapter}>
                          <p className="text-muted-foreground">{SONG_SELECT_PLACEHOLDERS.songBibleChapter}</p>
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
                        onOpenChange={(isOpen) => setOpenSelectId(isOpen ? "songBibleVerse" : null)}
                        value={selectedBibleVerse ? selectedBibleVerse.id : SONG_SELECT_PLACEHOLDERS.songBibleVerse}
                        onValueChange={(value) =>
                            setSelectedBibleVerse(
                                value === SONG_SELECT_PLACEHOLDERS.songBibleVerse
                                    ? null
                                    : (verses.find((verse) => verse.id === value) as BibleVerseDto)
                            )
                        }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder={SONG_SELECT_PLACEHOLDERS.songBibleVerse} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SONG_SELECT_PLACEHOLDERS.songBibleVerse}>
                          <p className="text-muted-foreground">{SONG_SELECT_PLACEHOLDERS.songBibleVerse}</p>
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
            </CollapsibleContent>
          </Collapsible>

          {/* 활성 필터 표시 */}
          {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
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
                                setSelectedThemes(selectedThemes.filter((t) => t.id !== theme.id))
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
                          setSelectedBible(null);
                          setSelectedBibleChapter(null);
                          setSelectedBibleVerse(null);
                        }}
                    >
                      성경: {selectedBible.bibleKoName}
                      {selectedBibleChapter ? ` ${selectedBibleChapter.chapterNum}장` : ""}
                      {selectedBibleVerse ? ` ${selectedBibleVerse.verseNum}절` : ""}
                      <X className="w-3 h-3" />
                    </Badge>
                )}

                  {(duration[0] > MIN_SONG_DURATION || duration[1] < MAX_SONG_DURATION) && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <span>
                          길이: {duration[0]}분-{duration[1]}분
                        </span>
                          <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={() => {
                                  setDuration([MIN_SONG_DURATION, MAX_SONG_DURATION]);
                              }}
                          />
                      </Badge>
                  )}
              </div>
          )}
        </div>
      </div>
  );
}
