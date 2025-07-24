"use client";

import { useState } from "react";
import { useSearchPropertiesQuery, useSearchSongQuery } from "src/api/search";
import SearchFilters from "src/components/search/SearchFilters";
import WorshipSearchCard from "src/components/search/WorshipSearchCard";
import PraiseTeamDto from "src/dto/common/praise-team.dto";
import { SongKeyTypes } from "src/types/song/song-key.types";
import { SongTypeTypes } from "src/types/song/song-type.types";

export default function SearchDetail() {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<SongKeyTypes | null>(null);
  const [selectedSongType, setSelectedSongType] =
    useState<SongTypeTypes | null>(null);
  const [selectedPraiseTeam, setSelectedPraiseTeam] =
    useState<PraiseTeamDto | null>(null);

  const {
    data: searchProperties,
    isLoading: isLoadingOptions,
    isError: isErrorOptions,
  } = useSearchPropertiesQuery();
  const {
    data: worshipSongs = [],
    isLoading: isLoadingSongs,
    isError: isErrorSongs,
  } = useSearchSongQuery({
    text: searchTerm === null ? undefined : searchTerm,
    songKey: selectedKey === null ? undefined : selectedKey,
    songType: selectedSongType === null ? undefined : selectedSongType,
    praiseTeamId:
      selectedPraiseTeam === null ? undefined : selectedPraiseTeam.id,
  });

  const [currentPage, setCurrentPage] = useState<string>("search");

  return (
    <>
      <div className="bg-white py-8 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl text-gray-800 mb-2">찬양 검색</h1>
          <p className="text-gray-600">
            원하는 찬양을 키, 장르, 아티스트별로 찾아보세요
          </p>
        </div>
      </div>

      {/* 검색 필터 */}
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
        />
      )}

      {/* 검색 결과 */}
      <div className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-600">
              총 <span className="text-blue-600">{worshipSongs.length}</span>
              개의 찬양을 찾았습니다
            </p>
          </div>

          <div className="space-y-4">
            {worshipSongs.map((song) => (
              <WorshipSearchCard key={song.id} {...song} />
            ))}
          </div>

          {worshipSongs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</p>
              <p className="text-gray-400">다른 검색어나 필터를 시도해보세요</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
