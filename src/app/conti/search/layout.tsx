import logo from "src/assets/logo.png";

export async function generateMetadata() {
  return {
    title: `콘티 검색`,
    description: `콘티 검색 및 필터링 | 에브리콘티에서 유명 찬양팀의 콘티를 찬양팀, 길이 등으로 검색해보세요.`,
    keywords: `콘티 검색, 콘티, 찬양 검색, 찬양, 콘티 등록, 찬양팀, 가사, 원키`,
    openGraph: {
      title: `콘티 검색`,
      description: `콘티 검색 및 필터링 | 에브리콘티에서 유명 찬양팀의 콘티를 찬양팀, 길이 등으로 검색해보세요.`,
      url: `${process.env.NEXT_PUBLIC_FRONT_URL}/conti/search`,
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
      title: `콘티 검색`,
      description: `콘티 검색 및 필터링 | 에브리콘티에서 유명 찬양팀의 콘티를 찬양팀, 길이 등으로 검색해보세요.`,
      images: logo.src,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONT_URL}/conti/search`,
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
