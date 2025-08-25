"use client";

import { useEffect, useState } from "react";
import {
    Clock, Music, Plus,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "src/components/ui/dialog";
import { Label } from "src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Card } from "src/components/ui/card";
import { useAuthStore } from "src/store/useAuthStore";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import {fetchContiAddSongs, useInfiniteMyContiQuery} from "src/app/api/conti/conti";
import { parseSongDuration } from "src/utils/parseSongDuration";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import {InfiniteData} from "@tanstack/query-core";
import {CommonInfiniteSearchDto} from "src/dto/search/common-infinite-search.dto";

type SongLike = {
    id: string;
    songName: string;
    praiseTeam: { praiseTeamName: string };
    duration: number;
    songKey?: string | null;
};

interface AddToContiModalProps {
    isOpen: boolean;
    onClose: () => void;
    song: SongLike | null;
}

export default function AddToContiModal({
    isOpen,
    onClose,
    song,
}: AddToContiModalProps) {
    const { user } = useAuthStore();
    const [selectedContiId, setSelectedContiId] = useState<string>("");

    const canQuery = Boolean(isOpen && user?.id);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteMyContiQuery(
        {memberId: user?.id ?? ""},
        {enabled: canQuery,}
    );

    const contis: ContiWithSongDto[] = (data as InfiniteData<CommonInfiniteSearchDto<ContiWithSongDto>> | undefined)?.pages.flatMap((p) => p.items) ?? [];
    const { ref, inView } = useInView({ threshold: 1 });

    useEffect(() => {
        if (!canQuery) return;
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, canQuery]);

    useEffect(() => {
        if (!isOpen) return;
        setSelectedContiId("");
    }, [isOpen]);

    const getTotalDuration = (songs: Array<{ song: { duration: number } }>) => {
        const total = songs.reduce((acc, s) => acc + (s.song?.duration ?? 0), 0);
        const m = Math.floor(total / 60);
        const sec = total % 60;
        return `${m}:${sec.toString().padStart(2, "0")}`;
        // 필요하면 parseSongDuration(total)로 통일
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.info("로그인이 필요합니다.");
            return;
        }
        if (!song) {
            toast.error("곡 정보를 찾을 수 없습니다.");
            return;
        }
        if (!selectedContiId) {
            toast.info("추가할 콘티를 선택하세요.");
            return;
        }

        try {
            await fetchContiAddSongs(
                selectedContiId,
                song.id,
            );
            toast.success("콘티에 곡이 추가되었습니다.");
            onClose();
        } catch (e: any) {
            toast.error("곡 추가에 실패했습니다. " + e.message);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        내 콘티에 추가
                    </DialogTitle>
                </DialogHeader>

                {/* 선택한 곡 미리보기 */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Music className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-blue-900">{song?.songName ?? "곡"}</div>
                            <div className="text-sm text-blue-700 mb-2">
                                {song?.praiseTeam?.praiseTeamName ?? ""}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-blue-700">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{song ? parseSongDuration(song.duration) : "-"}</span>
                                </div>
                                {song?.songKey && (
                                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                                        {song.songKey}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* 기존 콘티 선택 */}
                <div className="space-y-2">
                    <Label>추가할 콘티 선택</Label>
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">불러오는 중…</div>
                    ) : isError ? (
                        <div className="text-center py-8 text-red-500">목록을 불러오지 못했어요.</div>
                    ) : contis.length > 0 ? (
                        <Select value={selectedContiId} onValueChange={setSelectedContiId}>
                            <SelectTrigger>
                                <SelectValue placeholder="콘티를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent className="max-h-72 overflow-auto">
                                {contis.map((c: any) => (
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
                                {hasNextPage && <div ref={ref} className="h-6" />}
                                {isFetchingNextPage && (
                                    <div className="px-3 py-2 text-xs text-gray-500">더 불러오는 중…</div>
                                )}
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
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">저장된 콘티가 없습니다</p>
                            <p className="text-xs">콘티를 먼저 생성한 뒤 다시 시도하세요</p>
                        </div>
                    )}
                </div>

                {/* 액션 */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onClose}>취소</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedContiId || !song}
                    >
                        추가하기
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
