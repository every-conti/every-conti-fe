"use client";

import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          콘티 생성, 찬양 검색 플랫폼
        </h1>
        <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto">
          다른 찬양팀 콘티 확인, 예배 콘티 등록, 찬양 검색과 등록까지 한 곳에서
        </p>

        <div className="max-w-2xl mx-auto">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="찬양 제목이나 가사로 검색하세요..."
                className="pl-10 py-2 sm:py-3 text-sm sm:text-base"
              />
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 px-4 sm:px-6 text-sm sm:text-base"
              onClick={() => {
                router.push(`/song/search${searchText && `?text=${searchText}`}`);
              }}
            >
              검색
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
