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
import {useInfiniteMyContiQuery} from "src/app/api/conti";
import { useInView } from "react-intersection-observer";
import ContiRowCard from "src/components/conti/ContiRowCard";
import {useQueryClient} from "@tanstack/react-query";
import {CommonInfiniteSearchDto} from "src/dto/search/common-infinite-search.dto";
import {InfiniteData} from "@tanstack/query-core";
import withAuth from "src/components/common/withAuth";
import {Dialog, DialogTitle, DialogContent, DialogFooter, DialogHeader} from "src/components/ui/dialog";
import { toast } from "sonner";
import {fetchUserChangeNickname, fetchUserChangePassword, fetchUserDelete} from "src/app/api/user";

import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const pwSchema = z.object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력하세요."),
    newPassword: z
        .string()
        .min(6, "새 비밀번호는 6자 이상이어야 합니다."),
        // .regex(/[A-Za-z]/, "영문자를 포함해야 합니다.")
        // .regex(/\d/, "숫자를 포함해야 합니다."),
    confirmPassword: z.string().min(1, "새 비밀번호 확인을 입력하세요."),
}).refine((v) => v.newPassword === v.confirmPassword, {
    message: "새 비밀번호와 확인이 일치하지 않습니다.",
    path: ["confirmPassword"],
});

function MyPage() {
    const { user, setUser, loading, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();

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

    const [isPwOpen, setIsPwOpen] = useState(false);
    const [pwForm, setPwForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
    const [changingPw, setChangingPw] = useState(false);
    const [showPw, setShowPw] = useState({
        current: false,
        next: false,
        confirm: false,
    });

    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState("");
    const [deletingAccount, setDeletingAccount] = useState(false);

    const expectedPhrase = `${user?.nickname ?? ""} 삭제`;
    const canDelete = deleteConfirmText.trim() === expectedPhrase;

    // 모달 열기
    const openDeleteAccount = () => {
        setDeleteConfirmText("");
        setIsDeleteAccountOpen(true);
    };

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
    } = useInfiniteMyContiQuery(
        { memberId: user?.id },
        { enabled: Boolean(user?.id) }
    );
    const { ref, inView } = useInView({ threshold: 1 });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const contis: ContiWithSongDto[] = (data as InfiniteData<CommonInfiniteSearchDto<ContiWithSongDto>> | undefined)?.pages.flatMap((p) => p.items) ?? [];
    const onUpdated = (updated: ContiWithSongDto) => {
        queryClient.setQueryData<any>(
            ["myContis", user?.id],
            (oldData: any) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        items: page.items.map((c: ContiWithSongDto) =>
                            c.id === updated.id ? updated : c
                        ),
                    })),
                };
            }
        );
    }
    const onDeleted = (deleted: ContiWithSongDto) => {
        queryClient.setQueryData<any>(
            ["myContis", user?.id],
            (oldData: any) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        items: page.items.filter((c: ContiWithSongDto) => c.id !== deleted.id),
                    })),
                    pageParams: oldData.pageParams,
                };
            }
        );
    }

    const handleSaveProfile = async () => {
        if (!user) return;
        try {
            await fetchUserChangeNickname(user?.id, editedProfile.nickname);
            setUser({...user, nickname: editedProfile.nickname ?? user.nickname})
            toast.success("닉네임이 변경되었습니다.");
        } catch (e: any) {
            toast.error("닉네임이 변경에 실패했습니다.")
        } finally {
            setIsEditingProfile(false);
        }
    };

    const handleCancelEdit = () => {
        setEditedProfile({
            nickname: user?.nickname,
            email: user?.email
        });
        setIsEditingProfile(false);
    };

    const openPwModal = () => {
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPwErrors({});
        setIsPwOpen(true);
    };

    const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPwForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmitPw = async () => {
        // 1) 클라이언트 검증
        const parsed = pwSchema.safeParse(pwForm);
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            parsed.error.errors.forEach((err) => {
                const key = err.path[0]?.toString() ?? "form";
                fieldErrors[key] = err.message;
            });
            setPwErrors(fieldErrors);
            return;
        }
        setPwErrors({});

        // 2) API 호출
        try {
            setChangingPw(true);
            await fetchUserChangePassword(user?.id, {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });

            await queryClient.invalidateQueries({ queryKey: ["me"] }).catch(() => {});
            toast.success("비밀번호가 변경되었어요. 다시 로그인해 주세요.");
            logout();
            router.replace("/login");
        } catch (e: any) {
            const message =
                e?.message ??
                (typeof e === "string" ? e : "비밀번호 변경 중 오류가 발생했어요.");
            toast.error(message);
        } finally {
            setChangingPw(false);
            setIsPwOpen(false);
        }
    }
    // 계정 삭제
    const handleConfirmDeleteAccount = async () => {
        if (!user?.id || !canDelete) return;

        try {
            setDeletingAccount(true);

            await fetchUserDelete(user.id); // ← 프로젝트에 맞게 함수 교체

            await queryClient.clear();      // react-query 캐시 초기화
            await logout();                 // 토큰/유저 제거

            toast.success("계정이 삭제되었습니다.");
            // 3) 홈으로 이동
            router.replace("/");
        } catch (e) {
            toast.error("계정 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            setDeletingAccount(false);
            setIsDeleteAccountOpen(false);
        }
    };


    return (
        <>
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
                                        <Button variant="outline" size="sm" onClick={openPwModal}>변경</Button>

                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <LogOut className="w-4 h-4 mr-1" />
                                            <p className="font-medium">로그아웃</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={logout}>로그아웃</Button>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-red-600">계정 삭제</p>
                                            <p className="text-sm text-gray-600">계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다</p>
                                        </div>
                                        <Button variant="destructive" size="sm" onClick={openDeleteAccount}>삭제</Button>
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
                                            onUpdated={onUpdated}
                                            onDeleted={onDeleted}
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
            <Dialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
                <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>정말 계정을 삭제할까요?</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3 text-sm text-gray-700">
                        <p>
                            계정을 삭제하면 모든 데이터가 <span className="font-medium">영구적으로 삭제</span>됩니다.
                            이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="space-y-2">
                            <Label htmlFor="delete-confirm">확인 문구를 입력하세요</Label>
                            <p className="text-xs text-gray-500">
                                아래 입력창에 <span className="font-medium">“{expectedPhrase}”</span>를 정확히 입력하면 삭제가 진행됩니다.
                            </p>
                            <Input
                                id="delete-confirm"
                                placeholder={expectedPhrase}
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsDeleteAccountOpen(false)}
                            disabled={deletingAccount}
                        >
                            취소
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmDeleteAccount}
                            disabled={!canDelete || deletingAccount}
                        >
                            {deletingAccount ? "삭제 중…" : "계정 삭제"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 비밀번호 변경 모달 */}
            <Dialog open={isPwOpen} onOpenChange={setIsPwOpen}>
                <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>비밀번호 변경</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        {/* 현재 비밀번호 */}
                        <div className="space-y-1">
                            <Label htmlFor="currentPassword">현재 비밀번호</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showPw.current ? "text" : "password"}
                                    value={pwForm.currentPassword}
                                    onChange={handlePwChange}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPw((s) => ({ ...s, current: !s.current }))}
                                    aria-label="현재 비밀번호 보기"
                                >
                                    {showPw.current ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                </button>
                            </div>
                            {pwErrors.currentPassword && (
                                <p className="text-xs text-red-500">{pwErrors.currentPassword}</p>
                            )}
                        </div>

                        {/* 새 비밀번호 */}
                        <div className="space-y-1">
                            <Label htmlFor="newPassword">새 비밀번호</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPw.next ? "text" : "password"}
                                    value={pwForm.newPassword}
                                    onChange={handlePwChange}
                                    placeholder="최소 8자, 영문/숫자 포함"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPw((s) => ({ ...s, next: !s.next }))}
                                    aria-label="새 비밀번호 보기"
                                >
                                    {showPw.next ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                </button>
                            </div>
                            {pwErrors.newPassword && (
                                <p className="text-xs text-red-500">{pwErrors.newPassword}</p>
                            )}
                        </div>

                        {/* 새 비밀번호 확인 */}
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPw.confirm ? "text" : "password"}
                                    value={pwForm.confirmPassword}
                                    onChange={handlePwChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                    onClick={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))}
                                    aria-label="새 비밀번호 확인 보기"
                                >
                                    {showPw.confirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                </button>
                            </div>
                            {pwErrors.confirmPassword && (
                                <p className="text-xs text-red-500">{pwErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/*<p className="text-xs text-gray-500">*/}
                        {/*    안전한 비밀번호를 위해 특수문자 포함을 권장합니다.*/}
                        {/*</p>*/}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsPwOpen(false)}
                            disabled={changingPw}
                        >
                            취소
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmitPw}
                            disabled={changingPw}
                        >
                            {changingPw ? "변경 중…" : "변경"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default withAuth(MyPage);