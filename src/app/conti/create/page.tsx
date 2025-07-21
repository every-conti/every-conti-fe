"use client";
import { useState } from "react";
import {
  Search,
  Plus,
  GripVertical,
  Trash2,
  Calendar,
  Save,
  Eye,
} from "lucide-react";
import { Card } from "src/components/ui/card";
import { Label } from "src/components/ui/label";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { ImageWithFallback } from "src/components/common/ImageWithFallback";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";

interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  genre: string;
  duration: string;
  thumbnail: string;
}

interface ContiSong extends Song {
  order: number;
}

interface ContiCreationPageProps {
  worshipSongs: Song[];
  currentConti: ContiSong[];
  setCurrentConti: (conti: ContiSong[]) => void;
}

const worshipSongs: Song[] = [
  {
    id: "1",
    title: "주 은혜임을 충만하여",
    artist: "마커스워십",
    key: "G",
    genre: "워십",
    duration: "4:32",
    //   views: "12.5만회",
    //   likes: "2.1천개",
    thumbnail:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
  },
  {
    id: "2",
    title: "놀라운 은혜",
    artist: "어노인팅",
    key: "A",
    genre: "찬양",
    duration: "5:18",
    //   views: "8.3만회",
    //   likes: "1.5천개",
    thumbnail:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop",
  },
  {
    id: "3",
    title: "당신은 사랑받기 위해 태어난 사람",
    artist: "어린이부",
    key: "F",
    genre: "어린이찬양",
    duration: "3:49",
    //   views: "25.1만회",
    //   likes: "4.2천개",
    thumbnail:
      "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=300&h=200&fit=crop",
  },
  {
    id: "4",
    title: "하나님의 사랑",
    artist: "청년부",
    key: "D",
    genre: "CCM",
    duration: "4:12",
    //   views: "6.7만회",
    //   likes: "980개",
    thumbnail:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop",
  },
  {
    id: "5",
    title: "시편 139편",
    artist: "제이어스",
    key: "C",
    genre: "워십",
    duration: "4:45",
    //   views: "15.2만회",
    //   likes: "3.1천개",
    thumbnail:
      "https://images.unsplash.com/photo-1586465012411-3a8adca4b8ec?w=300&h=200&fit=crop",
  },
  {
    id: "6",
    title: "Born Again",
    artist: "제이어스",
    key: "G",
    genre: "워십",
    duration: "3:58",
    //   views: "9.8만회",
    //   likes: "1.8천개",
    thumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
  },
  {
    id: "7",
    title: "주께서 다스리네",
    artist: "어노인팅",
    key: "C",
    genre: "찬양",
    duration: "4:23",
    //   views: "11.4만회",
    //   likes: "2.3천개",
    thumbnail:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=200&fit=crop",
  },
  {
    id: "8",
    title: "소원",
    artist: "어노인팅",
    key: "F",
    genre: "워십",
    duration: "5:02",
    //   views: "7.9만회",
    //   likes: "1.4천개",
    thumbnail:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=300&h=200&fit=crop",
  },
];

export default function ContiCreationPage() {
  const [contiTitle, setContiTitle] = useState("");
  const [contiDate, setContiDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [contiDescription, setContiDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const [currentConti, setCurrentConti] = useState<ContiSong[]>([]);

  // 검색 결과 필터링
  const searchResults = worshipSongs.filter(
    (song) =>
      searchTerm &&
      (song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 찬양 추가
  const addSongToConti = (song: Song) => {
    const isAlreadyAdded = currentConti.some((s) => s.id === song.id);
    if (!isAlreadyAdded) {
      const newSong: ContiSong = {
        ...song,
        order: currentConti.length,
      };
      setCurrentConti([...currentConti, newSong]);
      //   toast.success(`"${song.title}"이(가) 콘티에 추가되었습니다.`);
    } else {
      //   toast.info("이미 콘티에 추가된 곡입니다.");
    }
    // setSearchTerm("");
    // setShowSearchResults(false);
  };

  // 찬양 제거
  const removeSongFromConti = (songId: string) => {
    const updatedSongs = currentConti
      .filter((song) => song.id !== songId)
      .map((song, index) => ({ ...song, order: index }));
    setCurrentConti(updatedSongs);
    // toast.success("콘티에서 곡이 제거되었습니다.");
  };

  // 순서 변경
  const moveSong = (dragIndex: number, hoverIndex: number) => {
    const updatedSongs = [...currentConti];
    const draggedSong = updatedSongs[dragIndex];
    updatedSongs.splice(dragIndex, 1);
    updatedSongs.splice(hoverIndex, 0, draggedSong);

    // 순서 업데이트
    const reorderedSongs = updatedSongs.map((song, index) => ({
      ...song,
      order: index,
    }));

    setCurrentConti(reorderedSongs);
  };

  // 총 시간 계산
  const totalDuration = currentConti.reduce((total, song) => {
    const [minutes, seconds] = song.duration.split(":").map(Number);
    return total + minutes * 60 + seconds;
  }, 0);

  const formatTotalDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    if (!contiTitle.trim()) {
      //   toast.error("콘티 제목을 입력해주세요.");
      return;
    }

    if (currentConti.length === 0) {
      //   toast.error("최소 1곡 이상 추가해주세요.");
      return;
    }

    console.log("콘티 저장:", {
      title: contiTitle,
      date: contiDate,
      description: contiDescription,
      songs: currentConti,
    });
    // toast.success("콘티가 저장되었습니다!");
  };

  const handleClearConti = () => {
    setCurrentConti([]);
    setContiTitle("");
    setContiDate("");
    setContiDescription("");
    // toast.success("콘티가 초기화되었습니다.");
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 콘티 정보 및 검색 */}
        <div className="space-y-6">
          {/* 콘티 기본 정보 */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">콘티 정보</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">콘티 제목</Label>
                <Input
                  id="title"
                  placeholder="예: 2025년 1월 1일 주일예배"
                  value={contiTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setContiTitle(e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="date">날짜</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="date"
                    type="date"
                    value={contiDate}
                    // onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContiDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">설명 (선택사항)</Label>
                <Textarea
                  id="description"
                  placeholder="콘티에 대한 추가 정보나 특별한 메모를 입력하세요"
                  value={contiDescription}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setContiDescription(e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* 찬양 검색 */}
          <Card className="p-6">
            <h2 className="text-xl mb-4">찬양 검색 및 추가</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="찬양 제목으로 검색하세요"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                className="pl-10"
              />
            </div>

            {/* 검색 결과 */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="mt-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {searchResults.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 flex-shrink-0">
                          <ImageWithFallback
                            src={song.thumbnail}
                            alt={song.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <p className="text-sm line-clamp-1">{song.title}</p>
                          <p className="text-xs text-gray-600">{song.artist}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {song.key} Key
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {song.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addSongToConti(song)}
                        disabled={currentConti.some((s) => s.id === song.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showSearchResults && searchResults.length === 0 && searchTerm && (
              <div className="mt-4 p-4 text-center text-gray-500">
                검색 결과가 없습니다
                <div className="text-sm mt-2">
                  원하시는 곡이 없나요? 콘티를 만든 후에 나중에 추가해도 돼요!
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* 오른쪽: 선택된 콘티 */}
        <div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">선택된 찬양 목록</h2>
              <div className="text-sm text-gray-600">
                총 {currentConti.length}곡 •{" "}
                {formatTotalDuration(totalDuration)}
              </div>
            </div>

            {currentConti.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-2">아직 선택된 찬양이 없습니다</p>
                <p className="text-sm">왼쪽에서 찬양을 검색하고 추가하거나</p>
                <p className="text-sm">검색 페이지에서 찬양을 추가해보세요</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentConti.map((song, index) => (
                  <div
                    key={song.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg group"
                  >
                    <div className="cursor-move">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>

                    <div className="text-sm text-gray-600 w-6">
                      {index + 1}.
                    </div>

                    <div className="w-10 h-10 flex-shrink-0">
                      <ImageWithFallback
                        src={song.thumbnail}
                        alt={song.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm line-clamp-1">{song.title}</p>
                      <p className="text-xs text-gray-600">{song.artist}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {song.key}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {song.duration}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSongFromConti(song.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={!contiTitle || currentConti.length === 0}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                콘티 저장
              </Button>

              {/* <Button variant="outline" disabled={currentConti.length === 0}>
                <Eye className="w-4 h-4 mr-2" />
                미리보기
              </Button> */}

              <Button
                variant="outline"
                onClick={handleClearConti}
                disabled={currentConti.length === 0}
                className="text-red-600 hover:text-red-700"
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
