"use client";

import { useEffect, useState } from "react";
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
import { SongTypeTypes } from "src/types/song/song-type.types";

export default function SearchDetail() {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 400);
  const [selectedKey, setSelectedKey] = useState<SongKeyTypes | null>(null);
  const [selectedSongType, setSelectedSongType] =
    useState<SongTypeTypes | null>(null);
  const [selectedPraiseTeam, setSelectedPraiseTeam] =
    useState<PraiseTeamDto | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<SongThemeDto[]>([]);
  const [selectedTempo, setSelectedTempo] = useState<SongTempoTypes | null>(
    null
  );
  const [selectedSeason, setSelectedSeason] = useState<SongSeasonDto | null>(
    null
  );
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedBible, setSelectedBible] = useState<BibleDto | null>(null);
  const [selectedBibleChapter, setSelectedBibleChapter] =
    useState<BibleChapterDto | null>(null);
  const [selectedBibleVerse, setSelectedBibleVerse] =
    useState<BibleVerseDto | null>(null);

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
      duration: selectedDuration ?? undefined,
      bibleId: selectedBible?.id,
      bibleChapterId: selectedBibleChapter?.id,
      bibleVerseId: selectedBibleVerse?.id,
      songKey: selectedKey ?? undefined,
      themeIds:
        selectedThemes.length === 0 ? [] : selectedThemes.map((t) => t.id),
    },
    {
      getNextPageParam: (lastPage: { nextOffset: number | null }) =>
        lastPage.nextOffset ?? undefined,
    }
  );

  const { ref, inView } = useInView({ threshold: 1 });

  const songs = data?.pages.flatMap((page) => page.items) ?? [];

  // fetch next page when last item is in view
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <>
      <div className="bg-white py-8 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl text-gray-800 mb-2">찬양 검색</h1>
          <p className="text-gray-600">
            원하는 찬양을 키, 장르, 찬양팀별로 찾아보세요
          </p>
        </div>
      </div>

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
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}
          selectedBible={selectedBible}
          setSelectedBible={setSelectedBible}
          selectedBibleChapter={selectedBibleChapter}
          setSelectedBibleChapter={setSelectedBibleChapter}
          selectedBibleVerse={selectedBibleVerse}
          setSelectedBibleVerse={setSelectedBibleVerse}
        />
      )}

      <div className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* <div className="mb-6">
            <p className="text-gray-600">
              총 <span className="text-blue-600">{songs.length}</span>개의
              찬양을 찾았습니다
            </p>
          </div> */}

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
