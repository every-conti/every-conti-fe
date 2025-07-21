"use client";

import { ChevronRight } from "lucide-react";
import ChurchContentCard from "src/components/home/ChurchContentCard";
import HeroSection from "src/components/home/HeroSection";
import { Button } from "src/components/ui/button";
import Footer from "src/components/common/footer/Footer";
import NewWorshipCard from "src/components/common/NewWorshipCard";
import { useState } from "react";

export default function App() {
  // 샘플 데이터
  const churchContents = [
    {
      churchName: "마커스워십",
      date: "2024년 5월 26일 주일",
      icon: "🌿",
      songs: [
        { title: "주 은혜임을", key: "G" },
        {
          title: "나는 주 앞에 걸어 가리라 거룩한 곳에서 주와 함께하다",
          key: "A",
        },
        { title: "다시 새롭게", key: "D" },
        { title: "범사를 주께라", key: "G" },
      ],
    },
    {
      churchName: "어노인팅",
      date: "2024년 5월 월 주일",
      icon: "🙏",
      songs: [
        { title: "오늘 이 곳에서 성령님", key: "E" },
        { title: "예수 살아계셔 주", key: "A" },
        { title: "소원", key: "F" },
        { title: "주께서 다스리네", key: "C" },
      ],
    },
    {
      churchName: "제이어스",
      date: "2024년 5월 4주일째",
      icon: "🌱",
      songs: [
        { title: "Born Again", key: "G" },
        { title: "시편 139편", key: "C" },
        { title: "Love Never Fails", key: "D" },
        { title: "내 모든 이끌래", key: "A" },
      ],
    },
  ];

  const newWorship = [
    {
      title: "주 은혜임을 충만하여",
      artist: "마커스워십",
      duration: "4:32",
      views: "12.5만회",
      thumbnail:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
    },
    {
      title: "놀라운 은혜",
      artist: "어노인팅",
      duration: "5:18",
      views: "8.3만회",
      thumbnail:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop",
    },
    {
      title: "당신은 사랑받기 위해 태어난 사람",
      artist: "어린이부",
      duration: "3:49",
      views: "25.1만회",
      thumbnail:
        "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=300&h=200&fit=crop",
    },
    {
      title: "하나님의 사랑",
      artist: "청년부",
      duration: "4:12",
      views: "6.7만회",
      thumbnail:
        "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=300&h=200&fit=crop",
    },
  ];

  const [currentPage, setCurrentPage] = useState<string>("home");

  return (
    <>
      <HeroSection />

      {/* 주요 찬양팀 콘티 섹션 */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-gray-800">주요 찬양팀 콘티</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {churchContents.map((content, index) => (
              <ChurchContentCard
                key={index}
                churchName={content.churchName}
                date={content.date}
                songs={content.songs}
                icon={content.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 새로운 찬양 섹션 */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl text-gray-800">새로운 찬양</h2>
            <Button variant="link" className="text-blue-600">
              전체보기 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newWorship.map((worship, index) => (
              <NewWorshipCard
                key={index}
                title={worship.title}
                artist={worship.artist}
                duration={worship.duration}
                views={worship.views}
                thumbnail={worship.thumbnail}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
