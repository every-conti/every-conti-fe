"use client";

import {
    ArrowLeft,
    Play,
    Pause,
    Clock,
    Music,
    Calendar,
    Heart,
    Share2,
    Copy,
} from "lucide-react";
import {use, useState} from "react";
import {ImageWithFallback} from "src/components/common/ImageWithFallback";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import {Badge} from "src/components/ui/badge";
import {useContiDetailQuery} from "src/app/api/conti";
import {usePlayerStore} from "src/store/usePlayerStore";
import shareContent from "src/utils/shareContent";
import {useCurrentSong} from "src/store/useCurrentSong";
import {MinimumSongToPlayDto} from "src/dto/common/minimum-song-to-play.dto";
import {useRouter} from "next/navigation";
import {parseSongDuration} from "src/utils/parseSongDuration";
import ContiCopyModal from "src/components/conti/ContiCopyModal";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";

export default function ContiDetailPage({ params }: { params: Promise<{ contiId: string; }> }) {
    const router = useRouter();
    // const [isLiked, setIsLiked] = useState(false);
    const { isPlaying, enqueueAndPlay } = usePlayerStore()
    const currentSong = useCurrentSong();
    const { contiId } = use(params);

    const { data: conti } = useContiDetailQuery(contiId);

    // 총 재생 시간 계산
    const totalDuration = conti ? conti.songs.reduce((total, song) => total + song.song.duration, 0) : 0;

    const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);

    const formatTotalDuration = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handlePlayAll = () => {
        if (!conti) return;
        enqueueAndPlay(conti.songs.map(s => s.song));
    }

    // const handleLike = () => {
    //     setIsLiked(!isLiked);
    //     // toast.success(isLiked ? "좋아요를 취소했습니다" : "좋아요를 눌렀습니다");
    // };

    const isCurrentSongPlaying = (song: MinimumSongToPlayDto) => {
        return (currentSong?.id === song.id) && isPlaying;
    };

    if (!conti) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={router.back}
                            className="flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2"/>
                            뒤로
                        </Button>

                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => shareContent("conti")}>
                                <Share2 className="w-4 h-4"/>
                            </Button>
                            {/*<Button variant="ghost" size="sm">*/}
                            {/*    <MoreVertical className="w-4 h-4"/>*/}
                            {/*</Button>*/}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* 콘티 헤더 */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* 찬양팀 이미지 */}
                        <div className="w-full lg:w-80 flex-shrink-0">
                            <div
                                className="aspect-square w-full max-w-80 mx-auto lg:mx-0 relative overflow-hidden rounded-xl">
                                <ImageWithFallback
                                    src={conti.songs[0].song.thumbnail}
                                    alt={conti.songs[0].song.songName}
                                    className="w-full h-full object-cover"
                                />

                                {/* 재생 오버레이 */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <Button
                                        onClick={handlePlayAll}
                                        className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 text-black shadow-lg"
                                    >
                                        <Play className="w-7 h-7 ml-1"/>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* 콘티 정보 */}
                        <div className="flex-1">
                            <div className="mb-6">
                                <h1 className="text-3xl mb-3">{conti.title}</h1>
                                <p className="text-xl text-gray-600 mb-4">{conti.creator.nickname}</p>

                                {conti.description ?
                                    <div className="mb-3">
                                        <p>{conti.description}</p>
                                    </div>
                                : <></>}

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2"/>
                                        <span>{formatDate(conti.date)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Music className="w-4 h-4 mr-2"/>
                                        <span>{conti.songs.length}곡</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2"/>
                                        <span>{formatTotalDuration(totalDuration)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 액션 버튼들 */}
                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    onClick={handlePlayAll}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Play className="w-4 h-4 mr-2"/>
                                    전체 재생
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsCopyModalOpen(!isCopyModalOpen);
                                    }}
                                >
                                    <Copy className="w-4 h-4 mr-2"/>
                                    콘티 복사
                                </Button>

                                {/*<Button*/}
                                {/*    variant="outline"*/}
                                {/*    onClick={handleLike}*/}
                                {/*    className={isLiked ? "text-red-500 border-red-300" : ""}*/}
                                {/*>*/}
                                {/*    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`}/>*/}
                                {/*    좋아요*/}
                                {/*</Button>*/}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 곡 리스트 */}
                <Card className="overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl mb-6">곡 목록</h2>

                        <div className="space-y-1">
                            {conti.songs.map((song, index) => (
                                <div key={`${song.song.id}-${index}`}>
                                    <div
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                        {/* 순서 또는 재생 상태 */}
                                        <div className="w-8 flex justify-center mr-4">
                                            {isCurrentSongPlaying(song.song) ? (
                                                <div className="flex space-x-0.5">
                                                    <div className="w-1 h-3 bg-blue-600 rounded animate-pulse"></div>
                                                    <div className="w-1 h-3 bg-blue-600 rounded animate-pulse"
                                                         style={{animationDelay: '0.2s'}}></div>
                                                    <div className="w-1 h-3 bg-blue-600 rounded animate-pulse"
                                                         style={{animationDelay: '0.4s'}}></div>
                                                </div>
                                            ) : (
                                                <span
                                                    className="text-sm text-gray-500 group-hover:hidden">{index + 1}</span>
                                            )}

                                            {/* 재생 버튼 (호버시 표시) */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => enqueueAndPlay([song.song])}
                                                className="w-6 h-6 p-0 hidden group-hover:flex items-center justify-center"
                                            >
                                                {isCurrentSongPlaying(song.song) ? (
                                                    <Pause className="w-3 h-3"/>
                                                ) : (
                                                    <Play className="w-3 h-3"/>
                                                )}
                                            </Button>
                                        </div>

                                        {/* 곡 정보 */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className={`truncate ${isCurrentSongPlaying(song.song) ? 'text-blue-600' : 'text-gray-900'}`}>
                                                {song.song.songName}
                                            </h3>
                                            <p className="text-sm text-gray-600 truncate">{song.song.praiseTeam.praiseTeamName}</p>
                                        </div>

                                        {/* 키와 시간 */}
                                        <div className="flex items-center space-x-3 ml-4">
                                            <Badge variant="outline" className="text-xs">
                                                {song.song.songKey}
                                            </Badge>
                                            <span
                                                className="text-sm text-gray-500 w-10 text-right">{parseSongDuration(song.song.duration)}</span>

                                            {/* 추가 버튼 */}
                                            {/*{onAddSongToConti && (*/}
                                            {/*    <Button*/}
                                            {/*        variant="ghost"*/}
                                            {/*        size="sm"*/}
                                            {/*        onClick={() => onAddSongToConti(song)}*/}
                                            {/*        className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"*/}
                                            {/*    >*/}
                                            {/*        <Plus className="w-4 h-4"/>*/}
                                            {/*    </Button>*/}
                                            {/*)}*/}
                                        </div>
                                    </div>

                                    {/*{index < conti.songs.length - 1 && (*/}
                                    {/*    <Separator className="my-1"/>*/}
                                    {/*)}*/}
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* 콘티 복사 모달 */}
            <ContiCopyModal
                isOpen={isCopyModalOpen}
                onClose={() => setIsCopyModalOpen(false)}
                conti={conti}
                savedContis={[]}
                onCreateNewConti={() => {}}
                onAddToExistingConti={() => {}}
            />
        </div>
    );
}