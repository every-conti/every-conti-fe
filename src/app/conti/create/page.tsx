"use client";
import { useState } from "react";
import {
  Search, GripVertical, Trash2, Calendar, Save,
} from "lucide-react";
import { Card } from "src/components/ui/card";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { ImageWithFallback } from "src/components/common/ImageWithFallback";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { SongDetailDto } from "src/dto/common/song-detail.dto";
import { useInfiniteSearchSongQuery } from "src/app/api/song";
import { parseSongDuration } from "src/utils/parseSongDuration";

// dnd-kit
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { CreateContiDto } from "src/dto/conti/CreateContiDto";
import { fetchContiCreate } from "src/app/api/conti";
import { useAuthStore } from "src/store/useAuthStore";
import { useRouter } from "next/navigation";
import withAuth from "src/components/common/withAuth";

function SortableSongItem({
  song,
  index,
  onRemove,
}: {
  song: SongDetailDto;
  index: number;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: song.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : undefined,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
      <div
          ref={setNodeRef}
          style={style}
          className="flex items-center space-x-3 p-3 sm:p-3.5 bg-gray-50 rounded-lg group"
      >
        {/* 드래그 핸들 */}
        <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
            aria-label="드래그하여 순서 변경"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        <div className="text-xs sm:text-sm text-gray-600 w-5 sm:w-6">{index + 1}.</div>

        <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0">
          <ImageWithFallback
              src={song.thumbnail}
              alt={song.songName}
              className="w-full h-full object-cover rounded"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base leading-tight line-clamp-1">{song.songName}</p>
          {song?.praiseTeam?.praiseTeamName && (
              <p className="text-[11px] sm:text-xs text-gray-600 leading-tight line-clamp-1">
                {song.praiseTeam.praiseTeamName}
              </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {song.songKey && (
              <Badge variant="outline" className="text-[10px] sm:text-xs">
                {song.songKey}
              </Badge>
          )}
          <span className="text-[11px] sm:text-xs text-gray-500">{parseSongDuration(song.duration)}</span>
        </div>

        <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(song.id)}
            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
  );
}

function ContiCreationPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [contiTitle, setContiTitle] = useState("");
  const [contiDate, setContiDate] = useState(new Date().toISOString().split("T")[0]);
  const [contiDescription, setContiDescription] = useState("");

  const [songDropdownOpen, setSongDropdownOpen] = useState(false);
  const [songSearchTerm, setSongSearchTerm] = useState<string | null>(null);
  const [debouncedSongSearchTerm] = useDebounce(songSearchTerm, 400);
  const [selectedSongs, setSelectedSongs] = useState<SongDetailDto[]>([]);
  const isSongSelected = (id: string) => selectedSongs.some((s) => s.id === id);
  const addSong = (song: SongDetailDto) => {
    if (!isSongSelected(song.id)) setSelectedSongs([...selectedSongs, song]);
  };
  const removeSong = (id: string) => {
    const filtered = selectedSongs.filter((s) => s.id !== id);
    setSelectedSongs(filtered.map((s, i) => ({ ...s, order: i })));
  };
  const toggleSong = (song: SongDetailDto) => {
    isSongSelected(song.id) ? removeSong(song.id) : addSong(song);
  };

  // dnd sensors
  const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // 드래그 종료
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = selectedSongs.findIndex((s) => s.id === active.id);
    const newIndex = selectedSongs.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(selectedSongs, oldIndex, newIndex).map((s, i) => ({
      ...s,
      order: i,
    }));
    setSelectedSongs(reordered);
  };

  // 총 시간
  const totalDuration = selectedSongs.reduce((total, song) => total + song.duration, 0);
  const formatTotalDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // 곡 검색
  const q = (debouncedSongSearchTerm ?? "").trim();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteSearchSongQuery(
      { text: q || undefined, enabled: q.length > 0 },
      { getNextPageParam: (lastPage: { nextOffset: number | null }) => lastPage.nextOffset ?? undefined }
  );
  const searchedSongs = data?.pages.flatMap((page: any) => page.items) ?? [];

  // 저장
  const handleSave = async () => {
    if (!user) {
      toast.info("로그인 해야 합니다.");
      return;
    }
    if (!contiTitle.trim()) {
      toast.info("콘티 제목을 입력해주세요.");
      return;
    }

    const createContiDto: CreateContiDto = {
      title: contiTitle,
      description: contiDescription,
      date: new Date(contiDate),
      songIds: selectedSongs.map((song) => song.id),
      memberId: user.id,
    };

    try {
      const createdConti = await fetchContiCreate(createContiDto);
      toast.success("콘티가 저장되었습니다!");
      router.push(`/conti/detail/${createdConti.id}`);
    } catch (e) {
      toast.error("콘티 저장에 실패했습니다.");
      return;
    }
  };

  // 초기화
  const handleClearConti = () => {
    setSelectedSongs([]);
    setContiTitle("");
    setContiDate("");
    setContiDescription("");
  };

  return (
      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 text-[13px] sm:text-base">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 sm:gap-y-3 lg:gap-y-6 gap-x-0 lg:gap-x-8">
          {/* 왼쪽 */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6 gap-y-2 sm:gap-y-4 gap-x-0">
              <h2 className="text-lg sm:text-xl sm:mb-4">콘티 정보</h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="title" className="mb-1.5 sm:mb-2 text-sm sm:text-base">콘티 제목</Label>
                  <Input
                      id="title"
                      placeholder="예: 2025년 1월 1일 주일예배"
                      value={contiTitle}
                      onChange={(e) => setContiTitle(e.target.value)}
                      className="h-9 sm:h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="mb-1.5 sm:mb-2 text-sm sm:text-base">날짜</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        id="date"
                        type="date"
                        value={contiDate}
                        onChange={(e) => setContiDate(e.target.value)}
                        className="pl-9 h-9 sm:h-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="mb-1.5 sm:mb-2 text-sm sm:text-base">
                    설명 (선택사항)
                  </Label>
                  <Textarea
                      id="description"
                      placeholder="콘티에 대한 추가 정보나 특별한 메모를 입력하세요"
                      value={contiDescription}
                      onChange={(e) => setContiDescription(e.target.value)}
                      rows={3}
                      className="text-sm sm:text-base"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 gap-y-2 sm:gap-y-4 gap-x-0">
              <h2 className="text-lg sm:text-xl">찬양 검색 및 추가</h2>
              <div className="relative flex-1">
                <div
                    className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-text"
                    onClick={() => setSongDropdownOpen(true)}
                >
                  <Search className="text-gray-400 w-4 h-4" />
                  <Input
                      placeholder={selectedSongs.length ? "추가로 검색하여 선택…" : "찬양 제목을 검색하세요…"}
                      value={songSearchTerm || ""}
                      onChange={(e) => {
                        setSongSearchTerm(e.target.value);
                        if (!songDropdownOpen) setSongDropdownOpen(true);
                      }}
                      className="border-0 focus-visible:ring-0 p-0 h-5 text-sm sm:text-base"
                  />
                </div>

                {/* 드롭다운: 제목 + 찬양팀 함께 표시 */}
                {songDropdownOpen && (
                    <div
                        className="absolute mt-2 w-full bg-white border rounded-md shadow-lg max-h-64 sm:max-h-72 overflow-auto z-50"
                        onScroll={(e) => {
                          const el = e.currentTarget;
                          const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 16;
                          if (nearBottom && hasNextPage && !isFetchingNextPage) fetchNextPage();
                        }}
                    >
                      {isLoading && <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500">검색 중…</div>}

                      {!isLoading && isError && (
                          <div className="p-3 sm:p-4 text-xs sm:text-sm text-red-500">
                            곡을 불러오지 못했어요. 다시 시도해 주세요.
                          </div>
                      )}

                      {!isLoading && !isError && searchedSongs.length === 0 && (
                          <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500">검색 결과가 없습니다.</div>
                      )}

                      {!isLoading &&
                          !isError &&
                          searchedSongs.map((song: any) => (
                              <button
                                  key={song.id}
                                  type="button"
                                  onClick={() => toggleSong(song)}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                              >
                                <div className="min-w-0 pr-2">
                                  <p className="text-sm leading-tight line-clamp-1">{song.songName}</p>
                                  {song?.praiseTeam?.praiseTeamName && (
                                      <p className="text-[11px] sm:text-xs text-gray-600 leading-tight line-clamp-1">
                                        {song.praiseTeam.praiseTeamName}
                                      </p>
                                  )}
                                </div>
                                {isSongSelected(song.id) ? (
                                    <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap">
                                      선택됨
                                    </Badge>
                                ) : null}
                              </button>
                          ))}

                      {isFetchingNextPage && (
                          <div className="p-3 text-center text-[11px] sm:text-xs text-gray-400">더 불러오는 중…</div>
                      )}

                      <div className="sticky bottom-0 bg-white border-t p-2 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSongDropdownOpen(false)}>
                          닫기
                        </Button>
                        <Button size="sm" onClick={() => setSongDropdownOpen(false)}>
                          확인
                        </Button>
                      </div>
                    </div>
                )}
              </div>
            </Card>
          </div>

          {/* 오른쪽: 선택된 콘티 / 드래그 정렬 */}
          <div>
            <Card className="p-4 sm:p-6 gap-y-2 sm:gap-y-4 gap-x-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl">선택된 찬양 목록</h2>
                <div className="text-[11px] sm:text-sm text-gray-600">
                  총 {selectedSongs.length}곡 • {formatTotalDuration(totalDuration)}
                </div>
              </div>

              {selectedSongs.length === 0 ? (
                  <div className="text-center py-10 sm:py-12 text-gray-500">
                    <p className="mb-2 sm:mb-3">아직 선택된 찬양이 없습니다</p>
                    <p className="text-xs sm:text-sm">지금 찬양을 검색하고 추가하거나</p>
                    <p className="text-xs sm:text-sm">나중에 곡들을 추가할 수 있어요</p>
                  </div>
              ) : (
                  <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext items={selectedSongs.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2.5 sm:space-y-3">
                        {selectedSongs.map((song, index) => (
                            <SortableSongItem key={song.id} song={song} index={index} onRemove={removeSong} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
              )}

              <div className="flex items-center space-x-2.5 sm:space-x-3 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-200">
                <Button
                    onClick={handleSave}
                    disabled={!contiTitle || !contiDate}
                    className="bg-blue-600 hover:bg-blue-700 flex-1 h-9 sm:h-10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  콘티 저장
                </Button>

                <Button
                    variant="outline"
                    onClick={handleClearConti}
                    disabled={!contiTitle && !contiDate && selectedSongs.length === 0}
                    className="text-red-600 hover:text-red-700 h-9 sm:h-10"
                >
                  초기화
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}

export default withAuth(ContiCreationPage);