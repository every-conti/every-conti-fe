"use client";

import { useState } from "react";
import {
    ArrowLeft,
    Play,
    Heart,
    Share2,
    Plus,
    Check,
    Clock,
    Music,
    User,
    Calendar,
    BookOpen,
    Headphones,
    Timer
} from "lucide-react";
import {Button} from "src/components/ui/button";
import {Card} from "src/components/ui/card";
import {ImageWithFallback} from "src/components/common/ImageWithFallback";
import {Badge} from "src/components/ui/badge";
import {ScrollArea} from "src/components/ui/scroll-area";
import { use } from "react";
import {
    useSongDetailQuery,
} from "src/app/api/song";
import {extractDateOnly, parseSongDuration} from "src/utils/parseSongDuration";
import {SongTypeKorean} from "src/types/song/song-type.types";
import {SongTempoKorean} from "src/types/song/song-tempo.types";

export default function Page({ params }: { params: Promise<{ songId: string; songName: string }> }) {
    const { songId, songName } = use(params);

    const { data: song } = useSongDetailQuery(songId);

    const [isLiked, setIsLiked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleAddToConti = () => {
        // onAddToConti(song);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        // toast.success(isLiked ? "좋아요를 취소했습니다" : "좋아요를 눌렀습니다");
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        // toast.success("링크가 클립보드에 복사되었습니다");
    };

    const handlePlay = () => {
        setIsPlaying(!isPlaying);
        // toast.success(isPlaying ? "재생을 중지했습니다" : "재생을 시작했습니다");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            {/*<div className="bg-white border-b border-gray-200 sticky top-16 z-40">*/}
            {/*    <div className="max-w-4xl mx-auto px-6 py-4">*/}
            {/*        <Button*/}
            {/*            variant="ghost"*/}
            {/*            onClick={onBack}*/}
            {/*            className="mb-4"*/}
            {/*        >*/}
            {/*            <ArrowLeft className="w-4 h-4 mr-2" />*/}
            {/*            검색으로 돌아가기*/}
            {/*        </Button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* 메인 정보 카드 */}
                <Card className="mb-8 overflow-hidden">
                    <div className="md:flex">
                        {/* 썸네일 */}
                        <div className="relative md:w-80 h-64 md:h-80 flex-shrink-0">
                            <ImageWithFallback
                                src={song?.thumbnail}
                                alt={song?.songName}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <Button
                                    size="lg"
                                    onClick={handlePlay}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    <Play className={`w-5 h-5 mr-2 ${isPlaying ? 'hidden' : ''}`} />
                                    <div className={`w-5 h-5 mr-2 ${isPlaying ? '' : 'hidden'}`}>
                                        <div className="flex space-x-1">
                                            <div className="w-1 h-5 bg-white rounded animate-pulse"></div>
                                            <div className="w-1 h-5 bg-white rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                            <div className="w-1 h-5 bg-white rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                    </div>
                                    {isPlaying ? '재생 중...' : '재생하기'}
                                </Button>
                            </div>
                        </div>

                        {/* 정보 */}
                        <div className="flex-1 p-6">
                            <div className="mb-4">
                                <h1 className="text-2xl mb-2">{song?.songName}</h1>
                                <p className="text-lg text-gray-600 mb-4">{song?.praiseTeam.praiseTeamName}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {song?.songKey &&
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Music className="w-3 h-3" />
                                            {song.songKey}Key
                                        </Badge>}
                                    {song?.songType &&
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            {SongTypeKorean[song.songType]}
                                        </Badge>}
                                    {song?.duration &&
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {parseSongDuration(song.duration)}
                                        </Badge>}
                                    {song?.tempo &&
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <Timer className="w-3 h-3" />
                                            {SongTempoKorean[song.tempo]}
                                        </Badge>}
                                </div>

                                {/* 주제 */}
                                {song?.songThemes && <>
                                    {song.songThemes.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm text-gray-600 mb-2">주제</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {song?.songThemes.map(theme => (
                                                    <Badge key={theme.id} variant="secondary" className="text-xs">
                                                        {theme.themeName}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>}

                                {/* 성경 구절 */}
                                {song?.bible && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <BookOpen className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-blue-800">관련 성경 구절</span>
                                        </div>
                                        <p className="text-blue-700">{song?.bible.bibleKoName}</p>
                                    </div>
                                )}
                            </div>

                            {/* 통계 */}
                            {/*<div className="grid grid-cols-2 gap-4 mb-6">*/}
                            {/*    <div className="text-center p-3 bg-gray-50 rounded-lg">*/}
                            {/*        <div className="flex items-center justify-center gap-1 mb-1">*/}
                            {/*            <Headphones className="w-4 h-4 text-gray-600" />*/}
                            {/*            <span className="text-sm text-gray-600">재생수</span>*/}
                            {/*        </div>*/}
                            {/*        <p className="text-lg">{song?.views}</p>*/}
                            {/*    </div>*/}
                            {/*    <div className="text-center p-3 bg-gray-50 rounded-lg">*/}
                            {/*        <div className="flex items-center justify-center gap-1 mb-1">*/}
                            {/*            <Heart className="w-4 h-4 text-gray-600" />*/}
                            {/*            <span className="text-sm text-gray-600">좋아요</span>*/}
                            {/*        </div>*/}
                            {/*        <p className="text-lg">{song?.likes}</p>*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/* 액션 버튼 */}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    // variant={isInConti ? "secondary" : "outline"}
                                    onClick={handleAddToConti}
                                    // disabled={isInConti}
                                    // className={isInConti ? "bg-green-100 text-green-700 border-green-300" : ""}
                                >
                                    {/*{isInConti ? (*/}
                                    {/*    <>*/}
                                    {/*        <Check className="w-4 h-4 mr-1" />*/}
                                    {/*        콘티에 추가됨*/}
                                    {/*    </>*/}
                                    {/*) : (*/}
                                    {/*    <>*/}
                                    {/*        <Plus className="w-4 h-4 mr-1" />*/}
                                    {/*        콘티에 추가*/}
                                    {/*    </>*/}
                                    {/*)}*/}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={handleLike}
                                    className={isLiked ? "text-red-600 border-red-300" : ""}
                                >
                                    <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                                    좋아요
                                </Button>

                                <Button variant="outline" onClick={handleShare}>
                                    <Share2 className="w-4 h-4 mr-1" />
                                    공유하기
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 가사 카드 */}
                <Card className="mb-8">
                    <div className="p-6">
                        <h2 className="text-xl mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            가사
                        </h2>
                        <ScrollArea className="h-96 w-full">
                            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                                {song?.lyrics}
                            </div>
                        </ScrollArea>
                    </div>
                </Card>

                {/* 추가 정보 */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* 곡 정보 */}
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg mb-4 flex items-center gap-2">
                                <Music className="w-5 h-5" />
                                곡 정보
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">곡 타입</span>
                                    {song?.songType ? <span>{SongTypeKorean[song?.songType]}</span> : <span className="text-gray-500">정보 없음</span>}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">템포</span>
                                    {song?.tempo ? <span>{SongTempoKorean[song?.tempo]}</span> : <span className="text-gray-500">정보 없음</span>}
                                </div>
                                {song?.season && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">절기</span>
                                        {song?.season ? <span>{song.season.seasonName}</span> : <span className="text-gray-500">정보 없음</span>}
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">재생 시간</span>
                                    {song?.duration ? <span>{parseSongDuration(song.duration)}</span> : <span className="text-gray-500">정보 없음</span>}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">키</span>
                                    {song?.songKey ? <span>song?.songKey</span> : <span className="text-gray-500">정보 없음</span>}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* 작성자 정보 */}
                    <Card>
                        <div className="p-6">
                            <h3 className="text-lg mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                작성자 정보
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">찬양팀</span>
                                    <span>{song?.praiseTeam.praiseTeamName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">등록자</span>
                                    <span>{song?.creatorNickname.nickname}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">업로드 일시</span>
                                    {song?.createdAt ? <span>{extractDateOnly(song?.createdAt)}</span> : <span className="text-gray-500">정보 없음</span>}
                                </div>
                            </div>

                            {/*<p className="text-sm text-gray-600">*/}
                            {/*    {song?.praiseTeam}*/}
                            {/*</p>*/}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}