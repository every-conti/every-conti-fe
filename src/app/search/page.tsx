"use client";

import { useState } from "react";
import Footer from "src/components/common/footer/Footer";
import SearchFilters from "src/components/search/SearchFilters";
import WorshipSearchCard from "src/components/search/WorshipSearchCard";

export default function SearchDetail() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKey, setSelectedKey] = useState("전체");
  const [selectedGenre, setSelectedGenre] = useState("전체");
  const [selectedArtist, setSelectedArtist] = useState("전체");

  // 샘플 찬양 데이터
  const worshipSongs = [
    {
      title: "주 은혜임을 충만하여",
      artist: "마커스워십",
      key: "G",
      genre: "워십",
      duration: "4:32",
      views: "12.5만회",
      likes: "2.1천개",
      thumbnail:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
    },
    {
      title: "놀라운 은혜",
      artist: "어노인팅",
      key: "A",
      genre: "찬양",
      duration: "5:18",
      views: "8.3만회",
      likes: "1.5천개",
      thumbnail:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop",
    },
    {
      title: "당신은 사랑받기 위해 태어난 사람",
      artist: "어린이부",
      key: "F",
      genre: "어린이찬양",
      duration: "3:49",
      views: "25.1만회",
      likes: "4.2천개",
      thumbnail:
        "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=300&h=200&fit=crop",
    },
    {
      title: "하나님의 사랑",
      artist: "청년부",
      key: "D",
      genre: "CCM",
      duration: "4:12",
      views: "6.7만회",
      likes: "980개",
      thumbnail:
        "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop",
    },
    {
      title: "시편 139편",
      artist: "제이어스",
      key: "C",
      genre: "워십",
      duration: "4:45",
      views: "15.2만회",
      likes: "3.1천개",
      thumbnail:
        "https://images.unsplash.com/photo-1586465012411-3a8adca4b8ec?w=300&h=200&fit=crop",
    },
    {
      title: "Born Again",
      artist: "제이어스",
      key: "G",
      genre: "워십",
      duration: "3:58",
      views: "9.8만회",
      likes: "1.8천개",
      thumbnail:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
    },
    {
      title: "주께서 다스리네",
      artist: "어노인팅",
      key: "C",
      genre: "찬양",
      duration: "4:23",
      views: "11.4만회",
      likes: "2.3천개",
      thumbnail:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=200&fit=crop",
    },
    {
      title: "소원",
      artist: "어노인팅",
      key: "F",
      genre: "워십",
      duration: "5:02",
      views: "7.9만회",
      likes: "1.4천개",
      thumbnail:
        "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=300&h=200&fit=crop",
    },
  ];

  // 필터링 로직
  const filteredSongs = worshipSongs.filter((song) => {
    const matchesSearch =
      searchTerm === "" ||
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesKey = selectedKey === "전체" || song.key === selectedKey;
    const matchesGenre =
      selectedGenre === "전체" || song.genre === selectedGenre;
    const matchesArtist =
      selectedArtist === "전체" || song.artist === selectedArtist;

    return matchesSearch && matchesKey && matchesGenre && matchesArtist;
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
      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedArtist={selectedArtist}
        setSelectedArtist={setSelectedArtist}
      />

      {/* 검색 결과 */}
      <div className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="text-gray-600">
              총 <span className="text-blue-600">{filteredSongs.length}</span>
              개의 찬양을 찾았습니다
            </p>
          </div>

          <div className="space-y-4">
            {filteredSongs.map((song, index) => (
              <WorshipSearchCard
                key={index}
                title={song.title}
                artist={song.artist}
                songKey={song.key}
                genre={song.genre}
                duration={song.duration}
                views={song.views}
                likes={song.likes}
                thumbnail={song.thumbnail}
              />
            ))}
          </div>

          {filteredSongs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">검색 결과가 없습니다</p>
              <p className="text-gray-400">다른 검색어나 필터를 시도해보세요</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
