"use client";

import {useState, useEffect, useRef, useCallback} from "react";
import { Repeat1, Repeat} from "lucide-react";
import {usePlayerStore} from "src/store/usePlayerStore";
import { useCurrentSong } from "src/store/useCurrentSong";
import ReactPlayer from "react-player";
import SimpleBottomBar from "src/components/common/playerBar/SimpleBottomBar";
import {PlayerRepeatMode} from "src/components/common/playerBar/player-repeat-mode";
import {getFullYoutubeURIByVId} from "src/utils/youtubeVIdUtils";
import {ReactPlayerStateDto} from "src/components/common/playerBar/react-player-state.dto";
import {MusicPlayerPropsDto } from "src/components/common/playerBar/music-player-props.dto";
import FullScreenMusicPlayer from "src/components/common/playerBar/FullScreenMusicPlayer";

export default function PlayerBar() {
    const currentSong = useCurrentSong();
    const { isPlaying, setIsPlaying, playlist, setPlayList, currentSongIndex, setCurrentSongIndex, } = usePlayerStore();
    const playerRef = useRef<HTMLVideoElement | null>(null);

    const [isLiked, setIsLiked] = useState(false);
    const [showVolumeControl, setShowVolumeControl] = useState(false);
    const [isInConti, setIsInConti] = useState(false);

    const [isFullScreen, setIsFullScreen] = useState(false);

    const [repeatMode, setRepeatMode] = useState<PlayerRepeatMode>("off");
    const [shuffle, setShuffle] = useState(false);
    const [shuffleOrder, setShuffleOrder] = useState<number[] | null>(null);
    const [shufflePos, setShufflePos] = useState<number | null>(null);
    const [history, setHistory] = useState<number[]>([]);
    const hasPrev = shuffle ? history.length > 0
        : currentSongIndex !== null && currentSongIndex > 0;

    const hasNext = shuffle
        ? (shufflePos !== null && shuffleOrder !== null && shufflePos < shuffleOrder.length - 1)
        : (currentSongIndex !== null && currentSongIndex < playlist.length - 1);
    useEffect(() => {
        if (!shuffle) {
            setShuffleOrder(null);
            setShufflePos(null);
            setHistory([]);
            return;
        }

        if (playlist.length === 0 || currentSongIndex == null) return;

        const rest = playlist.map((_, i) => i).filter(i => i !== currentSongIndex);
        for (let i = rest.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rest[i], rest[j]] = [rest[j], rest[i]];
        }
        const order = [currentSongIndex, ...rest];
        setShuffleOrder(order);
        setShufflePos(0);
        setHistory([]);
    }, [shuffle, playlist, currentSongIndex]);
    const goToIndex = (idx: number) => {
        setCurrentSongIndex(idx);
        setIsPlaying(true);
    };
    const nextSong = useCallback(() => {
        // 반복: 한 곡 모드면 현재 곡 처음부터
        if (repeatMode === "one") {
            if (playerRef.current) {
                playerRef.current.currentTime = 0;
            }
            setIsPlaying(true);
            return;
        }

        if (shuffle && shuffleOrder && shufflePos !== null) {
            // 셔플: 순서대로 다음
            if (shufflePos < shuffleOrder.length - 1) {
                const nextPos = shufflePos + 1;
                setHistory(h => [...h, shuffleOrder[shufflePos]]);
                setShufflePos(nextPos);
                goToIndex(shuffleOrder[nextPos]);
            } else {
                // 끝에 도달
                if (repeatMode === "all") {
                    setHistory([]);
                    setShufflePos(0);
                    goToIndex(shuffleOrder[0]);
                } else {
                    setIsPlaying(false);
                }
            }
            return;
        }

        // 일반: 인덱스 +1 또는 반복(all)이면 0으로
        if (currentSongIndex == null) return;
        if (currentSongIndex < playlist.length - 1) {
            goToIndex(currentSongIndex + 1);
        } else {
            if (repeatMode === "all") {
                goToIndex(0);
            } else {
                setIsPlaying(false);
            }
        }
    }, [repeatMode, shuffle, shuffleOrder, shufflePos, currentSongIndex, playlist.length, setCurrentSongIndex, setIsPlaying]);

    const prevSong = useCallback(() => {
        if (shuffle) {
            // 셔플: 히스토리로 뒤로 가기
            if (history.length > 0) {
                const last = history[history.length - 1];
                setHistory(h => h.slice(0, -1));
                if (shuffleOrder) {
                    const pos = shuffleOrder.indexOf(last);
                    if (pos >= 0) setShufflePos(pos);
                }
                goToIndex(last);
            }
            return;
        }

        // 일반: 인덱스 -1
        if (currentSongIndex == null) return;
        if (currentSongIndex > 0) {
            goToIndex(currentSongIndex - 1);
        }
    }, [shuffle, history, shuffleOrder, currentSongIndex]);

    const cycleRepeatMode = () => {
        const modes: PlayerRepeatMode[] = ["off", "all", "one"];
        const currentModeIndex = modes.indexOf(repeatMode);
        const nextMode = modes[(currentModeIndex + 1) % modes.length];
        setRepeatMode(nextMode);
    };

    const getRepeatIcon = () => {
        switch (repeatMode) {
            case "one":
                return <Repeat1 className="w-4 h-4" />;
            case "all":
                return <Repeat className="w-4 h-4" />;
            default:
                return <Repeat className="w-4 h-4" />;
        }
    };

    const initialState: ReactPlayerStateDto = {
        src: undefined,
        pip: false,
        playing: false,
        controls: false,
        volume: 0.75,
        light: false,
        muted: false,
        played: 0,
        duration: 0,
        // playbackRate: 1.0,
        loop: false,
        seeking: false,
        playedSeconds: 0,
    };
    const [state, setState] = useState<ReactPlayerStateDto>(initialState);
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
        setProgress(0);
        nextSong();
    };

    const setPlayerRef = useCallback((player: HTMLVideoElement) => {
        if (!player) return;
        playerRef.current = player;
    }, []);

    const onPlayPause = () => {
        setIsPlaying(!isPlaying);
    };
    const onClose = () => {
        setIsPlaying(false);
        setPlayList([]);
        setCurrentSongIndex(null);
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

    const musicPlayerPropsDto: MusicPlayerPropsDto = {
        showVolumeControl,
        setShowVolumeControl,
        isInConti,
        setIsInConti,
        setIsFullScreen,
        shuffle,
        setShuffle,
        repeatMode,
        hasPrev,
        hasNext,
        nextSong,
        prevSong,
        cycleRepeatMode,
        getRepeatIcon,
        state,
        setState,
        isSeeking,
        setIsSeeking,
        progress,
        setProgress,
        onPlayPause,
        handleLike,
        handleProgress,
        handleAddToConti,
        handleSeek,

        onClose,
        isLiked
    };

    return (
        <>
            {isFullScreen ? <FullScreenMusicPlayer {...musicPlayerPropsDto} /> : <SimpleBottomBar {...musicPlayerPropsDto} />}
            {/* ReactPlayer: 실제 오디오 재생 */}
            <div>
                <ReactPlayer
                    ref={setPlayerRef}
                    src={getFullYoutubeURIByVId(currentSong.youtubeVId)}
                    onProgress={handleProgress}
                    playing={isPlaying}
                    volume={state.volume}
                    loop={false}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    onError={() => alert("재생 중 오류 발생")}
                    style={{ display: "none" }}
                />
            </div>
        </>
    );
}