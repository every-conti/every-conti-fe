import { useEffect, useState } from "react";
import { Calendar, Clock, Plus, Copy, Music, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import SongSimpleDto from "src/dto/home/song-simple.dto";
import { useAuthStore } from "src/store/useAuthStore";
import { fetchContiCopy, fetchContiCreate, useInfiniteMyContiQuery } from "src/app/api/conti/conti";
import { useInView } from "react-intersection-observer";
import { parseSongDuration } from "src/utils/parseSongDuration";
import { CreateContiDto } from "src/dto/conti/CreateContiDto";
import { CopyContiDto } from "src/dto/conti/CopyContiDto";
import { toast } from "sonner";
import { InfiniteData } from "@tanstack/query-core";
import { CommonInfiniteSearchDto } from "src/dto/search/common-infinite-search.dto";
import {SongKeyKorean} from "src/types/song/song-key.types";

interface SavedConti {
  id: string;
  title: string;
  description: string;
  date: string;
  songs: Array<SongSimpleDto>;
  totalDuration: string;
}

interface ContiCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  conti: ContiWithSongDto | null;
  savedContis: SavedConti[];
  onCreateNewConti: (conti: Omit<SavedConti, "id" | "totalDuration">) => void;
  onAddToExistingConti: (contiId: string, songs: ContiWithSongDto["songs"]) => void;
}

export default function ContiCopyModal({ isOpen, onClose, conti }: ContiCopyModalProps) {
  const { user } = useAuthStore();

  const [copyMode, setCopyMode] = useState<"new" | "existing">("new");
  const [title, setTitle] = useState(`${conti?.title} (복사본)`);
  const [description, setDescription] = useState(
    `${conti?.creator.nickname}의 "${conti?.title}" 콘티를 복사했습니다.`
  );
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedContiId, setSelectedContiId] = useState<string>("");
  const canQuery = Boolean(isOpen && user?.id && conti && isOpen && copyMode === "existing");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteMyContiQuery({ memberId: user?.id }, { enabled: canQuery });

  const contis: ContiWithSongDto[] =
    (data as InfiniteData<CommonInfiniteSearchDto<ContiWithSongDto>> | undefined)?.pages.flatMap(
      (p) => p.items
    ) ?? [];
  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (!canQuery) return;
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, canQuery]);

  useEffect(() => {
    if (!isOpen || !conti) return;
    setCopyMode("new");
    setTitle(`${conti.title} (복사본)`);
    setDescription(`${conti.creator.nickname}의 "${conti.title}" 콘티를 복사했습니다.`);
    setDate(new Date().toISOString().split("T")[0]);
    setSelectedContiId("");
  }, [isOpen, conti?.id]);

  // 총 재생 시간 계산
  const getTotalDuration = (songs: SongSimpleDto[]) => {
    const totalSeconds = songs.reduce((total, song) => total + song.song.duration, 0);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.info("로그인 해야 합니다.");
      return;
    }
    if (!conti) {
      toast.info("올바르지 않은 접근입니다.");
      return;
    }

    if (copyMode === "new") {
      if (!title.trim()) {
        toast.info("제목을 입력해주세요.");
        return;
      }

      const createContiDto: CreateContiDto = {
        title,
        description,
        date: new Date(date),
        songIds: conti.songs.map((song) => song.song.id),
        memberId: user.id,
      };

      try {
        await fetchContiCreate(createContiDto);
        toast.success("콘티가 생성되었습니다.");
      } catch (e) {
        toast.error("콘티 생성에 실패했습니다.");
        return;
      }
    } else {
      if (!selectedContiId) {
        alert("콘티를 선택해주세요.");
        return;
      }
      const copyContiDto: CopyContiDto = {
        copiedContiId: conti.id,
        targetContiId: selectedContiId,
        songIds: conti.songs.map((song) => song.song.id),
        memberId: user.id,
      };

      try {
        await fetchContiCopy(copyContiDto);
        toast.success("콘티가 복사되었습니다.");
      } catch (e) {
        toast.error("콘티 복사에 실패했습니다.");
        return;
      }
    }

    // 폼 초기화
    setTitle(`${conti?.title} (복사본)`);
    setDescription(`${conti?.creator.nickname}의 "${conti?.title}" 콘티를 복사했습니다.`);
    setDate(new Date().toISOString().split("T")[0]);
    setSelectedContiId("");

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Copy className="w-5 h-5" />
            <span>콘티 복사</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 원본 콘티 정보 */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">{conti?.title}</h3>
                <p className="text-sm text-blue-700 mb-2">{conti?.creator.nickname}</p>
                <div className="flex items-center space-x-4 text-xs text-blue-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{conti?.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{getTotalDuration(conti?.songs ?? [])}</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                    {conti?.songs.length}곡
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* 복사 모드 선택 */}
          <div className="space-y-4">
            <Label className="text-base">복사 방법을 선택하세요</Label>
            <RadioGroup
              value={copyMode}
              onValueChange={(value: "new" | "existing") => setCopyMode(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="flex items-center space-x-2 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  <span>새 콘티로 등록</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing" className="flex items-center space-x-2 cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                  <span>기존 콘티에 추가</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* 새 콘티 등록 폼 */}
          {copyMode === "new" && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="title">콘티 제목 *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="새 콘티의 제목을 입력하세요"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="콘티에 대한 설명을 입력하세요 (선택사항)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">날짜</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 기존 콘티 선택 */}
          {/* 3) 기존 콘티 선택 */}
          {copyMode === "existing" && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">불러오는 중…</div>
              ) : isError ? (
                <div className="text-center py-8 text-red-500">목록을 불러오지 못했어요.</div>
              ) : contis.length > 0 ? ( // 빈 배열은 false 처리
                <div className="space-y-2">
                  <Label>추가할 콘티 선택</Label>

                  <Select value={selectedContiId} onValueChange={setSelectedContiId}>
                    <SelectTrigger>
                      <SelectValue placeholder="콘티를 선택하세요" />
                    </SelectTrigger>

                    {/* 4) 스크롤 컨테이너(SelectContent) 내부에 sentinel과 로딩/더보기 UI 배치 */}
                    <SelectContent className="max-h-72 overflow-auto">
                      {contis.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium">{c.title}</div>
                              <div className="text-xs text-gray-500">
                                {c.date} • {c.songs.length}곡 • {getTotalDuration(c.songs)}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}

                      {/* sentinel: 반드시 스크롤 영역 '안'쪽에 */}
                      {hasNextPage && <div ref={ref} className="h-6" />}

                      {/* 로딩 중 메시지 */}
                      {isFetchingNextPage && (
                        <div className="px-3 py-2 text-xs text-gray-500">더 불러오는 중…</div>
                      )}

                      {/* 수동 더 불러오기 (inView 실패 대비) */}
                      {!isFetchingNextPage && hasNextPage && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => fetchNextPage()}
                        >
                          더 불러오기
                        </Button>
                      )}
                    </SelectContent>
                  </Select>

                  {selectedContiId && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      {(() => {
                        const selected = contis.find((c) => c.id === selectedContiId);
                        return selected ? (
                          <div>
                            <div className="font-medium text-sm mb-1">{selected.title}</div>
                            <div className="text-xs text-gray-600 mb-2 whitespace-pre-line">{selected.description}</div>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>{selected.songs.length}곡</span>
                              <span>{getTotalDuration(selected.songs)}</span>
                              <span>{selected.date}</span>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">저장된 콘티가 없습니다</p>
                  <p className="text-xs">새 콘티로 등록해주세요</p>
                </div>
              )}
            </div>
          )}

          {/* 복사될 곡 목록 미리보기 */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-600">
              복사될 곡 목록 ({conti?.songs.length}곡)
            </Label>
            <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-1">
              {conti?.songs.map((song, index) => (
                <div key={song.song.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 w-6">{index + 1}.</span>
                    <span className="font-medium">{song.song.songName}</span>
                    <span className="text-gray-500">- {song.song.praiseTeam.praiseTeamName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {song.song.songKey && (
                      <Badge variant="outline" className="text-xs">
                        {SongKeyKorean[song.song.songKey]}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {parseSongDuration(song.song.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                (copyMode === "existing" && contis.length === 0) ||
                (copyMode === "existing" && !selectedContiId) ||
                (copyMode === "new" && !title.trim())
              }
            >
              {copyMode === "new" ? "새 콘티 생성" : "기존 콘티에 추가"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
