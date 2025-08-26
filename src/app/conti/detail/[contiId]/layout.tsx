import { REVALIDATE_TIME_ONE_DAY } from "src/constant/numbers.constant";
import { fetchContiDetail } from "src/app/api/conti/conti";
import logo from "src/assets/logo.png";

export async function generateMetadata({ params }: { params: Promise<{ contiId: string }> }) {
  const { contiId } = await params;
  const conti = await fetchContiDetail(contiId);

  const { id, title, description, date, songs, creator, createdAt } = conti;

  return {
    title: `${title}${creator?.praiseTeam ? " | " + creator.praiseTeam.praiseTeamName : ""}`,
    description: `${title}${creator?.praiseTeam ? " | " + creator.praiseTeam.praiseTeamName : ""}, 에브리콘티에서 ${title} 콘티의 곡, 설명 정보를 확인하고 들어보세요.`,
    keywords: `${title}, ${songs.map((s) => s.song.songName).join(", ")}${creator?.praiseTeam ? +", " + creator.praiseTeam.praiseTeamName : ""}, 콘티, 콘티 등록, 콘티 복사, 콘티 검색, 찬양, 찬양 검색, 콘티 등록, 찬양팀, 가사, 원키}`,
    openGraph: {
      title: `${title}${creator?.praiseTeam ? " | " + creator.praiseTeam.praiseTeamName : ""}`,
      description: `${title}${creator?.praiseTeam ? " | " + creator.praiseTeam.praiseTeamName : ""} 찬양, 에브리콘티에서 ${title} 가사, 주제, 영상 등의 정보를 확인해보세요.`,
      url: `${process.env.NEXT_PUBLIC_FRONT_URL}/conti/detail/${id}`,
      images: [
        {
          url: songs[0] ? songs[0].song.thumbnail : logo.src,
          width: 1200,
          height: 630,
          alt: `${title} 이미지`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}${creator?.praiseTeam ? " | " + creator.praiseTeam.praiseTeamName : ""}`,
      description: `${title}${creator?.praiseTeam ? " | " + creator.praiseTeam.praiseTeamName : ""} 찬양, 에브리콘티에서 ${title} 가사, 주제, 영상 등의 정보를 확인해보세요.`,
      images: songs[0] ? songs[0].song.thumbnail : logo.src,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONT_URL}/conti/detail/${id}`,
    },
  };
}

export default async function ContiDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
