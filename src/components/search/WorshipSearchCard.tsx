import { Play, Clock, Heart, Share2 } from "lucide-react";
import { Card } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { SongDetailDto } from "src/dto/search/song-detail.dto";
import parseSongDuration from "src/utils/parseSongDuration";

export default function WorshipSearchCard(song: SongDetailDto) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        {/* 썸네일 */}
        <div className="relative w-60 h-full flex-shrink-0">
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

        {/* 정보 */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg mb-2 line-clamp-2">{song.songName}</h3>
            <p className="text-gray-600 mb-3">
              {song.praiseTeam.praiseTeamName}

              <Badge variant="outline" className="text-xs">
                {song.songType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {song.key} Key
              </Badge>
              <Badge variant="outline" className="text-xs">
                {song.tempo}
              </Badge>
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {/* <Badge variant="outline" className="text-xs">
                {song.key} Key
              </Badge>
              <Badge variant="outline" className="text-xs">
                {song.songType}
              </Badge> */}
              {song.songThemes.map((theme) => (
                <Badge
                  key={theme.id}
                  variant="outline"
                  className="text-xs bg-blue-100 text-blue-800"
                >
                  {theme.songThemeName}
                </Badge>
              ))}
              {/* <Badge variant="outline" className="text-xs">
                {song.tempo}
              </Badge> */}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-between items-center mt-4">
            {/* 왼쪽 버튼들 */}
            <div className="flex items-center space-x-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Play className="w-4 h-4 mr-1" />
                재생
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* 오른쪽 등록자 */}
            <div className="text-sm text-gray-500">
              <p>등록자: {song.creatorNickname.nickname}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
