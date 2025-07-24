"use client";
import { LogOut, Plus } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "src/components/ui/button";
import { useAuthStore } from "src/store/useAuthStore";
import logo from "src/assets/logo.png";
import loadingIcon from "src/assets/loading.gif";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuthStore();

  const navItems = [
    { label: "찬양 검색", path: "/search" },
    { label: "콘티 모아보기", path: "/conti" },
    // { label: "팔로잉", path: "/following" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 px-6 py-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image src={logo} alt="로고" width={140} height={40} />
          {/* <Music className="w-6 h-6 text-blue-600" />
          <span className="text-xl text-blue-600">찬양콘티</span> */}
        </div>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`transition-colors ${
                isActive(item.path)
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* 유저 상태별 버튼 */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => router.push("/conti/create")}
            className="hidden md:flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            콘티 생성
          </Button>

          {loading ? (
            <Image src={loadingIcon} alt="로딩 중" width={24} height={24} />
          ) : user ? (
            <>
              <span className="text-sm text-gray-700 hidden md:inline">
                {user.nickname}님
              </span>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut className="w-4 h-4 mr-1" />
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-gray-600"
                onClick={() => router.push("/login")}
              >
                로그인
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
