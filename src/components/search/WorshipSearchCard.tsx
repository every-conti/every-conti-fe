import { Play, Clock, Heart, Share2 } from "lucide-react";
import { Card } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { ImageWithFallback } from "../common/ImageWithFallback";

interface WorshipSearchCardProps {
  title: string;
  artist: string;
  songKey: string;
  genre: string;
  duration: string;
  views: string;
  likes: string;
  thumbnail: string;
}

export default function WorshipSearchCard({
  title,
  artist,
  songKey: songKey,
  genre,
  duration,
  views,
  likes,
  thumbnail,
}: WorshipSearchCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex">
        {/* 썸네일 */}
        <div className="relative w-48 h-32 flex-shrink-0">
          <ImageWithFallback
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-gray-800 ml-1" />
            </div>
          </div>
          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {duration}
          </Badge>
        </div>

        {/* 정보 */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <h3 className="text-lg mb-2 line-clamp-2">{title}</h3>
            <p className="text-gray-600 mb-3">{artist}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {songKey} Key
              </Badge>
              <Badge variant="outline" className="text-xs">
                {genre}
              </Badge>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>조회수 {views}</p>
              <p>좋아요 {likes}</p>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex items-center space-x-2 mt-4">
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
        </div>
      </div>
    </Card>
  );
}
