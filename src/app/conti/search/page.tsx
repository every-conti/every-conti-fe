"use client";
import PageTitle from "src/components/common/PageTitle";
import ContiCard from "src/components/conti/ContiCard";
import {useContiPropertiesQuery, useInfiniteSearchContiQuery} from "src/app/api/conti";
import LoadingSpinner from "src/components/common/LoadingSpinner";
import {useInView} from "react-intersection-observer";
import ContiSearchFilters from "src/components/conti/ContiSearchFilters";
import {useState} from "react";
import {useDebounce} from "use-debounce";
import {SongTypeTypes} from "src/types/song/song-type.types";
import PraiseTeamDto from "src/dto/common/praise-team.dto";
import {SongDetailDto} from "src/dto/common/song-detail.dto";
import {
    MAX_TOTAL_DURATION,
    MIN_TOTAL_DURATION
} from "src/constant/conti/conti-search.constant";
import ContiCopyModal from "src/components/conti/ContiCopyModal";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";

export default function ContiFeedPage() {
  const { ref, inView } = useInView({ threshold: 1 });

    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [songSearchTerm, setSongSearchTerm] = useState<string | null>(null);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 400);
    const [debouncedSongSearchTerm] = useDebounce(songSearchTerm, 400);

    const [selectedSongType, setSelectedSongType] =
        useState<SongTypeTypes | null>(null);
    const [selectedPraiseTeam, setSelectedPraiseTeam] =
        useState<PraiseTeamDto | null>(null);
    const [includePersonalConti, setIncludePersonalConti] = useState<boolean>(false);
    const [duration, setDuration] = useState<[number, number]>([MIN_TOTAL_DURATION, MAX_TOTAL_DURATION]);
    const durationChanged = duration[0] !== MIN_TOTAL_DURATION || duration[1] !== MAX_TOTAL_DURATION;

    const [selectedSongs, setSelectedSongs] = useState<SongDetailDto[]>([]);

    const [modaledConti, setModaledConti] = useState<ContiWithSongDto|null>(null);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);

    const { data: searchProperties } = useContiPropertiesQuery();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteSearchContiQuery(
        {
            text: debouncedSearchTerm ?? undefined,
            songType: selectedSongType ?? undefined,
            praiseTeamId: selectedPraiseTeam?.id,
            songIds: selectedSongs ? selectedSongs.map(s => s.id) : undefined,
            minTotalDuration: durationChanged ? duration[0] * 60 : undefined,
            maxTotalDuration:  durationChanged ? duration[1] * 60 : undefined,
            includePersonalConti,
        },
        {
            getNextPageParam: (lastPage: { nextOffset: number | null }) =>
                lastPage.nextOffset ?? undefined,
        }
    );
    const contis = data?.pages.flatMap((page) => page.items) ?? [];


    return (
    <>
      <PageTitle title="콘티 보기" description="다양한 찬양팀들의 콘티를 둘러보세요" />

      {searchProperties && (
          <ContiSearchFilters
            searchProperties={searchProperties}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            songSearchTerm={songSearchTerm}
            debouncedSongSearchTerm={debouncedSongSearchTerm}
            selectedSongs={selectedSongs}
            setSelectedSongs={setSelectedSongs}
            setSongSearchTerm={setSongSearchTerm}
            selectedSongType={selectedSongType}
            setSelectedSongType={setSelectedSongType}
            selectedPraiseTeam={selectedPraiseTeam}
            setSelectedPraiseTeam={setSelectedPraiseTeam}
            includePersonalConti={includePersonalConti}
            setIncludePersonalConti={setIncludePersonalConti}
            duration={duration}
            setDuration={setDuration}
        />)
      }

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
                            <ContiCard key={conti.id} conti={conti} setModaledConti={setModaledConti} setIsCopyModalOpen={setIsCopyModalOpen} />
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
        <ContiCopyModal
            isOpen={isCopyModalOpen}
            onClose={() => setIsCopyModalOpen(false)}
            conti={modaledConti}
            savedContis={[]}
            onCreateNewConti={() => {}}
            onAddToExistingConti={() => {}}
        />
    </>
  );
}
