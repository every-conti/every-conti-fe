import { ChevronRight, Upload, Music, List, ArrowRight } from "lucide-react";
import Link from "next/link";
import ContiContentCard from "src/components/home/ContiContentCard";
import HeroSection from "src/components/home/HeroSection";
import NewSongCard from "src/components/common/NewSongCard";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import {fetchFamousPraiseTeamsContis, fetchLastSongs} from "src/app/api/home";
import FamousContiDto from "src/dto/home/famous-conti.dto";
import {MinimumSongToPlayDto} from "src/dto/common/minimum-song-to-play.dto";

export default async function App() {
  const famousContis: FamousContiDto[] = await fetchFamousPraiseTeamsContis();
  const lastSongs: MinimumSongToPlayDto[] = await fetchLastSongs();

  return (
      <>
        <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <HeroSection />

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <Link href="/conti/create" className="block">
              <Card className="p-6 sm:p-8 hover:shadow-xl transition border hover:border-blue-300 group">
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition">
                    <List className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2">콘티 등록</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    예배에 사용할 콘티를 손쉽게 등록하고 구성할 수 있어요.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3 rounded-full">
                    콘티 만들기 <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </Link>

            <Link href="/song/create" className="block">
              <Card className="p-6 sm:p-8 hover:shadow-xl transition border hover:border-purple-300 group">
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition">
                    <Music className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-2">찬양 등록</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    새로운 찬양을 직접 등록하고 관리해보세요.
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3 rounded-full">
                    찬양 만들기 <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">주요 찬양팀 콘티</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {famousContis.map((content, index) => (
                  <ContiContentCard
                      key={content.conti.id}
                      famousContiDto={content}
                  />
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">새로 등록된 찬양</h2>
              <Link href="/song/search">
                <Button
                    variant="outline"
                    className="mt-2 sm:mt-0 text-sm sm:text-base hover:bg-blue-50 hover:border-blue-300"
                >
                  전체보기 <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {lastSongs.map((song, index) => (
                  <NewSongCard
                      key={song.id}

                      song={song}
                  />
              ))}
            </div>
          </div>
        </section>
      </>
  );
}