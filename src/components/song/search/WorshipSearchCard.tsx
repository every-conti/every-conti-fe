"use client";

import { Play, Clock, Share2, Plus, Text } from "lucide-react";
import { Card } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { ImageWithFallback } from "../../common/ImageWithFallback";
import { SongDetailDto } from "src/dto/common/song-detail.dto";
import { parseSongDuration } from "src/utils/parseSongDuration";
import { SongKeyKorean } from "src/types/song/song-key.types";
import { SongTempoKorean } from "src/types/song/song-tempo.types";
import Link from "next/link";
import PlayButton from "src/components/common/PlayButton";
import shareContent from "src/utils/shareContent";
import { useAuthStore } from "src/store/useAuthStore";
import { MinimumSongToPlayDto } from "src/dto/common/minimum-song-to-play.dto";
import {SongTypeKorean} from "src/types/song/song-type.types";

export default function WorshipSearchCard({
  song,
  onAddModalBtnClick,
  onLyricsModalClick,
}: {
  song: SongDetailDto;
  onAddModalBtnClick: (e: any, song: MinimumSongToPlayDto) => void;
  onLyricsModalClick: (e: any, song: MinimumSongToPlayDto) => void;
}) {
  const { user } = useAuthStore();
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row">
        <PlayButton songs={[song]}>
          {/* 썸네일 */}
          <div className="relative w-full h-40 sm:w-60 sm:h-auto flex-shrink-0">
            <ImageWithFallback
              src={song.thumbnail}
              alt={song.songName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-800 ml-1" />
              </div>
            </div>
            <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {parseSongDuration(song.duration)}
            </Badge>
          </div>
        </PlayButton>

        {/* 정보 */}
        <Link href={`/song/detail/${song.id}/${song.songName}`} className="h-full w-full">
          <div className="flex-1 p-3 flex flex-col">
            <div className="flex-1">
              <h3 className="text-base sm:text-lg mb-2 line-clamp-2">{song.songName}</h3>

              <div className="flex items-center flex-wrap gap-1 mb-3 text-sm">
                <p className="text-gray-600 pr-2">{song.praiseTeam.praiseTeamName}</p>
                <Badge variant="outline" className="text-xs">
                  {SongTypeKorean[song.songType]}
                </Badge>
                {song.songKey && (
                  <Badge variant="outline" className="text-xs">
                    {SongKeyKorean[song.songKey]} Key
                  </Badge>
                )}
                {song.tempo && (
                  <Badge variant="outline" className="text-xs">
                    {SongTempoKorean[song.tempo]}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {song.songThemes.map((theme) => (
                  <Badge
                    key={theme.id}
                    variant="outline"
                    className="text-xs bg-blue-100 text-blue-800"
                  >
                    {theme.themeName}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4">
              {/* 왼쪽 버튼들 */}
              <div className="flex items-center space-x-2">
                <PlayButton songs={[song]}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-1" />
                    재생
                  </Button>
                </PlayButton>
                <Button variant="outline" size="sm" onClick={(e) => onLyricsModalClick(e, song)}>
                  <Text className="w-4 h-4" />
                </Button>
                {user?.id && (
                  <Button variant="outline" size="sm" onClick={(e) => onAddModalBtnClick(e, song)}>
                    <Plus className="w-4 h-4" />
                    콘티에 추가
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    shareContent("song", `/song/detail/${song.id}/${song.songName}`, song);
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {/* 오른쪽 등록자 */}
              <div className="text-sm text-gray-500 sm:text-right">
                <p className="flex justify-end">
                  등록자: {song.creatorNickname ? song.creatorNickname.nickname : "에브리콘티"}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </Card>
  );
}
