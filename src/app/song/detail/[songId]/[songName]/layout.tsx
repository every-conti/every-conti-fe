import { fetchSongDetail } from "src/app/api/song";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ songId: string; songName: string }>;
}) {
  const { songId } = await params;
  const song = await fetchSongDetail(songId);

  const {
    id,
    songName,
    lyrics,
    youtubeVId,
    songType,
    praiseTeam,
    thumbnail,
    creatorNickname,
    songThemes,
    tempo,
    season,
    songKey,
    duration,
    bible,
    bibleChapter,
    bibleVerse,
  } = song;
  const previewLyrics = lyrics?.replace(/\n/g, "").slice(0, 30);

  return {
    title: `${songName} | ${praiseTeam.praiseTeamName}`,
    description: `${songName} | ${praiseTeam.praiseTeamName}, 에브리콘티에서 ${songName} 찬양의 가사, 주제, 영상 등의 정보를 확인해보세요.`,
    keywords: `${songName}, ${praiseTeam.praiseTeamName},${lyrics ? previewLyrics + "," : ""} 찬양, 콘티, 찬양 검색, 콘티 등록, 찬양팀, 가사, 원키, ${songType},${season ? season.seasonName + "," : ""}${songThemes.map((th) => th.themeName).join(", ")} ${bible ? bible.bibleKoName + " " : ""}${bibleChapter ? bibleChapter + "장 " : ""}${bibleVerse ? bibleVerse + "절" : ""}`,
    openGraph: {
      title: `${songName} | ${praiseTeam.praiseTeamName}`,
      description: `${songName} | ${praiseTeam.praiseTeamName} 찬양, 에브리콘티에서 ${songName} 가사, 주제, 영상 등의 정보를 확인해보세요.`,
      url: `${process.env.NEXT_PUBLIC_FRONT_URL}/song/detail/${id}/${songName}`,
      images: [
        {
          url: thumbnail,
          width: 1200,
          height: 630,
          alt: `${songName} 이미지`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${songName} | ${praiseTeam.praiseTeamName}`,
      description: `${songName} ${praiseTeam}, 에브리콘티에서 ${songName} 찬양의 가사, 주제, 영상 등의 정보를 확인해보세요.`,
      images: thumbnail,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONT_URL}/song/detail/${id}/${songName}`,
    },
  };
}

export default async function SongDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
