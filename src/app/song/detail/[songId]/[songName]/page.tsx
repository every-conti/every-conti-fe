"use client";

import {
  Play,
  Share2,
  Clock,
  Music,
  BookOpen,
  Timer,
  Users,
  ArrowLeft,
  MoreVertical,
  Plus,
} from "lucide-react";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { ImageWithFallback } from "src/components/common/ImageWithFallback";
import { Badge } from "src/components/ui/badge";
import { ScrollArea } from "src/components/ui/scroll-area";
import { use, useState } from "react";
import { useCoUsedSongsQuery, useSongDetailQuery } from "src/app/api/song";
import { extractDateOnly, parseSongDuration } from "src/utils/parseSongDuration";
import { SongTypeKorean } from "src/types/song/song-type.types";
import { SongTempoKorean } from "src/types/song/song-tempo.types";
import { useRouter } from "next/navigation";
import shareContent from "src/utils/shareContent";
import { usePlayerStore } from "src/store/usePlayerStore";
import { MinimumSongToPlayDto } from "src/dto/common/minimum-song-to-play.dto";
import { useCurrentSong } from "src/store/useCurrentSong";
import AddToContiModal from "src/components/song/AddToContiModal";
import { useAuthStore } from "src/store/useAuthStore";

export default function Page({
  params,
}: {
  params: Promise<{ songId: string; songName: string }>;
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { songId, songName } = use(params);
  const { isPlaying, setIsPlaying, enqueueAndPlay } = usePlayerStore();
  const currentSong = useCurrentSong();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: song } = useSongDetailQuery(songId);
  const { data: coUsedSongs } = useCoUsedSongsQuery(songId);

  const isCurrentSongPlaying = currentSong?.id === song?.id && isPlaying;

  const handleAddToConti = () => {
    setIsAddModalOpen(true);
  };

  const handlePlay = () => {
    if (!song) return;

    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      enqueueAndPlay([song as MinimumSongToPlayDto]);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={router.back} className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로
              </Button>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => shareContent("song", window.location.href, song)}>
                  <Share2 className="w-4 h-4" />
                </Button>
                {/*<Button variant="ghost" size="sm">*/}
                {/*    <MoreVertical className="w-4 h-4"/>*/}
                {/*</Button>*/}
              </div>
            </div>
          </div>
        </div>

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
                    <Play className={`w-5 h-5 mr-2 ${isCurrentSongPlaying ? "hidden" : ""}`} />
                    <div className={`w-5 h-5 mr-2 ${isCurrentSongPlaying ? "" : "hidden"}`}>
                      <div className="flex space-x-1">
                        <div className="w-1 h-5 bg-white rounded animate-pulse"></div>
                        <div
                          className="w-1 h-5 bg-white rounded animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-1 h-5 bg-white rounded animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                    {isCurrentSongPlaying ? "재생 중..." : "재생하기"}
                  </Button>
                </div>
              </div>

              {/* 정보 */}
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <h1 className="text-2xl mb-2">{song?.songName}</h1>
                  <p className="text-lg text-gray-600 mb-4">{song?.praiseTeam.praiseTeamName}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {song?.songKey && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        {song.songKey}Key
                      </Badge>
                    )}
                    {song?.songType && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        {SongTypeKorean[song.songType]}
                      </Badge>
                    )}
                    {song?.duration && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {parseSongDuration(song.duration)}
                      </Badge>
                    )}
                    {song?.tempo && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {SongTempoKorean[song.tempo]}
                      </Badge>
                    )}
                  </div>

                  {/* 주제 */}
                  {song?.songThemes && (
                    <>
                      {song.songThemes.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm text-gray-600 mb-2">주제</h4>
                          <div className="flex flex-wrap gap-1">
                            {song?.songThemes.map((theme) => (
                              <Badge key={theme.id} variant="secondary" className="text-xs">
                                {theme.themeName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* 성경 구절 */}
                  {song?.bible && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800">관련 성경 구절</span>
                      </div>
                      <p className="text-blue-700">{song?.bible.bibleKoName}{song?.bibleChapter && " " + song?.bibleChapter.chapterNum + "장"}{song?.bibleVerse && " " + song?.bibleVerse.verseNum + "절"}</p>
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
                {user?.id && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleAddToConti}
                      // disabled={isInConti}
                      // className={isInConti ? "bg-green-100 text-green-700 border-green-300" : ""}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      콘티에 추가
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

                    {/*<Button*/}
                    {/*    variant="outline"*/}
                    {/*    onClick={handleLike}*/}
                    {/*    className={isLiked ? "text-red-600 border-red-300" : ""}*/}
                    {/*>*/}
                    {/*    <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />*/}
                    {/*    좋아요*/}
                    {/*</Button>*/}
                  </div>
                )}
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

          {/*곡 정보*/}
          <Card className="mb-8">
            <div className="p-6">
              <h3 className="text-lg mb-4 flex items-center gap-2">
                <Music className="w-5 h-5" />곡 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-6">
                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">곡 타입</span>
                      {song?.songType ? (
                        <span>{SongTypeKorean[song?.songType]}</span>
                      ) : (
                        <span className="text-gray-500">정보 없음</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">템포</span>
                      {song?.tempo ? (
                        <span>{SongTempoKorean[song?.tempo]}</span>
                      ) : (
                        <span className="text-gray-500">정보 없음</span>
                      )}
                    </div>
                    {song?.season && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">절기</span>
                        {song?.season ? (
                          <span>{song.season.seasonName}</span>
                        ) : (
                          <span className="text-gray-500">정보 없음</span>
                        )}
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">재생 시간</span>
                      {song?.duration ? (
                        <span>{parseSongDuration(song.duration)}</span>
                      ) : (
                        <span className="text-gray-500">정보 없음</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">키</span>
                      {song?.songKey ? (
                        <span>{song.songKey}</span>
                      ) : (
                        <span className="text-gray-500">정보 없음</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 가운데 세로 줄 */}
                <div className="hidden md:block w-px bg-gray-300 mx-auto" />

                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">찬양팀</span>
                      <span>{song?.praiseTeam.praiseTeamName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">등록자</span>
                      <span>
                        {song?.creatorNickname ? song?.creatorNickname.nickname : "에브리콘티"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">업로드 일시</span>
                      {song?.createdAt ? (
                        <span>{extractDateOnly(song?.createdAt)}</span>
                      ) : (
                        <span className="text-gray-500">정보 없음</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {coUsedSongs && (
            <Card className="overflow-hidden">
              <div className="p-4 sm:p-6">
                <h3 className="text-xl mb-3 sm:mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  함께 쓰인 곡들
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6">
                  이 곡과 함께 콘티에서 자주 사용되는 찬양들입니다
                </p>

                {coUsedSongs && coUsedSongs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {coUsedSongs.map((relatedSong, index) => (
                      <div
                        key={relatedSong.song.id}
                        onClick={() =>
                          router.push(
                            `/song/detail/${relatedSong.song.id}/${relatedSong.song.songName}`
                          )
                        }
                        className="flex items-center gap-3 sm:gap-4 w-full p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group min-w-0 overflow-hidden"
                      >
                        {/* 순번 */}
                        <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium">
                          {index + 1}
                        </div>

                        {/* 썸네일 */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-md overflow-hidden">
                          <ImageWithFallback
                            src={relatedSong.song.thumbnail}
                            alt={relatedSong.song.songName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>

                        {/* 곡 정보 */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base mb-0.5 sm:mb-1 text-gray-900 group-hover:text-blue-600 transition-colors truncate break-words">
                            {relatedSong.song.songName}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2 truncate break-words">
                            {relatedSong.song.praiseTeam.praiseTeamName}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-gray-500 min-w-0">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {parseSongDuration(relatedSong.song.duration)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {relatedSong.usageCount}회 사용
                            </div>
                            <Badge variant="outline" className="text-[11px] sm:text-xs">
                              {relatedSong.song.songType}
                            </Badge>
                          </div>
                        </div>

                        {/* 재생 버튼 */}
                        <div className="flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 h-9 sm:w-10 sm:h-10 p-0 hover:bg-blue-50 hover:text-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              enqueueAndPlay([relatedSong.song]);
                            }}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">관련된 곡이 없습니다.</p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
      <AddToContiModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        song={song ?? null}
      />
    </>
  );
}
