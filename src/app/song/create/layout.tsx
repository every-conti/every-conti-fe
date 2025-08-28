import logo from "src/assets/logo.png";

export async function generateMetadata() {
  return {
    title: `찬양 등록`,
    description: `에브리콘티에서 좋아하는 찬양을 youtube와 AI를 활용해 간단히 등록해보세요.`,
    keywords: `찬양 등록, 찬양, youtube, Youtube, ai, AI, 콘티, 찬양 검색, 콘티 등록, 찬양팀, 가사, 원키`,
    openGraph: {
      title: `찬양 등록`,
      description: `에브리콘티에서 좋아하는 찬양을 youtube와 AI를 활용해 간단히 등록해보세요.`,
      url: `${process.env.NEXT_PUBLIC_FRONT_URL}/song/create`,
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
      title: `찬양 등록`,
      description: `에브리콘티에서 좋아하는 찬양을 youtube와 AI를 활용해 간단히 등록해보세요.`,
      images: logo.src,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONT_URL}/song/create`,
    },
  };
}

export default async function SongCreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
