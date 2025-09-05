import { ChevronRight, Music, List, ArrowRight } from "lucide-react";
import Link from "next/link";
import ContiContentCard from "src/components/home/ContiContentCard";
import HeroSection from "src/components/home/HeroSection";
import NewSongCard from "src/components/common/NewSongCard";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import { fetchFamousPraiseTeamsContis, fetchLastSongs } from "src/app/api/home";
import { MinimumSongToPlayDto } from "src/dto/common/minimum-song-to-play.dto";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import {ImageWithFallback} from "src/components/common/ImageWithFallback";
import ContiDemoVideo from "src/components/home/ContiDemoVideo";

export default async function App() {
  let famousContis: ContiWithSongDto[] = [];
  try {
    famousContis = await fetchFamousPraiseTeamsContis();
  } catch {
    famousContis = [];
  }

  let lastSongs: MinimumSongToPlayDto[] = [];
  try {
    lastSongs = await fetchLastSongs();
  } catch {
    lastSongs = [];
  }

  return (
    <>
      <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <HeroSection />

        {/* Demo Videos Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 카카오톡 공유 데모 */}
          <Card className="items-center p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 group">
            <div className="text-center mb-6">
              <h3 className="text-2xl mb-3 text-gray-800">콘티 공유하기</h3>
              <p className="text-gray-600 leading-relaxed">
                우리 교회 찬양팀의 콘티를 등록하고, 공유해보세요.
              </p>
            </div>
            <video width="320" autoPlay muted loop preload="auto" playsInline>
              <source src="https://everycontistorage.blob.core.windows.net/public-assets/sharing-content.mp4" type="video/mp4" />
              <track
                  src="/path/to/captions.vtt"
                  kind="subtitles"
                  srcLang="en"
                  label="English"
              />
              Your browser does not support the video tag.
            </video>
            <Link href="/conti/create" className="mt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3 rounded-full">
                콘티 등록하러 가기 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          {/* 콘티 재생 데모 */}
          <ContiDemoVideo />
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">주요 찬양팀 콘티</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {famousContis.map((content, index) => (
              <ContiContentCard key={content.id} contiWithSongDto={content} />
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
              <NewSongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
