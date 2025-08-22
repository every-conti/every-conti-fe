"use client";

import {useEffect, useState} from "react";
import {
    Edit3,
    Music,
    Shield, LogOut
} from "lucide-react";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import {Input} from "src/components/ui/input";
import {ImageWithFallback} from "src/components/common/ImageWithFallback";
import {Label} from "src/components/ui/label";
import {Separator} from "src/components/ui/separator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "src/components/ui/tab";
import {useAuthStore} from "src/store/useAuthStore";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import basicProfile from "src/assets/basic-profile.png";
import {useInfiniteContiQuery} from "src/app/api/conti";
import { useInView } from "react-intersection-observer";
import ContiRowCard from "src/components/conti/ContiRowCard";

export default function MyPage() {
    const { user, loading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL의 ?tab= 값으로 초기 탭 설정 (잘못된 값이면 'settings')
    const initialTabFromURL = (() => {
        const t = searchParams.get("tab");
        return t === "contis" || t === "settings" ? t : "settings";
    })();

    const [activeTab, setActiveTab] = useState(initialTabFromURL);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        nickname: user?.nickname,
        email: user?.email,
    });

    // URL ↔ state 동기화: 뒤/앞으로 가기 등으로 URL이 바뀌면 탭도 맞춰줌
    useEffect(() => {
        const t = searchParams.get("tab");
        const valid = t === "contis" || t === "settings" ? t : "settings";
        if (valid !== activeTab) setActiveTab(valid);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // 탭 변경 시 URL 즉시 반영
    const handleTabChange = (val: string) => {
        const next = val === "contis" || val === "settings" ? val : "settings";
        setActiveTab(next);

        const sp = new URLSearchParams(searchParams.toString());
        sp.set("tab", next);
        // 다른 쿼리가 이미 있으면 유지
        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteContiQuery(
        { memberId: user?.id ?? "", enabled: Boolean(user?.id) },
        {
            getNextPageParam: (lastPage: { nextOffset: number | null }) =>
                lastPage.nextOffset ?? undefined,        }
    );
    const { ref, inView } = useInView({ threshold: 1 });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const contis: ContiWithSongDto[] = data?.pages.flatMap((p) => p.items) ?? [];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleSaveProfile = () => {
        // 프로필 저장 로직
        console.log("프로필 저장:", editedProfile);
        setIsEditingProfile(false);
    };

    const handleCancelEdit = () => {
        setEditedProfile({
            nickname: user?.nickname,
            email: user?.email
        });
        setIsEditingProfile(false);
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* 프로필 이미지 */}
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200">
                                <ImageWithFallback
                                    src={user?.profileImage ?? basicProfile.src}
                                    alt={user?.nickname}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/*<Button*/}
                            {/*    size="sm"*/}
                            {/*    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"*/}
                            {/*    onClick={() => setIsEditingProfile(true)}*/}
                            {/*>*/}
                            {/*    <Edit3 className="w-4 h-4" />*/}
                            {/*</Button>*/}
                        </div>

                        {/* 프로필 정보 */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl mb-2">{user?.nickname}</h1>
                                    <p className="text-gray-600 mb-2">{user?.email}</p>
                                    {/*<p className="text-sm text-gray-500">*/}
                                    {/*    {formatDate(user.joinDate)}에 가입*/}
                                    {/*</p>*/}
                                </div>

                                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                    {/*<Button variant="outline" onClick={() => setIsEditingProfile(true)}>*/}
                                    {/*    <Edit3 className="w-4 h-4 mr-2" />*/}
                                    {/*    프로필 편집*/}
                                    {/*</Button>*/}
                                    {/*<Button variant="outline">*/}
                                    {/*    <Settings className="w-4 h-4" />*/}
                                    {/*</Button>*/}
                                </div>
                            </div>

                            {/* 통계 */}
                            <div className="grid grid-cols-3 gap-6 text-center">
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* 탭 메뉴 */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="settings">설정</TabsTrigger>
                        <TabsTrigger value="contis">
                            내 콘티
                        </TabsTrigger>
                    </TabsList>

                    {/* 설정 탭 */}
                    <TabsContent value="settings" className="space-y-6">
                        {/* 프로필 편집 */}
                        <Card className="p-6">
                            <h3 className="text-lg mb-4">프로필 정보</h3>
                            {isEditingProfile ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nickname">닉네임</Label>
                                        <Input
                                            id="nickname"
                                            value={editedProfile.nickname}
                                            onChange={(e) => setEditedProfile({...editedProfile, nickname: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button onClick={handleSaveProfile}>저장</Button>
                                        <Button variant="outline" onClick={handleCancelEdit}>취소</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <Label>이름</Label>
                                        <p className="mt-1">{user?.nickname}</p>
                                    </div>
                                    <div>
                                        <Label>닉네임</Label>
                                        <p className="mt-1">@{user?.nickname}</p>
                                    </div>
                                    <div>
                                        <Label>이메일</Label>
                                        <p className="mt-1">{user?.email}</p>
                                    </div>
                                    <Button variant="outline" onClick={() => setIsEditingProfile(true)}>
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        편집
                                    </Button>
                                </div>
                            )}
                        </Card>

                        {/* 계정 설정 */}
                        <Card className="p-6">
                            <h3 className="text-lg mb-4">계정 설정</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Shield className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">비밀번호 변경</p>
                                            <p className="text-sm text-gray-600">계정 보안을 위해 정기적으로 변경하세요</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">변경</Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <LogOut className="w-4 h-4 mr-1" />
                                        <p className="font-medium">로그아웃</p>
                                    </div>
                                    <Button variant="outline" size="sm">로그아웃</Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-red-600">계정 삭제</p>
                                        <p className="text-sm text-gray-600">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다</p>
                                    </div>
                                    <Button variant="destructive" size="sm">삭제</Button>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* 내 콘티 탭 */}
                    <TabsContent value="contis" className="space-y-6">
                        {isLoading ? (
                            <div className="text-center py-16 text-gray-400">불러오는 중…</div>
                        ) : contis.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {contis.map((conti) => (
                                    <ContiRowCard
                                        key={conti.id}
                                        conti={conti}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Music className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg text-gray-500 mb-2">아직 생성한 콘티가 없습니다</h3>
                                <p className="text-gray-400 mb-4">첫 번째 콘티를 만들어보세요</p>
                                <Button onClick={() => router.push("/conti/create")}>콘티 생성하기</Button>
                            </div>
                        )}

                        {hasNextPage && <div ref={ref} className="h-10" />}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}