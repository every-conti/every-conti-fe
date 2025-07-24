import { Card } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Play, Clock } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import parseSongDuration from "src/utils/parseSongDuration";

interface NewWorshipCardProps {
  title: string;
  praiseTeam: string;
  duration: string;
  songType: string;
  thumbnail: string;
}

export default function NewWorshipCard({
  title,
  praiseTeam,
  duration,
  songType,
  thumbnail,
}: NewWorshipCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative">
        <ImageWithFallback
          src={thumbnail}
          alt={title}
          className="w-full h-36 object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="w-6 h-6 text-gray-800 ml-1" />
          </div>
        </div>
        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
          <Clock className="w-3 h-3 mr-1" />
          {/* {parseSongDuration(duration)} */}
          {duration ? parseSongDuration(duration) : "00:00"}
        </Badge>
      </div>
      <div className="p-4">
        <h4 className="text-sm mb-1 line-clamp-2">{title}</h4>
        <p className="text-xs text-gray-500 mb-1">{praiseTeam}</p>
        <p className="text-xs text-gray-400">{songType}</p>
      </div>
    </Card>
  );
}
