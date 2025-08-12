"use client";

import {useEffect, useRef, useState} from "react";
import {
    Search,
    Filter,
    X,
    ChevronDown,
    ChevronUp,
    Clock,
    Users,
    Music,
} from "lucide-react";
import { Input } from "src/components/ui/input";
import { Slider } from "src/components/ui/slider";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "src/components/ui/collapsible";
import PraiseTeamDto from "src/dto/common/praise-team.dto";
import { SongTypeKorean, SongTypeTypes } from "src/types/song/song-type.types";
import SearchableSelect from "src/components/song/search/SearchableSelect";
import { SearchContiPropertiesDto } from "src/dto/conti/search-conti-properties.dto";
import {
    MAX_TOTAL_DURATION,
    MIN_TOTAL_DURATION,
} from "src/constant/conti/conti-search.constant";
import { useInfiniteSearchSongQuery } from "src/app/api/song";
import {Button} from "src/components/ui/button";
import {Badge} from "src/components/ui/badge";
import {SongDetailDto} from "src/dto/common/song-detail.dto";

interface ContiSearchFiltersProps {
    searchProperties: SearchContiPropertiesDto;

    // 콘티 제목/작성자 검색
    searchTerm: string | null;
    setSearchTerm: (searchTerm: string | null) => void;

    // 곡 검색(드롭다운용)
    songSearchTerm: string | null;
    setSongSearchTerm: (songSearchTerm: string | null) => void;
    debouncedSongSearchTerm: string | null;

    // 멀티 선택된 곡들 (부모 상태)
    selectedSongs: SongDetailDto[];
    setSelectedSongs: (songs: SongDetailDto[]) => void;

    // 기타 필터
    selectedSongType: SongTypeTypes | null;
    setSelectedSongType: (selectedSongType: SongTypeTypes | null) => void;

    selectedPraiseTeam: PraiseTeamDto | null;
    setSelectedPraiseTeam: (selectedPraiseTeam: PraiseTeamDto | null) => void;

    duration: [number, number]
    setDuration: (duration: [number, number]) => void;
}

export default function ContiSearchFilters({
   searchProperties,
   searchTerm,
   setSearchTerm,
   songSearchTerm,
   setSongSearchTerm,
   debouncedSongSearchTerm,
   selectedSongs,
   setSelectedSongs,
   selectedSongType,
   setSelectedSongType,
   selectedPraiseTeam,
   setSelectedPraiseTeam,
   duration,
   setDuration,
}: ContiSearchFiltersProps) {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [songDropdownOpen, setSongDropdownOpen] = useState(false);
    const q = (debouncedSongSearchTerm ?? "").trim();

    const [durationChanging, setDurationChanging] = useState<[number, number]>([MIN_TOTAL_DURATION, MAX_TOTAL_DURATION]);
    const durationChangingRef = useRef<[number, number]>(durationChanging);
    useEffect(() => {
        durationChangingRef.current = durationChanging;
    }, [durationChanging]);
    const [isAdjustingDuration, setIsAdjustingDuration] = useState(false);

    const praiseTeams = searchProperties.praiseTeams;


    // 곡 자동 검색 (무한스크롤)
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
        useInfiniteSearchSongQuery(
            {
                text: q || undefined,
                enabled: q.length > 0,
            },
            {
                getNextPageParam: (lastPage: { nextOffset: number | null }) =>
                    lastPage.nextOffset ?? undefined,
            }
        );
    const searchedSongs = data?.pages.flatMap((page: any) => page.items) ?? [];

    const isSongSelected = (id: string) => selectedSongs.some((s) => s.id === id);
    const addSong = (song: SongDetailDto) => {
        if (!isSongSelected(song.id)) setSelectedSongs([...selectedSongs, song]);
    };
    const removeSong = (id: string) => {
        setSelectedSongs(selectedSongs.filter((s) => s.id !== id));
    };
    const toggleSong = (song: SongDetailDto) => {
        isSongSelected(song.id) ? removeSong(song.id) : addSong(song);
    };

    // 필터 초기화
    const resetFilters = () => {
        setSearchTerm(null);
        setSelectedPraiseTeam(null);
        setSelectedSongType(null);
        setSongSearchTerm(null);
        setSelectedSongs([]); // 추가
        setDuration([MIN_TOTAL_DURATION, MAX_TOTAL_DURATION])
        setDurationChanging([MIN_TOTAL_DURATION, MAX_TOTAL_DURATION])
    };

    // 활성 필터 개수
    const getActiveFilterCount = () => {
        let count = 0;
        if (searchTerm) count++;
        if (selectedPraiseTeam) count++;
        if (selectedSongType) count++;
        if (selectedSongs.length > 0) count++; // 텍스트 대신 실제 선택 곡 기준
        if (duration[0] > MIN_TOTAL_DURATION || duration[1] < MAX_TOTAL_DURATION) count++;
        return count;
    };

    // 드래그 중 실시간 업데이트(미리보기)
    const handleSeekDuration = (vals: number[]) => {
        setIsAdjustingDuration(true);
        setDurationChanging([vals[0], vals[1]]);
    };

    useEffect(() => {
        const onPointerUp = () => {
            if (!isAdjustingDuration) return;
            setIsAdjustingDuration(false);
            setDuration(durationChangingRef.current);
        };
        window.addEventListener("pointerup", onPointerUp);
        return () => window.removeEventListener("pointerup", onPointerUp);
    }, [isAdjustingDuration, duration]);

    return (
        <div className="bg-white border-b border-gray-200 z-40">
            <div className="max-w-6xl mx-auto px-6 py-4">
                {/* 기본 검색 */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    {/* 콘티 제목/작성자 검색 */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="콘티 제목을 검색하세요..."
                            value={searchTerm || ""}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* 포함된 곡 멀티 선택 */}
                    <div className="relative flex-1">
                        <div
                            className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-text"
                            onClick={() => setSongDropdownOpen(true)}
                        >
                            <Music className="text-gray-400 w-4 h-4" />
                            <Input
                                placeholder={
                                    selectedSongs.length
                                        ? "추가로 검색하여 선택…"
                                        : "포함된 곡 제목, 가사 검색…"
                                }
                                value={songSearchTerm || ""}
                                onChange={(e) => {
                                    setSongSearchTerm(e.target.value);
                                    if (!songDropdownOpen) setSongDropdownOpen(true);
                                }}
                                className="border-0 focus-visible:ring-0 p-0 h-5"
                            />
                        </div>

                        {/* 드롭다운: 자동검색 결과 + 무한 스크롤 */}
                        {songDropdownOpen && (
                            <div
                                className="absolute mt-2 w-full bg-white border rounded-md shadow-lg max-h-72 overflow-auto z-50"
                                onScroll={(e) => {
                                    const el = e.currentTarget;
                                    const nearBottom =
                                        el.scrollTop + el.clientHeight >= el.scrollHeight - 16;
                                    if (nearBottom && hasNextPage && !isFetchingNextPage)
                                        fetchNextPage();
                                }}
                            >
                                {isLoading && (
                                    <div className="p-4 text-sm text-gray-500">검색 중…</div>
                                )}

                                {!isLoading && isError && (
                                    <div className="p-4 text-sm text-red-500">
                                        곡을 불러오지 못했어요. 다시 시도해 주세요.
                                    </div>
                                )}

                                {!isLoading && !isError && searchedSongs.length === 0 && (
                                    <div className="p-4 text-sm text-gray-500">
                                        검색 결과가 없습니다.
                                    </div>
                                )}

                                {!isLoading &&
                                    !isError &&
                                    searchedSongs.map((song: any) => (
                                        <button
                                            key={song.id}
                                            type="button"
                                            onClick={() =>
                                                toggleSong(song)
                                            }
                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                                        >
                                            <span className="truncate">{song.songName}</span>
                                            {isSongSelected(song.id) ? (
                                                <Badge variant="secondary" className="text-[10px]">
                                                    선택됨
                                                </Badge>
                                            ) : null}
                                        </button>
                                    ))}

                                {isFetchingNextPage && (
                                    <div className="p-3 text-center text-xs text-gray-400">
                                        더 불러오는 중…
                                    </div>
                                )}

                                <div className="sticky bottom-0 bg-white border-t p-2 flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSongDropdownOpen(false)}
                                    >
                                        닫기
                                    </Button>
                                    <Button size="sm" onClick={() => setSongDropdownOpen(false)}>
                                        확인
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 고급 필터 토글 */}
                    <div className="flex items-center space-x-2">
                        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    className={`relative text-white whitespace-nowrap ${isAdvancedOpen ? "bg-blue-700 hover:bg-blue-700/90" : "bg-blue-500 hover:bg-blue-600"}`}
                                >
                                    <Filter className="w-4 h-4 mr-2 text-white" />
                                    고급 필터
                                    {getActiveFilterCount() > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-white/20 text-white border-0"
                                        >
                                            {getActiveFilterCount()}
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

                        {getActiveFilterCount() > 0 && (
                            <Button variant="ghost" size="sm" onClick={resetFilters}>
                                <X className="w-4 h-4 mr-1" />
                                초기화
                            </Button>
                        )}
                    </div>
                </div>

                {/* 고급 필터 */}
                <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                    <CollapsibleContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            {/* 찬양팀 (50%) */}
                            <div className="space-y-2 w-full md:col-span-1">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm text-gray-700">찬양팀</label>
                                </div>
                                <SearchableSelect
                                    className="w-full"
                                    options={praiseTeams.map((t) => ({ id: t.id, label: t.praiseTeamName }))}
                                    selected={
                                        selectedPraiseTeam
                                            ? { id: selectedPraiseTeam.id, label: selectedPraiseTeam.praiseTeamName }
                                            : null
                                    }
                                    onSelect={(opt) => {
                                        const team = praiseTeams.find((t) => t.id === opt?.id);
                                        setSelectedPraiseTeam(team ?? null);
                                    }}
                                    placeholder="찬양팀 선택"
                                    includeDefaultOption
                                    defaultLabel="전체"
                                />
                            </div>

                            {/* 총 길이 (50%) */}
                            <div className="space-y-2 w-full md:col-span-1">
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
                                        min={MIN_TOTAL_DURATION}
                                        max={MAX_TOTAL_DURATION}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* 활성 필터 표시 */}
                {getActiveFilterCount() > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                        {searchTerm && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                                <span>제목: {searchTerm}</span>
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => setSearchTerm("")}
                                />
                            </Badge>
                        )}

                        {/* 선택 곡들 배지 */}
                        {selectedSongs.map((s) => (
                            <Badge
                                key={`selected-${s.id}`}
                                variant="secondary"
                                className="flex items-center space-x-1"
                                onClick={() => removeSong(s.id)}
                            >
                                <span>곡: {s.songName}</span>
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                />
                            </Badge>
                        ))}

                        {selectedPraiseTeam !== null && (
                            <Badge variant="secondary" className="flex items-center space-x-1"  onClick={() => setSelectedPraiseTeam(null)}>
                                <span>찬양팀: {selectedPraiseTeam?.praiseTeamName}</span>
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                />
                            </Badge>
                        )}

                        {selectedSongType && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                                <span>{SongTypeKorean[selectedSongType]}</span>
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => setSelectedSongType(null)}
                                />
                            </Badge>
                        )}

                        {(duration[0] > MIN_TOTAL_DURATION || duration[1] < MAX_TOTAL_DURATION) && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                        <span>
                          길이: {duration[0]}분-{duration[1]}분
                        </span>
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => {
                                        setDuration([MIN_TOTAL_DURATION, MAX_TOTAL_DURATION]);
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
