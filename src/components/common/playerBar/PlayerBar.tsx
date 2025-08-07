"use client";

import {useState, useEffect, useRef, useCallback} from "react";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Heart,
    Plus,
    X,
    Music
} from "lucide-react";
import {Card} from "src/components/ui/card";
import {ImageWithFallback} from "src/components/common/ImageWithFallback";
import { Badge } from "src/components/ui/badge";
import {Button} from "src/components/ui/button";
import {Slider} from "src/components/ui/slider";
import {usePlayerStore} from "src/store/usePlayerStore";
import ReactPlayer from "react-player";
import {getFullYoutubeURIByVId} from "src/utils/youtubeVIdUtils";
import {parseSongDuration} from "src/utils/parseSongDuration";

export default function PlayerBar() {
    const { isPlaying, setIsPlaying, currentSong, setCurrentSong } = usePlayerStore();
    const playerRef = useRef<HTMLVideoElement | null>(null);

    const [isLiked, setIsLiked] = useState(false);
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const [isInConti, setIsInConti] = useState(false);

    const initialState = {
        src: undefined,
        pip: false,
        playing: false,
        controls: false,
        volume: 0.75,
        light: false,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        // playbackRate: 1.0,
        loop: false,
        seeking: false,
        loadedSeconds: 0,
        playedSeconds: 0,
    };
    type PlayerState = Omit<typeof initialState, 'src'> & {
        src?: string;
    };
    const [state, setState] = useState<PlayerState>(initialState);
    const [isSeeking, setIsSeeking] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleTimeUpdate = () => {
        if (!playerRef.current || isSeeking) return;

        const player = playerRef.current;
        if (!player || state.seeking) return;


        if (!player.duration) return;

        setState(prevState => ({
            ...prevState,
            playedSeconds: player.currentTime,
            played: player.currentTime / player.duration,
        }));
    };

    const handleEnded = () => {
        setState(prevState => ({ ...prevState, playing: prevState.loop }));
    };

    const setPlayerRef = useCallback((player: HTMLVideoElement) => {
        if (!player) return;
        playerRef.current = player;
    }, []);

    const onPlayPause = () => {
        setIsPlaying(!isPlaying);
    };
    const onClose = () => {
        setCurrentSong(null);
        setIsPlaying(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        // toast.success(isLiked ? "좋아요를 취소했습니다" : "좋아요를 눌렀습니다");
    };

    const handleProgress = () => {
        const player = playerRef.current;
        if (!player || state.seeking || !player.buffered?.length) return;

        setState(prevState => ({
            ...prevState,
            // loadedSeconds: player.buffered?.end(player.buffered?.length - 1),
            loaded: player.buffered?.end(player.buffered?.length - 1) / player.duration * 100,
        }));
    };

    const handleAddToConti = () => {
        // if (currentSong) {
        //     onAddToConti(currentSong);
        // }
    };

    const handleSeek = (value: number[]) => {
        if (!playerRef.current || !currentSong?.duration) return;

        setIsSeeking(true);
        setProgress(value[0]);
    };

    useEffect(() => {
        const handlePointerUp = () => {
            if (!isSeeking) return;

            setIsSeeking(false);
            if (!playerRef.current || !currentSong?.duration) return;

            const newTime = (progress / 100) * currentSong.duration;
            playerRef.current.currentTime = newTime;

            setState(prev => ({
                ...prev,
                playedSeconds: newTime,
                played: progress / 100,
            }));
        };

        window.addEventListener("pointerup", handlePointerUp);
        return () => window.removeEventListener("pointerup", handlePointerUp);
    }, [isSeeking, progress, currentSong]);

    if (!currentSong) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
            <Card className="rounded-none border-0 shadow-none">
                <div className="px-4 py-3">
                    {/* 진행 바 */}
                    <div className="mb-3">
                        <Slider
                            value={[isSeeking ? progress : state.played * 100]}
                            onValueChange={handleSeek}
                            max={100}
                            step={0.1}
                            loadedPercent={state.loaded}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{formatTime(state.playedSeconds)}</span>
                            <span>{parseSongDuration(currentSong.duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* 곡 정보 */}
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                    src={currentSong.thumbnail}
                                    alt={currentSong.songName}
                                    className="w-full h-full object-cover"
                                />
                                {isPlaying && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="flex space-x-0.5">
                                            <div className="w-0.5 h-3 bg-white rounded animate-pulse"></div>
                                            <div className="w-0.5 h-3 bg-white rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                            <div className="w-0.5 h-3 bg-white rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {currentSong.songName}
                                </h4>
                                <p className="text-xs text-gray-600 truncate">
                                    {currentSong.praiseTeam.praiseTeamName}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                                        {currentSong.songKey}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                        {currentSong.songType}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* 재생 컨트롤 */}
                        <div className="flex items-center space-x-2 mx-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                                // onClick={() => toast.info("이전 곡 기능은 준비 중입니다")}
                            >
                                <SkipBack className="w-4 h-4" />
                            </Button>

                            <Button
                                size="sm"
                                onClick={onPlayPause}
                                className="w-10 h-10 p-0 rounded-full bg-blue-600 hover:bg-blue-700"
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5" />
                                ) : (
                                    <Play className="w-5 h-5 ml-0.5" />
                                )}
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                                // onClick={() => toast.info("다음 곡 기능은 준비 중입니다")}
                            >
                                <SkipForward className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* 액션 버튼들 */}
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={handleLike}
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className={`w-8 h-8 p-0 ${isInConti ? 'text-green-600' : ''}`}
                                onClick={handleAddToConti}
                                disabled={isInConti}
                            >
                                {isInConti ? (
                                    <Music className="w-4 h-4" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                            </Button>

                            <div className="relative hidden sm:block">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => {
                                        setShowVolumeControl(prev => !prev)
                                    }}
                                >
                                    <Volume2 className="w-4 h-4" />
                                </Button>

                                {showVolumeControl && (
                                    <div className="absolute bottom-full right-0 mb-2 p-3 bg-white rounded-lg shadow-lg border z-10">
                                        <div className="w-20">
                                            <div className="h-16 flex items-center justify-center">
                                                <Slider
                                                    value={[state.volume * 100]}
                                                    onValueChange={(value) => setState(prevState => ({
                                                        ...prevState,
                                                        volume: value[0] / 100
                                                    }))}
                                                    max={100}
                                                    step={1}
                                                    orientation="horizontal"
                                                    className="w-16"
                                                />
                                            </div>
                                            <div className="text-xs text-center text-gray-600 mt-1">
                                                {Math.round(state.volume * 100)}%
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0 text-gray-400 hover:text-gray-600"
                                onClick={onClose}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* ReactPlayer: 실제 오디오 재생 */}
                    <ReactPlayer
                        ref={setPlayerRef}
                        src={getFullYoutubeURIByVId(currentSong.youtubeVId)}
                        onProgress={handleProgress}
                        playing={isPlaying}
                        volume={state.volume}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleEnded}
                        onError={() => {}}
                        style={{ display: "none" }}
                    />
                </div>
            </Card>
        </div>
    );
}