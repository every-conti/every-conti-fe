import {REVALIDATE_TIME_ONE_DAY} from "src/constant/numbers.constant";
import {fetchContiDetail} from "src/app/api/conti";

export let revalidate: number;
revalidate = REVALIDATE_TIME_ONE_DAY;

export async function generateMetadata({ params }: { params: Promise<{ contiId: string }> }) {
    const {contiId} = await params;
    const conti = await fetchContiDetail(contiId);

    const {id, title, description, date, songs, creatorId, createdAt} = conti;

    return {
        // title: `${songName} | ${praiseTeam.praiseTeamName}`,
        // description: `${songName} | ${praiseTeam.praiseTeamName}, 에브리콘티에서 ${songName} 찬양의 가사, 주제, 영상 등의 정보를 확인해보세요.`,
        // keywords: `${songName}, ${praiseTeam.praiseTeamName},${lyrics ? previewLyrics + "," : ""} 찬양, 콘티, 찬양 검색, 콘티 등록, 찬양팀, 가사, 원키, ${songType},${season ? season.seasonName + "," : ""}${(songThemes.map(th => th.themeName)).join(", ")} ${bible ? bible.bibleKoName + " " : ""}${bibleChapter ? bibleChapter + "장 " : ""}${bibleVerse ? bibleVerse + "절" : ""}`,
        // openGraph: {
        //     title: `${songName} | ${praiseTeam.praiseTeamName}`,
        //     description: `${songName} | ${praiseTeam.praiseTeamName} 찬양, 에브리콘티에서 ${songName} 가사, 주제, 영상 등의 정보를 확인해보세요.`,
        //     url: `${process.env.NEXT_PUBLIC_FRONT_URL}/song/detail/${id}/${songName}`,
        //     images: [
        //         {
        //             url: thumbnail,
        //             width: 1200,
        //             height: 630,
        //             alt: `${songName} 이미지`,
        //         },
        //     ],
        // },
        // twitter: {
        //     card: "summary_large_image",
        //     title: `${songName} | ${praiseTeam.praiseTeamName}`,
        //     description: `${songName} ${praiseTeam}, 에브리콘티에서 ${songName} 찬양의 가사, 주제, 영상 등의 정보를 확인해보세요.`,
        //     images: thumbnail,
        // },
        // alternates: {
        //     canonical: `/every-conti/song/detail/${id}/${songName}`,
        // },
    };
}

export default async function ContiDetailLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}