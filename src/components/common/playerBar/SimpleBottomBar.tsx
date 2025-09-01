"use client";

import {
  Heart,
  Music,
  Pause,
  Play,
  Plus,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { Slider } from "src/components/ui/slider";
import { ImageWithFallback } from "../ImageWithFallback";
import { MusicPlayerPropsDto } from "./music-player-props.dto";
import { usePlayerStore } from "src/store/usePlayerStore";
import { useCurrentSong } from "src/store/useCurrentSong";
import { parseSongDuration } from "src/utils/parseSongDuration";
import { Badge } from "src/components/ui/badge";

export default function SimpleBottomBar(props: MusicPlayerPropsDto) {
  const { isPlaying } = usePlayerStore();
  const currentSong = useCurrentSong();

  const {
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
    // handleLike,
    handleProgress,
    handleAddToConti,
    handleSeek,

    onClose,
    // isLiked,
  } = props;

  const barObserverRef = useRef<ResizeObserver | null>(null);
  const [spacerH, setSpacerH] = useState(0);

  const setBarRef = useCallback((node: HTMLDivElement | null) => {
    // 이전 옵저버 정리
    if (barObserverRef.current) {
      barObserverRef.current.disconnect();
      barObserverRef.current = null;
    }

    if (!node) {
      setSpacerH(0);
      return;
    }

    const apply = () => setSpacerH(node.offsetHeight || 0);
    apply();

    const ro = new ResizeObserver(() => apply());
    ro.observe(node);
    barObserverRef.current = ro;

    const onResize = () => apply();
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!currentSong) return null;

  return (
    <>
      <div style={{ height: spacerH }} className="bg-gray-100" />
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-[1100px] mx-auto" ref={setBarRef}>
        <div className="bg-white border-t border-gray-200 shadow-lg rounded-2xl overflow-hidden">
          {/* 모바일: 기존 스타일 유지 + 좌측 텍스트 / 우측 컨트롤 + 토글 */}
          <div className="sm:hidden bg-white border-t border-gray-200 shadow-lg px-3 py-2">
            <div className="mb-2">
              <Slider
                variant="thin"
                value={[isSeeking ? progress : state.played * 100]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full h-1" // 높이 얇게
              />
            </div>

            <div
              className="flex items-center space-x-3 flex-1 min-w-0"
              onClick={() => setIsFullScreen(true)}
            >
              {/* 왼쪽: 제목/팀명만 */}
              <div className="min-w-0 flex-1 leading-tight">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {currentSong.songName}
                </div>
                <div className="text-[11px] text-gray-600 truncate">
                  {currentSong.praiseTeam.praiseTeamName}
                </div>
              </div>

              {/* 오른쪽: 이전 / 재생 / 다음 / 토글 */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <SkipBack className="w-5 h-5" />
                </Button>

                <Button
                  size="sm"
                  onClick={onPlayPause}
                  className="w-10 h-10 p-0 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                  aria-label={isPlaying ? "일시정지" : "재생"}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>

                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <SkipForward className="w-5 h-5" />
                </Button>

                {/* 토글 버튼 */}
                <div className="relative">
                  {/*<Button*/}
                  {/*    variant="ghost"*/}
                  {/*    size="sm"*/}
                  {/*    className="w-9 h-9 p-0"*/}
                  {/*    onClick={() => setShowMobileMenu(v => !v)}*/}
                  {/*    aria-label="추가 메뉴"*/}
                  {/*>*/}
                  {/*    <ListMusic className="w-5 h-5" />*/}
                  {/*</Button>*/}

                  <button
                    className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 disabled:opacity-60"
                    // onClick={() => { handleAddToConti(); setShowMobileMenu(false); }}
                    disabled={isInConti}
                  >
                    {isInConti ? <Music className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {/*<span className="text-sm">콘티</span>*/}
                  </button>
                  {/*{showMobileMenu && (*/}
                  {/*    // <div className="absolute bottom-full right-0 mb-2 w-44 rounded-lg bg-white text-gray-900 border shadow-lg p-1.5 z-50">*/}
                  {/*    <div className="fixed bottom-[72px] right-6 w-44 rounded-lg bg-white text-gray-900 border shadow-lg p-1.5 z-50">*/}
                  {/*    <button*/}
                  {/*            className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50"*/}
                  {/*            onClick={() => { handleLike(); setShowMobileMenu(false); }}*/}
                  {/*        >*/}
                  {/*            <Heart className={`w-4 h-4 ${isLiked ? "fill-current text-red-500" : ""}`} />*/}
                  {/*            <span className="text-sm">좋아요</span>*/}
                  {/*        </button>*/}

                  {/*        <button*/}
                  {/*            className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 disabled:opacity-60"*/}
                  {/*            onClick={() => { handleAddToConti(); setShowMobileMenu(false); }}*/}
                  {/*            disabled={isInConti}*/}
                  {/*        >*/}
                  {/*            {isInConti ? <Music className="w-4 h-4" /> : <Plus className="w-4 h-4" />}*/}
                  {/*            <span className="text-sm">{isInConti ? "콘티에 추가됨" : "콘티에 추가"}</span>*/}
                  {/*        </button>*/}

                  {/*        <button*/}
                  {/*            className="w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-gray-50 text-gray-600"*/}
                  {/*            onClick={() => { onClose(); setShowMobileMenu(false); }}*/}
                  {/*        >*/}
                  {/*            <X className="w-4 h-4" />*/}
                  {/*            <span className="text-sm">닫기</span>*/}
                  {/*        </button>*/}
                  {/*    </div>*/}
                  {/*)}*/}
                </div>
              </div>
            </div>
          </div>

          {/* 데스크탑: 기존 바 그대로 */}
          <div className="hidden sm:block bg-white border-t border-gray-200 shadow-lg">
            <Card className="rounded-none border-0 shadow-none">
              <div className="px-4 py-3">
                {/* 진행 바 */}
                <div className="mb-3">
                  <Slider
                    value={[isSeeking ? progress : state.played * 100]}
                    variant="thin"
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{parseSongDuration(state.playedSeconds)}</span>
                    <span>{parseSongDuration(currentSong.duration)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* 곡 정보 */}
                  <div
                    className="flex items-center space-x-3 flex-1 min-w-0"
                    onClick={() => setIsFullScreen(true)}
                  >
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
                            <div
                              className="w-0.5 h-3 bg-white rounded animate-pulse"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-0.5 h-3 bg-white rounded animate-pulse"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
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
                        {currentSong.songKey && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {currentSong.songKey}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {currentSong.songType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* 재생 컨트롤 */}
                  <div className="flex items-center space-x-2 mx-4">
                    {/* 반복 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-8 h-8 p-0 ${shuffle ? "text-blue-600" : "text-gray-400"}`}
                      onClick={() => setShuffle(!shuffle)}
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                      disabled={!hasPrev}
                      onClick={prevSong}
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
                      disabled={!hasNext}
                      onClick={nextSong}
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-8 h-8 p-0 ${repeatMode !== "off" ? "text-blue-600" : "text-gray-400"}`}
                      onClick={cycleRepeatMode}
                    >
                      {getRepeatIcon()}
                    </Button>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex items-center space-x-1">
                    <div className="w-full flex items-center gap-2 justify-between">
                      <Volume2
                        className="w-4 h-4"
                        onClick={() => setState((prev) => ({ ...prev, volume: 0 }))}
                      />
                      <Slider
                        value={[Math.round(state.volume * 100)]}
                        onValueChange={(v) =>
                          setState((prev) => ({ ...prev, volume: (v?.[0] ?? 0) / 100 }))
                        }
                        max={100}
                        step={1}
                        sliderBarBG="bg-blue-500"
                        variant="thin"
                        className="w-20 sm:w-24 h-6
                                                [--slider-track-height:6px]
                                                [&_.slider-track]:bg-white/30
                                                [&_.slider-range]:bg-blue-400
                                                [&_.slider-thumb]:bg-white
                                                [&_.slider-thumb]:ring-2
                                                [&_.slider-thumb]:ring-blue-400/60
                                              "
                      />
                    </div>

                    {/*<Button variant="ghost" size="sm" className="w-8 h-8 p-0" onClick={handleLike}>*/}
                    {/*  <Heart className={`w-4 h-4 ${isLiked ? "fill-current text-red-500" : ""}`} />*/}
                    {/*</Button>*/}

                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-8 h-8 p-0`}
                      onClick={() => handleAddToConti(currentSong)}
                      disabled={isInConti}
                    >
                      {<Plus className="w-4 h-4" />}
                    </Button>

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
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
