"use client";
import PageTitle from "src/components/common/PageTitle";
import ContiCard from "src/components/conti/ContiCard";
import { useContiPropertiesQuery, useInfiniteSearchContiQuery } from "src/app/api/conti/conti";
import LoadingSpinner from "src/components/common/LoadingSpinner";
import { useInView } from "react-intersection-observer";
import ContiSearchFilters from "src/components/conti/ContiSearchFilters";
import { useMemo, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { SongTypeTypes } from "src/types/song/song-type.types";
import PraiseTeamDto from "src/dto/common/praise-team.dto";
import { SongDetailDto } from "src/dto/common/song-detail.dto";
import { MAX_TOTAL_DURATION, MIN_TOTAL_DURATION } from "src/constant/conti/conti-search.constant";
import ContiCopyModal from "src/components/conti/ContiCopyModal";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ContiSearchComponent() {
  const { ref, inView } = useInView({ threshold: 1 });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [songSearchTerm, setSongSearchTerm] = useState<string | null>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);
  const [debouncedSongSearchTerm] = useDebounce(songSearchTerm, 400);

  const [selectedPraiseTeam, setSelectedPraiseTeam] = useState<PraiseTeamDto | null>(null);
  const [includePersonalConti, setIncludePersonalConti] = useState<boolean>(false);
  const [duration, setDuration] = useState<[number, number]>([
    MIN_TOTAL_DURATION,
    MAX_TOTAL_DURATION,
  ]);
  const durationChanged = duration[0] !== MIN_TOTAL_DURATION || duration[1] !== MAX_TOTAL_DURATION;

  const [selectedSongs, setSelectedSongs] = useState<SongDetailDto[]>([]);

  const [modaledConti, setModaledConti] = useState<ContiWithSongDto | null>(null);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);

  const { data: searchContiProperties } = useContiPropertiesQuery();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteSearchContiQuery(
      {
        text: debouncedSearchTerm ?? undefined,
        praiseTeamId: selectedPraiseTeam?.id,
        songIds:
          selectedSongs && selectedSongs.length > 0 ? selectedSongs.map((s) => s.id) : undefined,
        minTotalDuration: durationChanged ? duration[0] * 60 : undefined,
        maxTotalDuration: durationChanged ? duration[1] * 60 : undefined,
        includePersonalConti,
      },
      {
        getNextPageParam: (lastPage: { nextOffset: number | null }) =>
          lastPage.nextOffset ?? undefined,
      }
    );

  const contis = data?.pages.flatMap((page) => page.items) ?? [];

  // 무한 스크롤 트리거
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // -----------------------
  // URL <-> State 동기화
  // -----------------------
  const [isRestored, setIsRestored] = useState(false);

  const parseIntOrNull = (v?: string | null) =>
    v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : null;

  const parseBool = (v?: string | null) => {
    if (!v) return false;
    const lowered = v.toLowerCase();
    return lowered === "1" || lowered === "true" || lowered === "y";
  };

  // URL -> State (초기 + 앞으로/뒤로 이동)
  useEffect(() => {
    if (!searchContiProperties) return;

    // 항상 최신 스냅샷에서 읽기
    const text = searchParams.get("text");
    const songText = searchParams.get("songText");
    const songType = searchParams.get("songType") as SongTypeTypes | null;
    const praiseTeamName = searchParams.get("praiseTeam");
    const min = parseIntOrNull(searchParams.get("min"));
    const max = parseIntOrNull(searchParams.get("max"));
    const personal = parseBool(searchParams.get("personal"));

    const songsRaw = searchParams.get("songs");
    const songNamesRaw = searchParams.get("songNames");
    const songIds = songsRaw ? songsRaw.split(",").filter(Boolean) : [];
    const songNames = songNamesRaw ? songNamesRaw.split("|") : [];

    // 문자열/숫자 상태 설정
    setSearchTerm(text ?? null);
    setSongSearchTerm(songText ?? null);
    setSelectedPraiseTeam(
      praiseTeamName
        ? (searchContiProperties?.praiseTeams.find(
            (p) => p.praiseTeamName === praiseTeamName
          ) as PraiseTeamDto)
        : null
    );
    setDuration([min ?? MIN_TOTAL_DURATION, max ?? MAX_TOTAL_DURATION]);
    setIncludePersonalConti(personal);

    // 선택된 곡 복원 (표시용 이름까지 있으면 zip)
    if (songIds.length > 0) {
      const restored: SongDetailDto[] = songIds.map((id, i) => ({
        id,
        songName: songNames[i] ?? id, // 이름 없으면 id로 fallback
      })) as any;
      setSelectedSongs(restored);
    } else {
      setSelectedSongs([]);
    }

    setIsRestored(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchContiProperties]);

  // State -> URL
  const serialized = useMemo(() => {
    const params = new URLSearchParams();

    const set = (k: string, v: string | number | null | undefined) => {
      if (v === null || v === undefined || v === "") return;
      params.set(k, String(v));
    };

    set("text", debouncedSearchTerm ?? undefined);
    set("songText", debouncedSongSearchTerm ?? undefined);
    set("praiseTeam", selectedPraiseTeam?.praiseTeamName);

    if (durationChanged) {
      set("min", duration[0]);
      set("max", duration[1]);
    }

    if (includePersonalConti) {
      set("personal", 1);
    }

    if (selectedSongs.length > 0) {
      // ids는 콤마, names는 파이프 구분자 사용
      set("songs", selectedSongs.map((s) => s.id).join(","));
      set("songNames", selectedSongs.map((s) => s.songName ?? "").join("|"));
    }

    return params.toString();
  }, [
    debouncedSearchTerm,
    debouncedSongSearchTerm,
    selectedPraiseTeam,
    duration,
    durationChanged,
    includePersonalConti,
    selectedSongs,
  ]);

  useEffect(() => {
    if (!isRestored) return; // URL 복원 전에는 갱신 금지
    const next = serialized ? `${pathname}?${serialized}` : pathname;
    const current = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    if (next !== current) {
      router.replace(next, { scroll: false });
    }
  }, [serialized, pathname, isRestored, router, searchParams]);

  // -----------------------

  return (
    <>
      <PageTitle title="콘티 보기" description="다양한 찬양팀들의 콘티를 둘러보세요" />

      {searchContiProperties && (
        <ContiSearchFilters
          searchContiProperties={searchContiProperties}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          songSearchTerm={songSearchTerm}
          debouncedSongSearchTerm={debouncedSongSearchTerm}
          selectedSongs={selectedSongs}
          setSelectedSongs={setSelectedSongs}
          setSongSearchTerm={setSongSearchTerm}
          selectedPraiseTeam={selectedPraiseTeam}
          setSelectedPraiseTeam={setSelectedPraiseTeam}
          includePersonalConti={includePersonalConti}
          setIncludePersonalConti={setIncludePersonalConti}
          duration={duration}
          setDuration={setDuration}
        />
      )}

      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <div className="text-red-500 text-center py-8">
              <p>로드 중 오류가 발생했습니다. 다시 시도해주세요.</p>
            </div>
          ) : contis.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">콘티가 없습니다</p>
            </div>
          ) : (
            <>
              {contis.map((conti) => (
                <ContiCard
                  key={conti.id}
                  conti={conti}
                  setModaledConti={setModaledConti}
                  setIsCopyModalOpen={setIsCopyModalOpen}
                />
              ))}

              <div ref={ref} />

              {isFetchingNextPage && (
                <div className="text-center py-4">
                  <LoadingSpinner />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 콘티 복사 모달 */}
      {isCopyModalOpen && (
        <ContiCopyModal
          isOpen={isCopyModalOpen}
          onClose={() => setIsCopyModalOpen(false)}
          conti={modaledConti}
          savedContis={[]}
          onCreateNewConti={() => {}}
          onAddToExistingConti={() => {}}
        />
      )}
    </>
  );
}
