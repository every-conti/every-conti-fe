"use client";
import PageTitle from "src/components/common/PageTitle";
import ContiCard from "src/components/conti/ContiCard";
import {useInfiniteSearchContiQuery} from "src/app/api/conti";

export default function ContiFeedPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteSearchContiQuery(
      {},
      {
        getNextPageParam: (lastPage: { nextOffset: number | null }) =>
            lastPage.nextOffset ?? undefined,
      }
  );

  const contis = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <>
      <PageTitle title="콘티 보기" description="다양한 찬양팀들의 콘티를 둘러보세요" />

      <div className="max-w-4xl mx-auto py-8 px-6">
        {/*<Tabs defaultValue="popular" className="w-full">*/}
        {/*  <TabsList className="grid w-full grid-cols-2 mb-8">*/}
        {/*    <TabsTrigger value="popular">인기 콘티</TabsTrigger>*/}
        {/*    <TabsTrigger value="following">팔로잉</TabsTrigger>*/}
        {/*  </TabsList>*/}

          {/*<TabsContent value="popular" className="space-y-6">*/}
          {/*  <div className="mb-6">*/}
          {/*    <h2 className="text-xl mb-2">인기 콘티</h2>*/}
          {/*    <p className="text-gray-600">*/}
          {/*      유명 찬양팀과 교회들의 인기 콘티를 확인해보세요*/}
          {/*    </p>*/}
          {/*  </div>*/}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contis.map((conti) => (
                <ContiCard key={conti.conti.id} conti={conti} />
              ))}
            </div>
          {/*</TabsContent>*/}

        {/*  <TabsContent value="following" className="space-y-6">*/}
        {/*    <div className="mb-6">*/}
        {/*      <h2 className="text-xl mb-2">팔로잉</h2>*/}
        {/*      <p className="text-gray-600">*/}
        {/*        팔로우하는 사용자들의 최신 콘티를 확인해보세요*/}
        {/*      </p>*/}
        {/*    </div>*/}

        {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">*/}
        {/*      {followingContis.length > 0 ? (*/}
        {/*        followingContis.map((conti) => (*/}
        {/*          <ContiCard key={conti.id} conti={conti} />*/}
        {/*        ))*/}
        {/*      ) : (*/}
        {/*        <div className="text-center py-12">*/}
        {/*          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />*/}
        {/*          <h3 className="text-lg text-gray-500 mb-2">*/}
        {/*            팔로우하는 사용자가 없습니다*/}
        {/*          </h3>*/}
        {/*          <p className="text-gray-400">*/}
        {/*            마음에 드는 사용자를 팔로우해보세요*/}
        {/*          </p>*/}
        {/*        </div>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  </TabsContent>*/}
        {/*</Tabs>*/}
      </div>
    </>
  );
}
