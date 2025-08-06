import Link from "next/link";
import { Card } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Play, Clock } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { parseSongDuration } from "src/utils/parseSongDuration";
import SongLastsDto from "src/dto/home/song-lasts.dto";

export default function NewWorshipCard({ song }: { song: SongLastsDto }) {
  const { thumbnail, songName, duration, praiseTeam, songType, id } = song;

  return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <ImageWithFallback
              src={thumbnail}
              alt={songName}
              className="w-full h-36 object-cover"
          />

          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div
                className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center cursor-pointer"
                // onClick={(e) => {
                //   e.stopPropagation();
                //   // 여기에 재생 로직 추가
                //   console.log("재생 버튼 클릭");
                // }}
            >
              <Play className="w-6 h-6 text-gray-800 ml-1" />
            </div>
          </div>

          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {duration ? parseSongDuration(duration) : "00:00"}
          </Badge>
        </div>

        <Link href={`/song/detail/${id}/${songName}`} className="h-full block">
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <h4 className="text-sm mb-1 line-clamp-2">{songName}</h4>
            <p className="text-xs text-gray-500 mb-1">{praiseTeam.praiseTeamName}</p>
            <p className="text-xs text-gray-400">{songType}</p>
          </div>
        </Link>
      </Card>
  );
}
