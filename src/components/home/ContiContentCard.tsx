import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import {SongKeyKorean} from "src/types/song/song-key.types";
import basicProfile from "src/assets/basic-profile.png";
import {ImageWithFallback} from "src/components/common/ImageWithFallback";

export default function ContiContentCard({
  contiWithSongDto,
}: {
  contiWithSongDto: ContiWithSongDto;
}) {
  const { id, date, songs, creator } = contiWithSongDto;
  const { praiseTeam, profileImage } = creator;

  return (
    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <ImageWithFallback
                src={profileImage ?? basicProfile.src}
                alt={praiseTeam.praiseTeamName}
                className="h-8 w-8 rounded-full object-cover"
            />
        </div>
        <div>
          <h3 className="text-lg">{praiseTeam.praiseTeamName}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>

      <div className="space-y-2">
        {songs.map((song, index) => (
          <div key={song.song.id} className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{index + 1}.</span>
              <span className="text-sm">{song.song.songName}</span>
            </div>
            {song.song.songKey && (
              <Badge variant="secondary" className="text-xs">
                {SongKeyKorean[song.song.songKey]} 키
              </Badge>
            )}
          </div>
        ))}
      </div>

      <Link href={`/conti/detail/${id}`}>
        <Button variant="link" className="w-full justify-center text-blue-600 p-0">
          더보기 <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </Card>
  );
}
