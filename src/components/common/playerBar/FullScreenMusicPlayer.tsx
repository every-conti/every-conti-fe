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
  ChevronDown,
  List,
  MoreHorizontal,
  Share2,
  Text,
} from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../ImageWithFallback";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Slider } from "src/components/ui/slider";
import { ScrollArea } from "src/components/ui/scroll-area";
import { MusicPlayerPropsDto } from "./music-player-props.dto";
import { usePlayerStore } from "src/store/usePlayerStore";
import { useCurrentSong } from "src/store/useCurrentSong";
import { parseSongDuration } from "src/utils/parseSongDuration";
import shareContent from "src/utils/shareContent";
import { useScrollLock } from "src/hooks/useScrollLock";

function QueueItem({
  song,
  index,
  isActive,
  isPlaying,
  setCurrentSongIndex,
}: {
  song: any;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  setCurrentSongIndex: (idx: number) => void;
}) {
  return (
    <div
      key={`queue-${song.id ?? index}`}
      onClick={() => setCurrentSongIndex(index)}
      className={`w-full max-w-full flex justify-between items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg transition-colors ${
        isActive ? "bg-white/20 border border-white/30" : "hover:bg-white/10"
      }`}
    >
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-md overflow-hidden flex-shrink-0">
        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={song.thumbnail}
            alt={song.songName}
            className="w-full h-full object-cover"
          />
          {isActive && isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
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
      </div>

      <div className="flex-1 min-w-0">
        <h4
          className={`${isActive ? "text-blue-300" : "text-white"} line-clamp-1`}
          title={song.songName}
        >
          {song.songName}
        </h4>
        <p
          className="truncate text-xs sm:text-sm text-gray-300"
          title={song.praiseTeam?.praiseTeamName}
        >
          {song.praiseTeam?.praiseTeamName}
        </p>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        {song.songKey && (
          <Badge
            variant="outline"
            className="bg-white/10 text-white border-white/20 text-[10px] sm:text-xs"
          >
            {song.songKey}
          </Badge>
        )}
        <span className="text-xs sm:text-sm text-gray-300">{parseSongDuration(song.duration)}</span>
      </div>
    </div>
  );
}

export default function FullScreenMusicPlayer(props: MusicPlayerPropsDto) {
  const { isPlaying, playlist, currentSongIndex, setCurrentSongIndex } = usePlayerStore();
  const currentSong = useCurrentSong();

  // 가사/대기열/기본 뷰 전환
  const [viewMode, setViewMode] = useState<"default" | "queue" | "lyrics">("default");

  const {
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
    progress,
    onPlayPause,
    // handleLike,
    handleAddToConti,
    handleSeek,
    // isLiked,
    isInConti,
  } = props;

  // 배경 스크롤 잠금
  useScrollLock(true);

  if (!currentSong) return null;

  return (
    <div
      className="fixed inset-0 z-50 w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overscroll-none"
      role="dialog"
      aria-modal="true"
    >
      {/* 배경 */}
      <div className="absolute inset-0 overflow-hidden">
        <ImageWithFallback
          src={currentSong.thumbnail}
          alt={currentSong.songName}
          className="w-full h-full object-cover scale-110 blur-3xl opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
      </div>

      {/* 컨텐츠 래퍼 */}
      <div className="relative z-10 h-[100dvh] max-h-[100dvh] w-screen max-w-screen flex flex-col text-white">
        {/* 헤더 */}
        <div className="shrink-0 h-14 flex items-center justify-between px-4 sm:px-6 w-full max-w-screen">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullScreen(false)}
            className="text-white hover:bg-white/20"
          >
            <ChevronDown className="w-6 h-6" />
          </Button>

          <div className="flex items-center space-x-1">
            {/* 가사 토글 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode((m) => (m === "lyrics" ? "default" : "lyrics"))}
              className={`text-white hover:bg-white/20 ${viewMode === "lyrics" ? "text-blue-300" : ""}`}
              title={viewMode === "lyrics" ? "가사 닫기" : "가사 전체화면"}
            >
              <Text className="w-5 h-5" />
            </Button>

            {/* 대기열 토글 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode((m) => (m === "queue" ? "default" : "queue"))}
              className={`text-white hover:bg-white/20 ${viewMode === "queue" ? "text-blue-300" : ""}`}
              title={viewMode === "queue" ? "대기열 닫기" : "대기열 전체화면"}
            >
              <List className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => shareContent("song")}
              className="text-white hover:bg-white/20"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setIsFullScreen(false)}
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* 본문: 항상 가운데 정렬 */}
        <div className="flex-1 overflow-hidden px-4 sm:px-6 pb-6 w-full max-w-screen mx-auto flex items-center justify-center">
          {viewMode === "queue" ? (
            // === 대기열 전체화면 ===
            <div className="w-full max-w-4xl mx-auto">
              <div className="flex items-center justify-between py-2">
                <h2 className="text-lg sm:text-xl font-semibold">재생 대기열</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("default")}
                  className="bg-white/10 text-white border-white/20"
                >
                  닫기
                </Button>
              </div>

              <div className="h-[calc(100dvh-10rem)] w-full">
                <ScrollArea className="h-full overscroll-contain">
                  {playlist.length > 0 ? (
                    <div className="space-y-2">
                      {playlist.map((song, index) => (
                        <QueueItem
                          key={`queue-full-${song.id + index}`}
                          song={song}
                          index={index}
                          isActive={index === (currentSongIndex ?? -1)}
                          isPlaying={isPlaying}
                          setCurrentSongIndex={setCurrentSongIndex}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-16">
                      <List className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>재생 대기열이 비어있습니다</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          ) : viewMode === "lyrics" ? (
            // === 가사 전체화면 ===
            <div className="w-full max-w-3xl mx-auto">
              <div className="flex items-center justify-between py-2">
                <h2 className="text-lg sm:text-xl font-semibold">가사</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("default")}
                  className="bg-white/10 text-white border-white/20"
                >
                  닫기
                </Button>
              </div>

              <div className="h-[calc(100dvh-14rem)]">
                <ScrollArea className="h-full px-2 overscroll-contain">
                  {currentSong.lyrics ? (
                    <div className="text-center leading-relaxed space-y-6 pb-8 text-base sm:text-lg">
                      {currentSong.lyrics.split("\n\n").map((verse: string, i: number) => (
                        <div key={i} className="text-gray-100">
                          {verse.split("\n").map((line: string, j: number) => (
                            <div
                              key={j}
                              className={`${line.includes("후렴:") ? "text-blue-300 font-medium text-lg sm:text-xl mb-2" : ""} ${
                                line.trim() === "" ? "h-2" : ""
                              }`}
                            >
                              {line}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-16">
                      <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>가사 정보가 없습니다</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          ) : (
            // === 기본 뷰 ===
            <div className="w-full max-w-6xl mx-auto min-h-0 flex flex-col items-center justify-center gap-6 lg:gap-8">
              {/* 앨범/정보/컨트롤 */}
              <div className="flex flex-col items-center w-full max-w-full">
                {/* 앨범 아트: 중앙 + 반응형 크기 */}
                <div
                  className="relative w-full max-w-[82vw] sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl mb-5 sm:mb-7 cursor-pointer group"
                  onClick={() => setViewMode("lyrics")}
                  title="가사 보기"
                >
                  <ImageWithFallback
                    src={currentSong.thumbnail}
                    alt={currentSong.songName}
                    className="w-full h-full object-cover group-active:scale-[0.99] transition-transform"
                  />
                  {isPlaying && (
                    <div className="absolute bottom-4 right-4">
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-white/80 rounded animate-pulse"></div>
                        <div
                          className="w-1 h-4 bg-white/80 rounded animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-1 h-4 bg-white/80 rounded animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 곡 정보 */}
                <div className="text-center mb-6 px-2 w-full max-w-full">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl mb-1.5 truncate ">
                    {currentSong.songName}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-300 mb-3 truncate ">
                    {currentSong.praiseTeam.praiseTeamName}
                  </p>

                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    {currentSong.songKey && (
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                        {currentSong.songKey}
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                      {currentSong.songType}
                    </Badge>
                  </div>
                </div>

                {/* 진행 바 */}
                <div className="w-full max-w-md mb-5">
                  <Slider
                    variant="thin"
                    value={[isSeeking ? progress : state.played * 100]}
                    sliderBarBG="bg-blue-500"
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="w-full [&_.slider-thumb]:bg-white [&_.slider-track]:bg-white/30 [&_.slider-range]:bg-white"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-300 mt-2">
                    <span>{parseSongDuration(state.playedSeconds)}</span>
                    <span>{parseSongDuration(currentSong.duration)}</span>
                  </div>
                </div>

                {/* 메인 컨트롤 */}
                <div className="flex items-center justify-center gap-5 sm:gap-6 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShuffle(!shuffle)}
                    className={`text-white hover:bg-white/20 ${shuffle ? "text-blue-400" : ""}`}
                  >
                    <Shuffle className="w-5 h-5 sm:w-5 sm:h-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevSong}
                    disabled={!hasPrev}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-6 h-6 sm:w-6 sm:h-6" />
                  </Button>

                  <Button
                    onClick={onPlayPause}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black hover:bg-gray-200 shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 md:w-8 md:h-8" />
                    ) : (
                      <Play className="w-7 h-7 md:w-8 md:h-8 ml-0.5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextSong}
                    disabled={!hasNext && !(repeatMode === "all")}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-6 h-6 sm:w-6 sm:h-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cycleRepeatMode}
                    className={`text-white hover:bg-white/20 ${repeatMode !== "off" ? "text-blue-400" : ""}`}
                  >
                    {getRepeatIcon()}
                  </Button>
                </div>

                {/* 추가 액션 + 볼륨 */}
                <div className="flex items-center gap-4 w-full max-w-full justify-center">
                  {/*<Button*/}
                  {/*  variant="ghost"*/}
                  {/*  size="icon"*/}
                  {/*  onClick={handleLike}*/}
                  {/*  className="text-white hover:bg-white/20"*/}
                  {/*>*/}
                  {/*  <Heart className={`w-5 h-5 ${isLiked ? "fill-current text-red-400" : ""}`} />*/}
                  {/*</Button>*/}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleAddToConti(currentSong)}
                    disabled={isInConti}
                    className={`text-white hover:bg-white/20 ${isInConti ? "text-green-400" : ""}`}
                  >
                    {isInConti ? <Music className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Volume2
                      className="w-4 h-4 text-gray-300"
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
                      className="
                        w-28 sm:w-32 h-6
                        [--slider-track-height:6px]
                        [&_.slider-track]:bg-white/30
                        [&_.slider-range]:bg-blue-400
                        [&_.slider-thumb]:bg-white
                        [&_.slider-thumb]:ring-2
                        [&_.slider-thumb]:ring-blue-400/60
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
