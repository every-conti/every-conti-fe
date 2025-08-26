import logo from "src/assets/logo.png";

export async function generateMetadata() {
  return {
    title: `찬양 검색`,
    description: `찬양 검색 및 필터링 | 에브리콘티에서 주제별 찬양 검색, 가사, 주제, 영상 등의 정보를 확인해보세요.`,
    keywords: `찬양 검색, 찬양, 콘티, 콘티 등록, 찬양팀, 가사, 원키`,
    openGraph: {
      title: `찬양 검색`,
      description: `찬양 검색 및 필터링 | 에브리콘티에서 주제별 찬양 검색, 가사, 주제, 영상 등의 정보를 확인해보세요.`,
      url: `${process.env.NEXT_PUBLIC_FRONT_URL}/song/search`,
      images: [
        {
          url: logo.src,
          width: 1200,
          height: 630,
          alt: `에브리콘티 이미지`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `찬양 검색`,
      description: `찬양 검색 및 필터링 | 에브리콘티에서 주제별 찬양 검색, 가사, 주제, 영상 등의 정보를 확인해보세요.`,
      images: logo.src,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONT_URL}/song/search`,
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
