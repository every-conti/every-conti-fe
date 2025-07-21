"use client";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tab";
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Calendar,
  Clock,
  Users,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { ImageWithFallback } from "src/components/common/ImageWithFallback";
import { Card } from "@radix-ui/themes";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";

interface ContiItem {
  id: string;
  title: string;
  author: string;
  authorImage: string;
  date: string;
  description: string;
  songs: Array<{
    title: string;
    artist: string;
    key: string;
    duration: string;
  }>;
  likes: number;
  comments: number;
  isFollowing: boolean;
  thumbnail: string;
}

export default function ContiFeedPage() {
  const [followingUsers, setFollowingUsers] = useState<string[]>([
    "워십리더김",
    "찬양팀장박",
  ]);

  // 샘플 콘티 데이터
  const popularContis: ContiItem[] = [
    {
      id: "1",
      title: "2024년 12월 첫째 주 주일예배",
      author: "마커스워십",
      authorImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      date: "2024-12-01",
      description:
        "새로운 시작을 맞이하는 12월 첫 주일을 위한 특별한 콘티입니다.",
      songs: [
        {
          title: "주 은혜임을",
          artist: "마커스워십",
          key: "G",
          duration: "4:32",
        },
        {
          title: "거룩한 곳에서",
          artist: "마커스워십",
          key: "A",
          duration: "5:18",
        },
        {
          title: "다시 새롭게",
          artist: "마커스워십",
          key: "D",
          duration: "3:49",
        },
        {
          title: "범사를 주께로",
          artist: "마커스워십",
          key: "G",
          duration: "4:12",
        },
      ],
      likes: 124,
      comments: 18,
      isFollowing: true,
      thumbnail:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      title: "어드벤트 시즌 특별 콘티",
      author: "어노인팅",
      authorImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      date: "2024-11-28",
      description:
        "성탄절을 준비하는 어드벤트 시즌을 위한 은혜로운 찬양들로 구성했습니다.",
      songs: [
        {
          title: "오늘 이 곳에서",
          artist: "어노인팅",
          key: "E",
          duration: "4:45",
        },
        {
          title: "예수 살아계셔",
          artist: "어노인팅",
          key: "A",
          duration: "3:58",
        },
        { title: "소원", artist: "어노인팅", key: "F", duration: "5:02" },
        {
          title: "주께서 다스리네",
          artist: "어노인팅",
          key: "C",
          duration: "4:23",
        },
      ],
      likes: 89,
      comments: 12,
      isFollowing: true,
      thumbnail:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      title: "청년부 금요기도회",
      author: "제이어스",
      authorImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1ad?w=100&h=100&fit=crop&crop=face",
      date: "2024-11-29",
      description: "청년들과 함께 드리는 깊은 예배를 위한 콘티입니다.",
      songs: [
        { title: "Born Again", artist: "제이어스", key: "G", duration: "3:58" },
        { title: "시편 139편", artist: "제이어스", key: "C", duration: "4:45" },
        {
          title: "Love Never Fails",
          artist: "제이어스",
          key: "D",
          duration: "4:12",
        },
      ],
      likes: 67,
      comments: 8,
      isFollowing: false,
      thumbnail:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    },
  ];

  const followingContis: ContiItem[] = [
    {
      id: "4",
      title: "새벽기도 콘티",
      author: "워십리더김",
      authorImage:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      date: "2024-12-02",
      description: "새벽의 고요함 속에서 드리는 개인적인 예배시간을 위해",
      songs: [
        { title: "주님만이", artist: "개인창작", key: "Am", duration: "4:20" },
        { title: "고요한 중에", artist: "CCM", key: "D", duration: "3:45" },
        { title: "나의 영혼아", artist: "찬송가", key: "G", duration: "3:30" },
      ],
      likes: 23,
      comments: 5,
      isFollowing: true,
      thumbnail:
        "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=400&h=300&fit=crop",
    },
    {
      id: "5",
      title: "소그룹 모임 찬양",
      author: "찬양팀장박",
      authorImage:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      date: "2024-12-01",
      description: "친밀한 소그룹 모임에서 함께 부르기 좋은 찬양들",
      songs: [
        {
          title: "함께 하신다",
          artist: "소그룹찬양",
          key: "F",
          duration: "3:15",
        },
        {
          title: "서로 사랑",
          artist: "소그룹찬양",
          key: "C",
          duration: "4:00",
        },
        {
          title: "한마음 한뜻",
          artist: "소그룹찬양",
          key: "G",
          duration: "3:40",
        },
      ],
      likes: 34,
      comments: 7,
      isFollowing: true,
      thumbnail:
        "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&h=300&fit=crop",
    },
  ];

  const toggleFollow = (author: string) => {
    setFollowingUsers((prev) =>
      prev.includes(author)
        ? prev.filter((user) => user !== author)
        : [...prev, author]
    );
  };

  const ContiCard = ({ conti }: { conti: ContiItem }) => {
    const totalDuration = conti.songs.reduce((total, song) => {
      const [minutes, seconds] = song.duration.split(":").map(Number);
      return total + minutes * 60 + seconds;
    }, 0);

    const formatTotalDuration = (totalSeconds: number) => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ImageWithFallback
              src={conti.authorImage}
              alt={conti.author}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-base">{conti.author}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{conti.date}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!followingUsers.includes(conti.author) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleFollow(conti.author)}
              >
                <Plus className="w-3 h-3 mr-1" />
                팔로우
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 콘티 정보 */}
        <div className="mb-4">
          <h2 className="text-lg mb-2">{conti.title}</h2>
          <p className="text-gray-600 text-sm mb-3">{conti.description}</p>

          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{conti.songs.length}곡</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatTotalDuration(totalDuration)}</span>
            </div>
          </div>
        </div>

        {/* 썸네일 */}
        <div className="relative mb-4">
          <ImageWithFallback
            src={conti.thumbnail}
            alt={conti.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-800 ml-1" />
            </div>
          </div>
        </div>

        {/* 곡 목록 */}
        <div className="mb-4">
          <h4 className="text-sm mb-2 text-gray-700">수록곡</h4>
          <div className="space-y-2">
            {conti.songs.slice(0, 3).map((song, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 w-4">{index + 1}.</span>
                  <span>{song.title}</span>
                  <span className="text-gray-500">- {song.artist}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {song.key}
                  </Badge>
                  <span className="text-gray-400 text-xs">{song.duration}</span>
                </div>
              </div>
            ))}
            {conti.songs.length > 3 && (
              <p className="text-xs text-gray-500">
                외 {conti.songs.length - 3}곡
              </p>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Heart className="w-4 h-4 mr-1" />
              {conti.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <MessageCircle className="w-4 h-4 mr-1" />
              {conti.comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600">
              <Share2 className="w-4 h-4 mr-1" />
              공유
            </Button>
          </div>

          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            콘티 사용하기
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="popular">인기 콘티</TabsTrigger>
          <TabsTrigger value="following">팔로잉</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl mb-2">인기 콘티</h2>
            <p className="text-gray-600">
              유명 찬양팀과 교회들의 인기 콘티를 확인해보세요
            </p>
          </div>

          {popularContis.map((conti) => (
            <ContiCard key={conti.id} conti={conti} />
          ))}
        </TabsContent>

        <TabsContent value="following" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-xl mb-2">팔로잉</h2>
            <p className="text-gray-600">
              팔로우하는 사용자들의 최신 콘티를 확인해보세요
            </p>
          </div>

          {followingContis.length > 0 ? (
            followingContis.map((conti) => (
              <ContiCard key={conti.id} conti={conti} />
            ))
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg text-gray-500 mb-2">
                팔로우하는 사용자가 없습니다
              </h3>
              <p className="text-gray-400">
                마음에 드는 사용자를 팔로우해보세요
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
