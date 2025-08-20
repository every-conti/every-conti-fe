"use client";

import {useEffect, useMemo, useState} from "react";
import { useDebounce } from "use-debounce";
import { useInView } from "react-intersection-observer";
import {
  useSongPropertiesQuery,
  useInfiniteSearchSongQuery,
} from "src/app/api/song";
import LoadingSpinner from "src/components/common/LoadingSpinner";
import SearchFilters from "src/components/song/search/SearchFilters";
import WorshipSearchCard from "src/components/song/search/WorshipSearchCard";
import BibleChapterDto from "src/dto/common/bible-chapter.dto";
import BibleVerseDto from "src/dto/common/bible-verse.dto";
import BibleDto from "src/dto/common/bible.dto";
import PraiseTeamDto from "src/dto/common/praise-team.dto";
import SongSeasonDto from "src/dto/common/song-season.dto";
import SongThemeDto from "src/dto/common/song-theme.dto";
import { SongKeyTypes } from "src/types/song/song-key.types";
import { SongTempoTypes } from "src/types/song/song-tempo.types";
import { SongTypeTypes} from "src/types/song/song-type.types";
import PageTitle from "src/components/common/PageTitle";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {MIN_SONG_DURATION, MAX_SONG_DURATION} from "src/constant/conti/conti-search.constant";


export default function SearchDetail() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);
  const [selectedKey, setSelectedKey] = useState<SongKeyTypes | null>(null);
  const [selectedSongType, setSelectedSongType] =
    useState<SongTypeTypes | null>(null);
  const [selectedPraiseTeam, setSelectedPraiseTeam] =
    useState<PraiseTeamDto | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<SongThemeDto[]>([]);
    const [duration, setDuration] = useState<[number, number]>([MIN_SONG_DURATION, MAX_SONG_DURATION]);
    const [selectedTempo, setSelectedTempo] = useState<SongTempoTypes | null>(
    null
  );
    const durationChanged = duration[0] !== MIN_SONG_DURATION || duration[1] !== MAX_SONG_DURATION;
  const [selectedSeason, setSelectedSeason] = useState<SongSeasonDto | null>(
    null
  );
  const [selectedBible, setSelectedBible] = useState<BibleDto | null>(null);
  const [selectedBibleChapter, setSelectedBibleChapter] =
    useState<BibleChapterDto | null>(null);
  const [selectedBibleVerse, setSelectedBibleVerse] =
    useState<BibleVerseDto | null>(null);

    const [chapters, setChapters] = useState<BibleChapterDto[]>([]);
    const [verses, setVerses] = useState<BibleVerseDto[]>([]);

  const { data: searchProperties } = useSongPropertiesQuery();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteSearchSongQuery(
    {
      text: debouncedSearchTerm ?? undefined,
      songType: selectedSongType ?? undefined,
      praiseTeamId: selectedPraiseTeam?.id,
      tempo: selectedTempo ?? undefined,
      seasonId: selectedSeason?.id,
      minDuration: durationChanged ? duration[0] * 60 : undefined,
      maxDuration: durationChanged ? duration[1] * 60 : undefined,
      bibleId: selectedBible?.id,
      bibleChapterId: selectedBibleChapter?.id,
      bibleVerseId: selectedBibleVerse?.id,
      songKey: selectedKey ?? undefined,
      themeIds:
        selectedThemes.length === 0 ? undefined : selectedThemes.map((t) => t.id),
    },
    {
      getNextPageParam: (lastPage: { nextOffset: number | null }) =>
        lastPage.nextOffset ?? undefined,
    }
  );

  const { ref, inView } = useInView({ threshold: 1 });

  const songs = data?.pages.flatMap((page) => page.items) ?? [];
    const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

    const parseIntOrNull = (v?: string | null) =>
        v != null && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : null;

    // URL -> State (첫 마운트 + 브라우저 뒤/앞 이동)
    useEffect(() => {
        if (!searchProperties) return;

        // searchParams는 읽기 전용 스냅샷이라 매번 새로 읽어와야 함
        const text = searchParams.get("text");
        const songType = searchParams.get("songType") as SongTypeTypes | null;
        const tempo = searchParams.get("tempo") as SongTempoTypes | null;
        const songKey = searchParams.get("songKey") as SongKeyTypes | null;

        const praiseTeam = searchParams.get("praiseTeam");
        const season = searchParams.get("season");
        const minDuration = parseIntOrNull(searchParams.get("min"));
        const maxDuration = parseIntOrNull(searchParams.get("max"));
        const bible = searchParams.get("bible");
        const chapter = parseIntOrNull(searchParams.get("chapter"));
        const verse = parseIntOrNull(searchParams.get("verse"));

        const themeIdsRaw = searchParams.get("themes");
        const themeIds = themeIdsRaw
            ? themeIdsRaw
                .split(",")
            : [];


        // 문자열들은 그대로, 숫자 id들은 필요한 최소 필드만 세팅
        setSearchTerm(text ?? null);
        setSelectedSongType(songType ? songType : null);
        setSelectedTempo(tempo ?? null);
        setSelectedKey(songKey ?? null);

        setSelectedPraiseTeam(
            praiseTeam ? ( searchProperties?.praiseTeams.find(t => t.praiseTeamName === praiseTeam) as PraiseTeamDto) : null
        );
        setSelectedSeason(season ? (searchProperties?.seasons.find(s => s.seasonName === season) as SongSeasonDto) : null);
        setDuration([minDuration ?? MIN_SONG_DURATION, maxDuration ?? MAX_SONG_DURATION]);

        setSelectedBible(bible ? (searchProperties?.bibles.find(b => b.bibleKoName === bible) as BibleDto) : null);
        setSelectedBibleChapter(
            chapters ? chapters.find(ch => ch.chapterNum === chapter) as BibleChapterDto : null
        );
        setSelectedBibleVerse(
            verses ? verses.find(v => v.verseNum === verse) as BibleVerseDto : null
        );

        setSelectedThemes(
            themeIds.length > 0
                ? searchProperties?.songThemes.filter((th) =>
                themeIds.includes(String(th.themeName))
            ) ?? []
                : []
        );

        setIsRestored(true);
    }, [searchProperties, chapters, verses]);

    // State -> URL
    const serialized = useMemo(() => {
        const params = new URLSearchParams();

        const set = (k: string, v: string | number | null | undefined) => {
            if (v === null || v === undefined || v === "") return;
            params.set(k, String(v));
        };

        set("text", debouncedSearchTerm ?? undefined);
        set("songType", selectedSongType ?? undefined);
        set("tempo", selectedTempo ?? undefined);
        set("songKey", selectedKey ?? undefined);
        set("praiseTeam", selectedPraiseTeam?.praiseTeamName);
        set("season", selectedSeason?.seasonName);
        set("min", duration[0] ?? undefined);
        set("max", duration[1] ?? undefined);
        set("bible", selectedBible?.bibleKoName);
        set("chapter", selectedBibleChapter?.chapterNum);
        set("verse", selectedBibleVerse?.verseNum);

        if (selectedThemes.length > 0) {
            set("themes", selectedThemes.map((th) => th.themeName).join(","));
        }

        return params.toString();
    }, [
        debouncedSearchTerm,
        selectedSongType,
        selectedTempo,
        selectedKey,
        selectedPraiseTeam,
        selectedSeason,
        duration,
        selectedBible,
        selectedBibleChapter,
        selectedBibleVerse,
        selectedThemes,
    ]);

    useEffect(() => {
        if (!isRestored) return; // 최초 복원 전에는 URL 갱신 안 함
        const next = serialized ? `${pathname}?${serialized}` : pathname;
        const current = searchParams.toString()
            ? `${pathname}?${searchParams.toString()}`
            : pathname;
        if (next !== current) {
            router.replace(next, { scroll: false });
        }
    }, [serialized, pathname, isRestored]);

  return (
    <>
        <PageTitle title="찬양 검색" description="원하는 찬양을 필터를 통해 찬양팀, 장르, 주제 별로 찾아보세요" />

      {searchProperties && (
        <SearchFilters
          searchProperties={searchProperties}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          selectedSongType={selectedSongType}
          setSelectedSongType={setSelectedSongType}
          selectedPraiseTeam={selectedPraiseTeam}
          setSelectedPraiseTeam={setSelectedPraiseTeam}
          selectedThemes={selectedThemes}
          setSelectedThemes={setSelectedThemes}
          selectedTempo={selectedTempo}
          setSelectedTempo={setSelectedTempo}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          duration={duration}
          setDuration={setDuration}
          selectedBible={selectedBible}
          setSelectedBible={setSelectedBible}
          selectedBibleChapter={selectedBibleChapter}
          setSelectedBibleChapter={setSelectedBibleChapter}
          selectedBibleVerse={selectedBibleVerse}
          setSelectedBibleVerse={setSelectedBibleVerse}
          chapters={chapters}
          setChapters={setChapters}
          verses={verses}
          setVerses={setVerses}
        />
      )}

      <div className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <div className="text-red-500 text-center py-8">
              <p>검색 중 오류가 발생했습니다. 다시 시도해주세요.</p>
            </div>
          ) : songs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</p>
              <p className="text-gray-400">다른 검색어나 필터를 시도해보세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              {songs.map((song, idx) => (
                <div key={song.id}>
                  <WorshipSearchCard {...song} />
                </div>
              ))}

              <div ref={ref} />

              {isFetchingNextPage && (
                <div className="text-center py-4">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
