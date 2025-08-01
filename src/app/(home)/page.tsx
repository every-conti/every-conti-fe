import { ChevronRight } from "lucide-react";
import ChurchContentCard from "src/components/home/ChurchContentCard";
import HeroSection from "src/components/home/HeroSection";
import { Button } from "src/components/ui/button";
import NewWorshipCard from "src/components/common/NewWorshipCard";
import { fetchFamousPraiseTeams, fetchLastSongs } from "src/app/api/home";
import FamousContiDto from "src/dto/home/famous-conti.dto";
import SongLastsDto from "src/dto/home/song-lasts.dto";

export default async function App() {
  const famousPraiseTeams: FamousContiDto[] = await fetchFamousPraiseTeams();
  const lastSongs: SongLastsDto[] = await fetchLastSongs();

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
            {famousPraiseTeams.map((content, index) => (
              <ChurchContentCard
                key={index}
                churchName={content.praiseTeam.praiseTeamName}
                date={content.conti.date}
                icon={content.praiseTeam.previewImage}
                songs={content.conti.songs}
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
            {lastSongs.map((song, index) => (
              <NewWorshipCard
                key={index}
                title={song.songName}
                praiseTeam={song.praiseTeam.praiseTeamName}
                duration={song.duration}
                songType={song.songType}
                thumbnail={song.thumbnail}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
