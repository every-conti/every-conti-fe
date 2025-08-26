"use client";

import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Copy, Share2, X } from "lucide-react";
import { toast } from "sonner";

import { MinimumSongToPlayDto } from "src/dto/common/minimum-song-to-play.dto";
import { SongDetailDto } from "src/dto/common/song-detail.dto";
import { SongKeyKorean } from "src/types/song/song-key.types";
import { parseSongDuration } from "src/utils/parseSongDuration";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  song: (MinimumSongToPlayDto | SongDetailDto) | null;
};

export default function LyricsModal({ open, onOpenChange, song }: Props) {
  const title = song?.songName ?? "가사";
  const lyrics = useMemo(() => song?.lyrics ?? "", [song]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lyrics || "");
      toast.success("가사를 복사했어요.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: lyrics?.slice(0, 200) || "",
        });
      } else {
        await navigator.clipboard.writeText(lyrics || "");
        toast.success("공유가 지원되지 않아 복사로 대체했어요.");
      }
    } catch {
      // 사용자가 취소한 경우 등은 무시
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {"songType" in (song || {}) && song?.songType && (
                <Badge variant="outline" className="text-xs">
                  {song.songType}
                </Badge>
              )}
              {"praiseTeam" in (song || {}) && song?.praiseTeam && (
                <Badge variant="outline" className="text-xs">
                  {song.praiseTeam.praiseTeamName}
                </Badge>
              )}
              {"duration" in (song || {}) && typeof song?.duration === "number" && (
                <Badge variant="outline" className="text-xs">
                  {parseSongDuration(song.duration)}
                </Badge>
              )}
            </div>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={handleCopy} aria-label="가사 복사">
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleShare} aria-label="공유">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[70vh] px-5 py-4">
          {lyrics ? (
            <pre className="whitespace-pre-wrap break-words text-sm leading-7">{lyrics}</pre>
          ) : (
            <p className="text-sm text-muted-foreground">가사가 등록되지 않았습니다.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
