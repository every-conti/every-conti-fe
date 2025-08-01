"use client";

import {Music, Upload, Save, X, RefreshCw, Sparkles, Bot, User} from "lucide-react";
import {useEffect, useState} from "react";
import {Card} from "src/components/ui/card";
import {Input} from "src/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "src/components/ui/select";
import {Badge} from "src/components/ui/badge";
import { Textarea } from "src/components/ui/textarea";
import {Button} from "src/components/ui/button";
import {Checkbox} from "src/components/ui/checkbox";
import {useSongPropertiesQuery, useYoutubeVIdCheck} from "src/app/api/song";
import { useDebounce } from "use-debounce";
import {SongKeyKorean, SongKeyTypes} from "src/types/song/song-key.types";
import {SongTypeKorean, SongTypeTypes} from "src/types/song/song-type.types";
import SongThemeDto from "src/dto/common/song-theme.dto";
import extractYoutubeVideoId from "src/utils/extractYoutubeVideoId";
import PraiseTeamDto from "src/dto/common/praise-team.dto";
import {formatYoutubeDuration} from "src/utils/parseSongDuration";
import {Switch} from "src/components/ui/switch";

export default function SongCreationPage() {
    // 폼 상태
    const [title, setTitle] = useState("");
    const [praiseTeam, setPraiseTeam] = useState<PraiseTeamDto | undefined>(undefined);
    const [selectedKey, setSelectedKey] = useState<SongKeyTypes | undefined>(undefined);
    const [selectedType, setSelectedType] = useState<SongTypeTypes | undefined>("CCM");
    const [lyrics, setLyrics] = useState("");
    const [selectedThemes, setSelectedThemes] = useState<SongThemeDto[]>([]);
    const [youtubeVId, setYoutubeVId] = useState<string | null>("");

    const [youtubeLink, setYoutubeLink] = useState("");
    const [debouncedYoutubeLink] = useDebounce(youtubeLink, 400);
    const [youtubeVideoInfo, setYoutubeVideoInfo] = useState(null);

    const [themeMode, setThemeMode] = useState<"manual" | "auto">("manual");
    const [isLoadingThemes, setIsLoadingThemes] = useState(false);

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
                const data = await res.json();
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
        setSelectedThemes(prev =>
            prev.includes(theme)
                ? prev.filter(t => t.id !== theme.id)
                : [...prev, theme]
        );
    };

    const handleThemeAutoDetect = async () => {
        if (!lyrics.trim()) {
            alert("가사를 먼저 입력해주세요.");
            setThemeMode("manual");
            return;
        }

        setIsLoadingThemes(true);

        try {
            // const res = await fetch("/api/song/detect-themes", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ lyrics }),
            // });
            //
            // const data = await res.json();
            //
            // if (!res.ok || !Array.isArray(data.themes)) {
            //     throw new Error("테마 분석 실패");
            // }
            //
            // // songProperties.songThemes 중 label로 매칭
            // const matchedThemes = songProperties?.songThemes.filter(theme =>
            //     data.themes.includes(theme.themeName)
            // ) || [];
            const matchedThemes = songProperties?.songThemes.filter(theme =>
                theme.themeName.includes("경배")
            ) || [];

            setSelectedThemes(matchedThemes);
        } catch (err) {
            console.error(err);
            alert("AI 테마 분석에 실패했습니다.");
            setThemeMode("manual");
        }

        setIsLoadingThemes(false);
    };


    const handleSave = () => {
        // if (!title.trim() || !artist.trim() || !selectedKey || !selectedType) {
        //     toast.error("제목, 아티스트, 키, 장르는 필수 입력 항목입니다.");
        //     return;
        // }
        //
        // // 임시 데이터로 찬양 생성
        // const newSong = {
        //     title: title.trim(),
        //     artist: artist.trim(),
        //     key: selectedKey,
        //     genre: selectedType,
        //     duration: "4:30", // 기본값
        //     views: "0회",
        //     likes: "0개",
        //     thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
        //     themes: selectedThemes
        // };
        //
        // onSongCreate(newSong);
        //
        // // 폼 초기화
        // setTitle("");
        // setArtist("");
        // setSelectedKey("");
        // setSelectedGenre("");
        // setLyrics("");
        // setSelectedThemes([]);
        // setAiPrompt("");
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
                                <label className="block text-sm mb-2">제목 *</label>
                                <Input
                                    placeholder="찬양 제목을 입력하세요"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2">키 *</label>
                                <Select value={selectedKey} onValueChange={setSelectedKey}>
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-2">찬양팀 *</label>
                                <Select value={praiseTeam?.praiseTeamName} onValueChange={setPraiseTeam}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="찬양팀을 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {songProperties?.praiseTeams.map(team => (
                                            <SelectItem key={team.id} value={team.id}>{team.praiseTeamName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-2">유튜브 링크 *</label>
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
                            {youtubeVId && isYoutubeVIdExist?.data === false && youtubeVideoInfo && (
                                <div className="col-span-2 mt-4 border rounded-md p-4 flex items-center gap-4 bg-gray-50">
                                    <img
                                        src={`https://img.youtube.com/vi/${youtubeVId}/0.jpg`}
                                        alt="유튜브 썸네일"
                                        className="w-32 h-20 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                        {/*<p className="text-sm font-semibold line-clamp-2">*/}
                                        {/*    {youtubeVideoInfo.items[0].snippet.title}*/}
                                        {/*</p>*/}
                                        <p className="text-xs text-gray-500 mt-1">
                                            길이: {formatYoutubeDuration(youtubeVideoInfo.items[0].contentDetails.duration)}
                                        </p>
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>

                        {/* 가사 입력 */}
                        <div>
                            <label className="block text-sm mb-2">가사</label>
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
                                <label className="text-sm">테마 선택 방식</label>
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
                                    <p className="text-sm text-gray-600 mb-2">
                                        아래에서 직접 테마를 선택하세요
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                                        {songProperties?.songThemes.map((theme) => (
                                            <div key={theme.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={theme.id}
                                                    checked={selectedThemes.includes(theme)}
                                                    onCheckedChange={() => toggleTheme(theme)}
                                                />
                                                <label htmlFor={theme.id} className="text-sm cursor-pointer">
                                                    {theme.themeName}
                                                </label>
                                            </div>
                                        ))}
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
                </Card>



                {/* 저장 버튼 */}
                <div className="flex justify-end space-x-3 mt-8">
                    <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        임시저장
                    </Button>
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