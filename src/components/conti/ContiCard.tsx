import { Card } from "src/components/ui/card";
import { ImageWithFallback } from "src/components/common/ImageWithFallback";
import { Calendar, Clock, MoreHorizontal, Play, Plus, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "src/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import shareContent from "src/utils/shareContent";
import { useState } from "react";
import { useAuthStore } from "src/store/useAuthStore";
import PlayButton from "src/components/common/PlayButton";
import Link from "next/link";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import basicProfile from "src/assets/basic-profile.png";

const ContiCard = ({
  conti,
  setModaledConti,
  setIsCopyModalOpen,
}: {
  conti: ContiWithSongDto;
  setModaledConti: (conti: ContiWithSongDto) => void;
  setIsCopyModalOpen: (isOpen: boolean) => void;
}) => {
  const [copying, setCopying] = useState(false);
  const { user } = useAuthStore();
  const [moreOpen, setMoreOpen] = useState(false);

  const totalDuration = conti.songs.reduce((total, song) => total + song.song.duration, 0);

  const formatTotalDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleCopyConti = async () => {
    try {
      setCopying(true);
    } catch (e: any) {
    } finally {
      setCopying(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group">
      {/* 썸네일 */}
      <PlayButton songs={conti.songs.map((s) => s.song)}>
        <div className="relative aspect-video overflow-hidden">
          <ImageWithFallback
            src={conti.songs[0].song.thumbnail}
            alt={conti.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* 재생 오버레이 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Play className="w-5 h-5 text-gray-800 ml-0.5" />
            </div>
          </div>

          {/* 곡 수 배지 */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/50 text-white border-0">
              {conti.songs.length}곡
            </Badge>
          </div>
        </div>
      </PlayButton>

      {/* 콘티 정보 */}
      <Link href={`/conti/detail/${conti.id}`}>
        <div className="p-4">
          {/* 제목과 설명 */}
          <div className="mb-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg mb-1 line-clamp-1">{conti.title}</h3>
              {/* 액션 */}
              <div className="flex items-center justify-between text-sm">
                {/* 우측 메뉴 (공유 / 내 콘티로 복사) */}
                <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        shareContent("conti", `/conti/detail/${conti.id}`, conti);
                        setMoreOpen(false);
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      공유하기
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={!user || copying}
                      onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModaledConti(conti);
                        setIsCopyModalOpen(true);
                        handleCopyConti();
                        setMoreOpen(false); // 보장용
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />내 콘티로 복사
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 whitespace-pre-line">{conti.description}</p>
          </div>

          {/* 작성자 찬양팀 정보 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ImageWithFallback
                src={conti.creator.profileImage ?? basicProfile.src}
                alt={conti.creator.nickname}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm text-gray-700">{conti.creator.nickname}</span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{conti.date.slice(5)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatTotalDuration(totalDuration)}</span>
              </div>
            </div>
          </div>

          {/* 노래 태그 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {conti.songs.slice(0, 4).map((song) => (
              <Badge key={song.song.id} variant="outline" className="text-xs">
                {song.song.songName}
              </Badge>
            ))}
            {conti.songs.length > 4 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{conti.songs.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ContiCard;
