import preview from "public/preview.png";

export async function generateMetadata() {
  return {
    title: `에브리콘티`,
    description: `에브리콘티에서 유명 찬양팀의 콘티와 찬양을 검색/등록해보세요.`,
    keywords: `콘티 등록, 콘티, 찬양 등록, 찬양, 찬양 검색, 찬양팀, 가사, 원키`,
    openGraph: {
      title: `에브리콘티`,
      description: `에브리콘티에서 유명 찬양팀의 콘티와 찬양을 검색/등록해보세요.`,
      url: `${process.env.NEXT_PUBLIC_FRONT_URL}`,
      images: [
        {
          url: preview.src,
          width: 1200,
          height: 630,
          alt: `에브리콘티 이미지`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `에브리콘티`,
      description: `에브리콘티에서 유명 찬양팀의 콘티와 찬양을 검색/등록해보세요.`,
      images: preview.src,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_FRONT_URL}`,
    },
  };
}


export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
