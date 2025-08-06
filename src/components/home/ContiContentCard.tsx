import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import FamousContiDto from "src/dto/home/famous-conti.dto";

export default function ContiContentCard({ famousContiDto }: { famousContiDto: FamousContiDto }) {
        const { conti, praiseTeam } = famousContiDto;
    const { id, date, songs } = conti;
    const { previewImg } = praiseTeam;

  return (
    <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-xl">{previewImg}</span>
        </div>
        <div>
          <h3 className="text-lg">{praiseTeam.praiseTeamName}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>

      <div className="space-y-2">
        {songs.map((song, index) => (
          <div key={song.id} className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{index + 1}.</span>
              <span className="text-sm">{song.songName}</span>
            </div>
            {song.songKey && (
              <Badge variant="secondary" className="text-xs">
                {song.songKey} Key
              </Badge>
            )}
          </div>
        ))}
      </div>

        <Link href={`/conti/detail/${id}`} >
          <Button
            variant="link"
            className="w-full justify-center text-blue-600 p-0"
          >
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
    </Card>
  );
}
