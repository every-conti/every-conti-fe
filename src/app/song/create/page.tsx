"use client";

import {Music, Save, X, RefreshCw, Sparkles, Bot, User} from "lucide-react";
import {useEffect, useState} from "react";
import {Card} from "src/components/ui/card";
import {Input} from "src/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "src/components/ui/select";
import {Badge} from "src/components/ui/badge";
import { Textarea } from "src/components/ui/textarea";
import {Button} from "src/components/ui/button";
import {Checkbox} from "src/components/ui/checkbox";
import {fetchBibleChapter, fetchBibleVerse, useSongPropertiesQuery, useYoutubeVIdCheck} from "src/app/api/song";
import { useDebounce } from "use-debounce";
import {SongKeyKorean, SongKeyTypes} from "src/types/song/song-key.types";
import {SongTypeKorean, SongTypeTypes} from "src/types/song/song-type.types";
import SongThemeDto from "src/dto/common/song-theme.dto";
import extractYoutubeVideoId from "src/utils/extractYoutubeVideoId";
import PraiseTeamDto from "src/dto/common/praise-team.dto";
import {parseYoutubeDurationToSeconds} from "src/utils/parseSongDuration";
import {Switch} from "src/components/ui/switch";
import extractThemesFromAiCompletion from "src/utils/extractThemesFromAiCompletion";
import SearchableSelect from "src/components/song/search/SearchableSelect";
import {CreateSongDto} from "src/dto/song/CreateSongDto";
import {useAuthStore} from "src/store/useAuthStore";
import {SongTempoKorean, SongTempoTypes} from "src/types/song/song-tempo.types";
import SongSeasonDto from "src/dto/common/song-season.dto";
import BibleDto from "src/dto/common/bible.dto";
import BibleChapterDto from "src/dto/common/bible-chapter.dto";
import BibleVerseDto from "src/dto/common/bible-verse.dto";
import {SONG_SELECT_PLACEHOLDERS} from "src/constant/song-select-placeholders.constant";
import {YoutubeVideoInfoDto} from "src/dto/song/YoutubeVideoInfoDto";
import YoutubePopoverButton from "src/components/song/YoutubePopoverButton";
import {apiRequestPost} from "src/app/api/apiRequestPost";

export default function SongCreationPage() {
    const { user, accessToken } = useAuthStore();

    // 폼 상태
    const [title, setTitle] = useState("");
    const [praiseTeam, setPraiseTeam] = useState<PraiseTeamDto | null>(null);
    const [selectedKey, setSelectedKey] = useState<SongKeyTypes | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<SongTypeTypes | undefined>("CCM");
    const [lyrics, setLyrics] = useState("");
    const [selectedThemes, setSelectedThemes] = useState<SongThemeDto[]>([]);
    const [youtubeVId, setYoutubeVId] = useState<string | null>("");

    const [youtubeLink, setYoutubeLink] = useState("");
    const [debouncedYoutubeLink] = useDebounce(youtubeLink, 400);
    const [youtubeVideoInfo, setYoutubeVideoInfo] = useState<YoutubeVideoInfoDto | null>(null);

    const [isThemeCompleted, setIsThemeCompleted] = useState(false);
    const [themeSearch, setThemeSearch] = useState("");
    const [themeMode, setThemeMode] = useState<"manual" | "auto">("manual");
    const [isLoadingThemes, setIsLoadingThemes] = useState(false);

    const [selectedTempo, setSelectedTempo] = useState<SongTempoTypes | null>(
        null
    );
    const [selectedSeason, setSelectedSeason] = useState<SongSeasonDto | null>(
        null
    );
    const [selectedBible, setSelectedBible] = useState<BibleDto | null>(null);
    const [selectedBibleChapter, setSelectedBibleChapter] =
        useState<BibleChapterDto | null>(null);
    const [selectedBibleVerse, setSelectedBibleVerse] =
        useState<BibleVerseDto | null>(null);
    const [chapters, setChapters] = useState<BibleChapterDto[]>([]);
    const [verses, setVerses] = useState<BibleVerseDto[]>([]);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    useEffect(() => {
        if (debouncedYoutubeLink.trim()) {
            const id = extractYoutubeVideoId(debouncedYoutubeLink);
            setYoutubeVId(id);
        } else {
            setYoutubeVId(null);
        }
    }, [debouncedYoutubeLink]);

    // be에 가능한 영상인지 확인
    const {
        data: isYoutubeVIdExist,
        isLoading: isYoutubeVIdCheckLoading,
        isError: isYoutubeVIdCheckError,
    } = useYoutubeVIdCheck(youtubeVId);

    // 가능한 영상일 때 영상 정보 가져오기(3-party)
    useEffect(() => {
        const fetchYoutubeInfo = async () => {
            if (!youtubeVId || isYoutubeVIdExist?.data) return;

            try {
                const res = await fetch(`/api/youtube/info?v=${youtubeVId}`);
                if (!res.ok) throw new Error("유튜브 영상 정보를 가져오지 못했습니다.");
                const data: YoutubeVideoInfoDto = await res.json();
                setTitle(data.items[0].snippet.title);
                setYoutubeVideoInfo(data);
            } catch (err) {
                console.error("유튜브 API 요청 실패:", err);
            }
        };
        fetchYoutubeInfo();
    }, [youtubeVId, isYoutubeVIdExist]);

    // 가능한 옵션들
    const { data: songProperties } = useSongPropertiesQuery();

    const toggleTheme = (theme: SongThemeDto) => {
        setSelectedThemes((prev) => {
            const exists = prev.some((t) => t.id === theme.id);

            if (exists) {
                return prev.filter((t) => t.id !== theme.id); // 제거
            }

            if (prev.length >= 5) {
                alert("최대 5개의 테마만 선택할 수 있습니다.");
                return prev;
            }

            return [...prev, theme];
        });
    };

    useEffect(() => {
        if (!isThemeCompleted) return;
        setIsThemeCompleted(false);
    }, [lyrics]);

    const filteredThemes = songProperties?.songThemes.filter((theme) =>
        theme.themeName.toLowerCase().includes(themeSearch.toLowerCase())
    );

    const handleThemeAutoDetect = async () => {
        if (isThemeCompleted) return;

        if (!title.trim()) {
            alert("제목을 먼저 입력해주세요.");
            setThemeMode("manual");
            return;
        }

        if (!lyrics.trim()) {
            alert("가사를 먼저 입력해주세요.");
            setThemeMode("manual");
            return;
        }

        setIsLoadingThemes(true);

        try {
            const res = await fetch("/api/openai/analyze/theme", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    themes: songProperties?.songThemes.map(t => t.themeName).join(", "),
                    title,
                    lyrics,
                }),
            });
            const data = await res.json();
            const extractedThemes = extractThemesFromAiCompletion(JSON.stringify(data));
            const matchedThemes = songProperties?.songThemes.filter(theme =>
                extractedThemes.includes(theme.themeName)
            ) || [];

            setSelectedThemes(matchedThemes);
            setIsThemeCompleted(true);
        } catch (err) {
            console.error(err);
            alert("AI 테마 분석에 실패했습니다.");
            setThemeMode("manual");
        }

        setIsLoadingThemes(false);
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

    const handleSave = async () => {
        if (!user){
            alert("로그인 해야 합니다.");
            return;
        }

        if (!title.trim()) {
            alert("제목은 필수입니다.");
            return;
        }

        if (!youtubeVId) {
            alert("유효한 유튜브 링크를 입력해주세요.");
            return;
        }

        if (isYoutubeVIdExist){
            alert("이미 등록된 유튜브 링크입니다.");
            return;
        }

        if (!selectedType) {
            alert("장르를 선택해주세요.");
            return;
        }

        if (!praiseTeam) {
            alert("찬양팀을 선택해주세요.");
            return;
        }

        const newSong: CreateSongDto = {
            songName: title.trim(),
            lyrics: lyrics.trim() || undefined,
            youtubeVId,
            songType: selectedType,
            creatorId: user?.id,
            praiseTeamId: praiseTeam.id,
            thumbnail: `https://img.youtube.com/vi/${youtubeVId}/0.jpg`,
            themeIds: selectedThemes.map(t => t.id),
            tempo: selectedTempo?? undefined,
            key: selectedKey,
            duration: youtubeVideoInfo ? parseYoutubeDurationToSeconds(youtubeVideoInfo.items[0].contentDetails.duration) : 0,
            seasonId: selectedSeason?.id,
            bibleId: selectedBible?.id,
            bibleChapterId: selectedBibleChapter?.id,
            bibleVerseId: selectedBibleVerse?.id
        };

        try{
            const res = await apiRequestPost("/song", newSong, false, accessToken, false)
        } catch (e) {
            alert("생성 오류 발생")
        }
    };

    return (
        <>
            <div className="bg-white py-8 px-6 border-b border-gray-200">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl text-gray-800 mb-2">찬양 등록</h1>
                    <p className="text-gray-600">
                        다른 사람들에게 추천할, 자신만의 찬양을 등록해 보세요
                    </p>
                </div>
            </div>
        <div className="py-8 px-6">
            <div className="max-w-4xl mx-auto">

                <Card className="p-6">
                    <h3 className="text-xl mb-6 flex items-center gap-2">
                        <Music className="w-5 h-5" />
                        찬양 정보 입력
                    </h3>

                    <div className="space-y-6">
                        {/* 기본 정보 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-2 h-8">
                                    <label className="block text-sm mr-5 d">유튜브 링크 *</label>
                                    {youtubeVId && isYoutubeVIdExist?.data === false && youtubeVideoInfo && (
                                        <YoutubePopoverButton youtubeVId={youtubeVId} duration={youtubeVideoInfo.items[0].contentDetails.duration} />
                                    )}
                                </div>
                                
                                <Input
                                    placeholder="유튜브 링크를 입력하세요"
                                    value={youtubeLink}
                                    onChange={(e) => setYoutubeLink(e.target.value)}
                                />
                                {youtubeLink && youtubeVId === null && (
                                    <p className="text-sm text-red-500 mt-1">유효하지 않은 유튜브 링크입니다.</p>
                                )}
                                {youtubeVId && (
                                    <div className="mt-1 text-sm">
                                        {isYoutubeVIdCheckLoading && (
                                            <p className="text-gray-500">유튜브 링크 확인 중...</p>
                                        )}
                                        {isYoutubeVIdCheckError && (
                                            <p className="text-red-500">링크 확인 중 오류가 발생했습니다.</p>
                                        )}
                                        {!isYoutubeVIdCheckLoading && !isYoutubeVIdCheckError && isYoutubeVIdExist?.data === true && (
                                            <p className="text-red-500">⚠️ 이미 등록된 유튜브 영상입니다.</p>
                                        )}
                                        {!isYoutubeVIdCheckLoading && !isYoutubeVIdCheckError && isYoutubeVIdExist?.data === false && (
                                            <p className="text-green-600">✅ 등록 가능한 유튜브 링크입니다.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center block text-sm mb-2 h-8">제목 *</label>
                                <Input
                                    placeholder="찬양 제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>


                        </div>

                        {/* 기본 정보 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-2">찬양팀 *</label>
                                <SearchableSelect
                                    options={songProperties ? songProperties.praiseTeams.map((t) => ({
                                        id: t.id,
                                        label: t.praiseTeamName,
                                    })) : []}
                                    selected={
                                        praiseTeam
                                            ? {
                                                id: praiseTeam.id,
                                                label: praiseTeam.praiseTeamName,
                                            }
                                            : null
                                    }
                                    onSelect={(opt) => {
                                        const team = songProperties?.praiseTeams.find((t) => t.id === opt?.id);
                                        setPraiseTeam(team ?? null);
                                    }}
                                    className="w-full"
                                    placeholder="찬양팀 선택"
                                    includeDefaultOption={true}
                                    defaultLabel="전체"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-2">장르 *</label>
                                <Select value={selectedType} onValueChange={(value) =>
                                    setSelectedType(
                                        value ? (value as SongTypeTypes) : undefined
                                    )
                                }>
                                    <SelectTrigger>
                                        <SelectValue placeholder="장르를 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {songProperties?.songTypes.map(genre => (
                                            <SelectItem key={genre} value={genre}>{SongTypeKorean[genre]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>


                        {/* 가사 입력 */}
                        <div>
                            <div className="flex items-center mb-2">
                                <label className="block text-sm mr-5">가사</label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (!title.trim()) {
                                            alert("제목을 먼저 입력해주세요.");
                                            return;
                                        }
                                        const query = encodeURIComponent(`${title} 가사`);
                                        window.open(`https://www.google.com/search?q=${query}`, "_blank");
                                    }}
                                >
                                    🔍 가사 검색
                                </Button>
                            </div>
                            <Textarea
                                placeholder="찬양 가사를 입력하세요..."
                                value={lyrics}
                                onChange={(e) => setLyrics(e.target.value)}
                                rows={10}
                                className="resize-none"
                            />
                        </div>

                        {/* 테마 선택 방식 토글 */}
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm">테마 선택 방식 *</label>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">수동</span>
                                    </div>
                                    <Switch
                                        checked={themeMode === "auto"}
                                        onCheckedChange={(checked) => {
                                            setThemeMode(checked ? "auto" : "manual");
                                            if (checked) handleThemeAutoDetect();
                                        }}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Bot className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-blue-600">AI 추천</span>
                                    </div>
                                </div>
                            </div>

                            {themeMode === "auto" ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                            AI가 가사를 분석하여 적합한 테마를 추천합니다
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleThemeAutoDetect}
                                            disabled={isLoadingThemes || !lyrics.trim()}
                                            className="flex items-center gap-2"
                                        >
                                            {isLoadingThemes ? (
                                                <>
                                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                                    분석 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-3 h-3" />
                                                    AI 테마 분석
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {selectedThemes.length > 0 && (
                                        <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                            <div className="text-sm text-blue-800 mb-2 flex items-center gap-2">
                                                <Bot className="w-4 h-4" />
                                                AI 추천 테마 ({selectedThemes.length}개)
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {selectedThemes.map((theme) => (
                                                    <Badge
                                                        key={theme.id}
                                                        variant="secondary"
                                                        className="text-xs bg-blue-100 text-blue-800 flex items-center gap-1 cursor-pointer"
                                                        onClick={() => toggleTheme(theme)}
                                                    >
                                                        {theme.themeName}
                                                        <X className="w-2 h-2" />
                                                    </Badge>
                                                ))}
                                            </div>
                                            <p className="text-xs text-blue-600">
                                                필요시 아래에서 테마를 추가하거나 제거할 수 있습니다.
                                            </p>
                                        </div>
                                    )}

                                    {!lyrics.trim() && (
                                        <div className="text-sm text-gray-500 text-center py-2">
                                            가사를 입력한 후 AI 테마 분석을 실행해보세요
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-2 gap-4">
                                        <p className="text-sm text-gray-600 w-1/2">
                                            아래에서 직접 테마를 선택하세요 (1-5개)
                                        </p>
                                        <Input
                                            type="text"
                                            placeholder="테마 검색"
                                            value={themeSearch}
                                            onChange={(e) => setThemeSearch(e.target.value)}
                                            className="w-1/2"                                        />
                                    </div>




                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                                        {filteredThemes?.map((theme) => (
                                            <div key={theme.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={theme.id}
                                                    checked={selectedThemes.includes(theme)}
                                                    disabled={
                                                        !selectedThemes.includes(theme) && selectedThemes.length >= 5
                                                    }
                                                    onCheckedChange={() => toggleTheme(theme)}
                                                />
                                                <label htmlFor={theme.id} className="text-sm cursor-pointer">
                                                    {theme.themeName}
                                                </label>
                                            </div>
                                        ))}

                                        {filteredThemes?.length === 0 && (
                                            <p className="text-sm text-gray-400 col-span-full">검색 결과가 없습니다</p>
                                        )}
                                    </div>
                                    {selectedThemes.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {selectedThemes.map((theme) => (
                                                <Badge
                                                    key={theme.id}
                                                    variant="secondary"
                                                    className="text-xs flex items-center gap-1 cursor-pointer"
                                                    onClick={() => toggleTheme(theme)}
                                                >
                                                    {theme.themeName}
                                                    <X className="w-2 h-2 cursor-pointer" />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-8 mb-4">
                        <h4 className="text-md font-semibold">추가 정보</h4>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                        >
                            {showAdvancedOptions ? "숨기기" : "펼치기"}
                        </Button>
                    </div>

                    {showAdvancedOptions && (
                        <div className="space-y-4">
                            {/* 템포 선택 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div>
                                        <label className="block text-sm mb-2">템포</label>
                                        <Select value={selectedTempo?.valueOf()} onValueChange={(value) => setSelectedTempo(value as SongTempoTypes)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="빠르기를 선택하세요" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {songProperties?.songTempos.map(tempo => (
                                                    <SelectItem key={tempo} value={tempo}>{SongTempoKorean[tempo]}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* 시즌 선택 */}
                                <div>
                                    <div>
                                        <label className="block text-sm mb-2">절기</label>
                                        <Select
                                            value={selectedSeason?.id}
                                            onValueChange={(value) => {
                                                const season = songProperties?.seasons.find((s) => s.id === value);
                                                setSelectedSeason(season as SongSeasonDto);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="절기를 선택하세요" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {songProperties?.seasons.map((season) => (
                                                    <SelectItem key={season.id} value={season.id}>
                                                        {season.seasonName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <label className="block text-sm mr-5">키</label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                if (!title.trim()) {
                                                    alert("제목을 먼저 입력해주세요.");
                                                    return;
                                                }
                                                const query = encodeURIComponent(`${title} 키`);
                                                window.open(`https://www.google.com/search?q=${query}`, "_blank");
                                            }}
                                        >
                                            🔍 키 검색
                                        </Button>
                                    </div>
                                    <Select value={selectedKey}   onValueChange={(value) => setSelectedKey(value as SongKeyTypes)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="키를 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {songProperties?.songKeys.map(key => (
                                                <SelectItem key={key} value={key}>{SongKeyKorean[key]}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm mb-2 h-8">성경(장, 절 - 생략 가능)</label>
                                    <div className="flex">
                                        {/* 성경 선택 */}
                                        <div className="w-1/3 px-2">
                                            <Select value={selectedBible?.id} onValueChange={(value) => {
                                                const bible = songProperties?.bibles.find((b) => b.id === value);
                                                setSelectedBible(bible as BibleDto);
                                            }}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="성경 선택" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {songProperties?.bibles.map(b => (
                                                        <SelectItem key={b.id} value={b.id}>{b.bibleKoName}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-1/3 px-2">
                                            {/* 성경 장 선택 */}
                                            {selectedBible && (
                                                <Select value={selectedBibleChapter?.id} onValueChange={(value) => {
                                                    const chapter = chapters.find((ch) => ch.id === value);
                                                    setSelectedBibleChapter(chapter as BibleChapterDto);
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="장 선택" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {chapters.map(ch => (
                                                            <SelectItem key={ch.id} value={ch.id}>{ch.chapterNum}장</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                        <div className="w-1/3 px-2">
                                            {/* 성경 절 선택 */}
                                            {selectedBibleChapter && (
                                                <Select value={selectedBibleVerse?.id} onValueChange={(value) => {
                                                    const verse = verses.find((v) => v.id === value);
                                                    setSelectedBibleVerse(verse as BibleVerseDto);
                                                }}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="절 선택" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {verses.map(v => (
                                                            <SelectItem key={v.id} value={v.id}>{v.verseNum}절</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* 저장 버튼 */}
                <div className="flex justify-end space-x-3 mt-8">
                    {/*<Button variant="outline">*/}
                    {/*    <Upload className="w-4 h-4 mr-2" />*/}
                    {/*    임시저장*/}
                    {/*</Button>*/}
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        찬양 생성 완료
                    </Button>
                </div>
            </div>
        </div>
        </>

    );
}