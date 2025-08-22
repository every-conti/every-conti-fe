"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    Play, Clock, Share2, Calendar, MoreVertical, Pencil, GripVertical, Trash2, Search,
} from "lucide-react";

import { Card } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { ImageWithFallback } from "src/components/common/ImageWithFallback";
import PlayButton from "src/components/common/PlayButton";
import shareContent from "src/utils/shareContent";
import { parseSongDuration } from "src/utils/parseSongDuration";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import { SongDetailDto } from "src/dto/common/song-detail.dto";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "src/components/ui/dialog";

import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "src/components/ui/tab";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { useInfiniteSearchSongQuery } from "src/app/api/song";

// dnd-kit
import {
    DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext, useSortable, arrayMove, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import { MinimumSongToPlayDto } from "src/dto/common/minimum-song-to-play.dto";
import {UpdateContiDto} from "src/dto/conti/UpdateContiDto";
import {fetchContiUpdate} from "src/app/api/conti";
import {useAuthStore} from "src/store/useAuthStore";

/** ▸ 커스텀 센서: data-dnd-zone="songs" 내부에서만 드래그 시작 허용 */
class ZonePointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: "onPointerDown" as const,
            handler: ({ nativeEvent }) => {
                return !!(nativeEvent.target as HTMLElement)?.closest('[data-dnd-zone="songs"]');
            },
        },
    ];
}

export default function ContiRowCard({ conti }: { conti: ContiWithSongDto }) {
    const {user} = useAuthStore();
    const totalSec = conti.songs.reduce((acc, s) => acc + s.song.duration, 0);
    const firstThumb = conti.songs[0]?.song.thumbnail;
    const playSongs = conti.songs.map((s) => s.song);

    // ---- Edit Modal state ----
    const [isEditOpen, setIsEditOpen] = useState(false);
    const initialDate = useMemo(() => toYYYYMMDD(conti.date), [conti.date]);
    const [menuOpen, setMenuOpen] = useState(false);

    const [editTitle, setEditTitle] = useState(conti.title ?? "");
    const [editDate, setEditDate] = useState(initialDate);
    const [editDesc, setEditDesc] = useState(conti.description ?? "");
    const [editSongs, setEditSongs] = useState<MinimumSongToPlayDto[]>(
        conti.songs.map((cs) => cs.song)
    );
    const [saving, setSaving] = useState(false);

    // 1) 배열 비교(순서까지 동일해야 true)
    const areArraysEqual = (a: string[], b: string[]) =>
        a.length === b.length && a.every((v, i) => v === b[i]);
    // 2) 기존/현재 songIds 준비
    const initialSongIds = useMemo(
        () => conti.songs.map((cs) => cs.song.id),
        [conti.songs]
    );
    const nextSongIds = editSongs.map((s) => s.id);
    // 3) 변경 여부
    const songIdsChanged = !areArraysEqual(initialSongIds, nextSongIds);

    const openEdit = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        setMenuOpen(false);
        setEditTitle(conti.title ?? "");
        setEditDate(toYYYYMMDD(conti.date));
        setEditDesc(conti.description ?? "");
        setEditSongs(conti.songs.map((cs) => cs.song));
        setIsEditOpen(true);
    };

    const handleSave = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setSaving(true);
        try {
            const dto: UpdateContiDto = {
                title: editTitle === conti.title ? undefined : editTitle,
                date: editDate === conti.date ? undefined : new Date(editDate),
                description: editDesc === conti.description ? undefined : editDesc,
                songIds: songIdsChanged ? nextSongIds : undefined,
                memberId: user?.id ?? "",
            };

            await fetchContiUpdate(conti.id, dto);

            setIsEditOpen(false);
            toast.success("콘티가 저장되었습니다!");
        } catch (err) {
            toast.error("저장에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row">
                    {/* 썸네일 */}
                    {playSongs.length > 0 ? (
                        <PlayButton songs={playSongs}>
                            <div
                                className="relative w-full sm:w-57 sm:h-auto flex-shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <ImageWithFallback
                                    src={firstThumb}
                                    alt={conti.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                                        <Play className="w-6 h-6 text-gray-800 ml-1" />
                                    </div>
                                </div>
                                <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {parseSongDuration(totalSec)}
                                </Badge>
                            </div>
                        </PlayButton>
                    ) : (
                        <div className="relative w-full sm:w-60 sm:h-auto flex-shrink-0">
                            <ImageWithFallback
                                src={firstThumb}
                                alt={conti.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* 정보 (Link로 디테일 이동) */}
                    <Link href={`/conti/detail/${conti.id}`} className="h-full w-full">
                        <div className="flex-1 p-3 flex flex-col">
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="text-base sm:text-lg mb-2 line-clamp-2">{conti.title}</h3>

                                    <div
                                        className="flex justify-end sm:justify-between sm:items-center"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    >
                                        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="p-1">
                                                    <MoreVertical className="w-5 h-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-36">
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setMenuOpen(false);
                                                        shareContent("conti");
                                                    }}
                                                >
                                                    <Share2 className="w-4 h-4 mr-2" />
                                                    공유
                                                </DropdownMenuItem>

                                                <DropdownMenuItem onClick={openEdit}>
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    수정
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                <div className="flex w-full items-center flex-wrap gap-2 text-sm mb-3">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {conti.date}
                                    </div>
                                    {conti.songs.length > 0 && (
                                        <>
                                            <Badge variant="outline" className="text-xs">
                                                곡 {conti.songs.length}개
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                총 {parseSongDuration(totalSec)}
                                            </Badge>
                                        </>
                                    )}
                                </div>

                                {/* 곡 미리보기 */}
                                {conti.songs.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        {conti.songs.slice(0, 3).map((s, i) => (
                                            <div key={s.song.id} className="text-xs text-gray-600 flex justify-between">
                        <span className="truncate w-56">
                          {i + 1}. {s.song.songName}
                        </span>
                                                <span className="text-gray-400">
                          {parseSongDuration(s.song.duration)}
                        </span>
                                            </div>
                                        ))}
                                        {conti.songs.length > 3 && (
                                            <p className="text-xs text-gray-400">외 {conti.songs.length - 3}곡 더 있음…</p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                    <span className="truncate w-56 text-xs text-gray-600">
                      아직 곡이 등록되지 않았습니다.
                    </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                </div>
            </Card>

            {/* ---- Edit Modal ---- */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent
                    className="sm:max-w-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DialogHeader>
                        <DialogTitle>콘티 수정</DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="info">
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="info">기본 정보</TabsTrigger>
                            <TabsTrigger value="songs">곡 편집</TabsTrigger>
                        </TabsList>

                        {/* ---------- 기본 정보 ---------- */}
                        <TabsContent value="info" className="mt-4">
                            <form onSubmit={handleSave} className="space-y-4" onClick={(e) => e.stopPropagation()}>
                                <div className="space-y-2">
                                    <Label htmlFor="conti-title">제목</Label>
                                    <Input
                                        id="conti-title"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="예: 2025년 1월 1일 주일예배"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="conti-date">날짜</Label>
                                    <Input
                                        id="conti-date"
                                        type="date"
                                        value={editDate}
                                        onChange={(e) => setEditDate(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="conti-desc">설명</Label>
                                    <Textarea
                                        id="conti-desc"
                                        value={editDesc}
                                        onChange={(e) => setEditDesc(e.target.value)}
                                        placeholder="예: 1부/2부 공통, 헌금송 OO팀"
                                        rows={3}
                                    />
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>
                                        취소
                                    </Button>
                                    <Button type="submit" disabled={saving}>
                                        {saving ? "저장 중…" : "저장"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </TabsContent>

                        {/* ---------- 곡 편집 ---------- */}
                        <TabsContent value="songs" className="mt-4" onClick={(e: any) => e.stopPropagation()}>
                            <SongPickerAndList
                                value={editSongs}
                                onChange={(songs) => setEditSongs(songs)}
                            />

                            <div className="flex items-center justify-end mt-4">
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? "저장 중…" : "곡 구성 저장"}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
}

/** yyyy-mm-dd 로 변환 (date 문자열/ISO 등 방어) */
function toYYYYMMDD(src: string | Date): string {
    try {
        const d = new Date(src);
        if (Number.isNaN(d.getTime())) return "";
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    } catch {
        return "";
    }
}

/* =========================
   곡 검색/추가/정렬 컴포넌트
   ========================= */

function SongPickerAndList({
                               value,
                               onChange,
                           }: {
    value: MinimumSongToPlayDto[];
    onChange: (songs: MinimumSongToPlayDto[]) => void;
}) {
    const [songDropdownOpen, setSongDropdownOpen] = useState(false);
    const [songSearchTerm, setSongSearchTerm] = useState<string | null>(null);
    const [debouncedSongSearchTerm] = useDebounce(songSearchTerm, 400);

    const isSongSelected = (id: string) => value.some((s) => s.id === id);
    const addSong = (song: MinimumSongToPlayDto) => {
        if (!isSongSelected(song.id)) onChange([...value, song]);
    };
    const removeSong = (id: string) => {
        const filtered = value.filter((s) => s.id !== id);
        onChange(filtered.map((s, i) => ({ ...s, order: i })));
    };
    const toggleSong = (song: SongDetailDto) => {
        isSongSelected(song.id)
            ? removeSong(song.id)
            : addSong(song as unknown as MinimumSongToPlayDto);
    };

    // ✨ 리스트 스크롤 컨테이너 + 드래깅 상태
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [dragging, setDragging] = useState(false);

    // ✨ 컨테이너 내부에서만 드래그 시작되는 커스텀 센서
    const sensors = useSensors(
        useSensor(ZonePointerSensor, { activationConstraint: { distance: 8 } })
    );

    // ✨ 간단 autoscroll
    useEffect(() => {
        if (!dragging) return;
        const handleMove = (e: PointerEvent) => {
            const el = scrollRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const y = e.clientY;
            const threshold = 40;
            const step = 16;
            if (y < rect.top + threshold) el.scrollTop -= step;
            else if (y > rect.bottom - threshold) el.scrollTop += step;
        };
        window.addEventListener("pointermove", handleMove);
        return () => window.removeEventListener("pointermove", handleMove);
    }, [dragging]);

    // 정렬
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = value.findIndex((s) => s.id === active.id);
        const newIndex = value.findIndex((s) => s.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const reordered = arrayMove(value, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
        onChange(reordered);
    };

    // 검색
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

    const totalDuration = value.reduce((acc, s) => acc + s.duration, 0);
    const formatTotalDuration = (sec: number) =>
        `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

    return (
        <div className="space-y-4">
            {/* 검색창 */}
            <div className="relative">
                <div
                    className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-text"
                    onClick={() => setSongDropdownOpen(true)}
                >
                    <Search className="text-gray-400 w-4 h-4" />
                    <Input
                        placeholder={value.length ? "추가로 검색하여 선택…" : "찬양 제목을 검색하세요…"}
                        value={songSearchTerm ?? ""}
                        onChange={(e) => {
                            setSongSearchTerm(e.target.value);
                            if (!songDropdownOpen) setSongDropdownOpen(true);
                        }}
                        className="border-0 focus-visible:ring-0 p-0 h-5"
                    />
                </div>

                {songDropdownOpen && (
                    <div
                        className="absolute mt-2 w-full bg-white border rounded-md shadow-lg max-h-64 sm:max-h-72 overflow-auto z-50"
                        onScroll={(e) => {
                            const el = e.currentTarget;
                            const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 16;
                            if (nearBottom && hasNextPage && !isFetchingNextPage) fetchNextPage();
                        }}
                    >
                        {isLoading && <div className="p-3 text-sm text-gray-500">검색 중…</div>}

                        {!isLoading && isError && (
                            <div className="p-3 text-sm text-red-500">곡을 불러오지 못했어요. 다시 시도해 주세요.</div>
                        )}

                        {!isLoading && !isError && searchedSongs.length === 0 && (
                            <div className="p-3 text-sm text-gray-500">검색 결과가 없습니다.</div>
                        )}

                        {!isLoading &&
                            !isError &&
                            searchedSongs.map((song: SongDetailDto) => (
                                <button
                                    key={song.id}
                                    type="button"
                                    onClick={() => toggleSong(song)}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between"
                                >
                                    <div className="min-w-0 pr-2">
                                        <p className="text-sm leading-tight line-clamp-1">{song.songName}</p>
                                        {song?.praiseTeam?.praiseTeamName && (
                                            <p className="text-[11px] text-gray-600 leading-tight line-clamp-1">
                                                {song.praiseTeam.praiseTeamName}
                                            </p>
                                        )}
                                    </div>
                                    {isSongSelected(song.id) ? (
                                        <Badge variant="secondary" className="text-[10px] whitespace-nowrap">
                                            선택됨
                                        </Badge>
                                    ) : null}
                                </button>
                            ))}

                        {isFetchingNextPage && (
                            <div className="p-3 text-center text-xs text-gray-400">더 불러오는 중…</div>
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

            {/* 선택된 곡 정렬/삭제 */}
            <Card className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base sm:text-lg">선택된 찬양</h3>
                    <div className="text-[11px] sm:text-sm text-gray-600">
                        총 {value.length}곡 • {formatTotalDuration(totalDuration)}
                    </div>
                </div>

                {/* ✨ 이 컨테이너 안에서만 드래그 시작 가능 */}
                <div
                    ref={scrollRef}
                    data-dnd-zone="songs"
                    className="max-h-[50vh] overflow-y-auto pr-1 select-none"
                >
                    {value.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            아직 선택된 찬양이 없습니다. 위에서 검색해 추가하세요.
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={() => setDragging(true)}
                            onDragEnd={(e) => { setDragging(false); handleDragEnd(e); }}
                            onDragCancel={() => setDragging(false)}
                            modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
                        >
                            <SortableContext items={value.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2.5 sm:space-y-3">
                                    {value.map((song, index) => (
                                        <SortableSongItem
                                            key={song.id}
                                            song={song}
                                            index={index}
                                            onRemove={(id) => removeSong(id)}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </Card>
        </div>
    );
}

/* =========================
   SortableSongItem
   ========================= */

function SortableSongItem({
                              song,
                              index,
                              onRemove,
                          }: {
    song: MinimumSongToPlayDto;
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
            className="flex items-center space-x-1.5 p-1 sm:p-3.5 bg-gray-50 rounded-lg group"
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
                <span className="text-[11px] sm:text-xs text-gray-500">
          {parseSongDuration(song.duration)}
        </span>
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
