"use client";
import { LogOut, Plus, Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "src/components/ui/button";
import { useAuthStore } from "src/store/useAuthStore";
import logo from "src/assets/logo.png";
import loadingIcon from "src/assets/loading.gif";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      // 컴포넌트 언마운트 시 overflow 복구
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navItems = [
    { label: "찬양 검색", path: "/search" },
    { label: "콘티 모아보기", path: "/conti" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 w-[calc(100vw-8px)] bg-white border-b border-gray-200 px-4 sm:px-6 py-3 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* 로고 */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image src={logo} alt="로고" width={140} height={40} />
          </div>

          {/* PC 네비게이션 */}
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

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden text-gray-800 z-60"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* 유저 상태 버튼 (PC & 모바일 공통) */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => router.push("/conti/create")}
              className="items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              콘티 생성
            </Button>

            {loading ? (
              <Image src={loadingIcon} alt="로딩 중" width={24} height={24} />
            ) : user ? (
              <>
                <span className="text-sm text-gray-700">{user.nickname}님</span>
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

      {/* 모바일 메뉴 드로어 */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">메뉴</h2>
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setMenuOpen(false);
                }}
                className={`text-left py-2 px-2 rounded hover:bg-gray-100 ${
                  isActive(item.path)
                    ? "text-blue-600 font-semibold"
                    : "text-gray-800"
                }`}
              >
                {item.label}
              </button>
            ))}

            <hr className="my-4" />

            {/* 로그인 상태별 메뉴 */}
            {loading ? (
              <Image src={loadingIcon} alt="로딩 중" width={24} height={24} />
            ) : user ? (
              <>
                <p className="text-sm text-gray-600 mb-2">{user.nickname}님</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    router.push("/");
                    setMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="mb-2"
                  onClick={() => {
                    router.push("/login");
                    setMenuOpen(false);
                  }}
                >
                  로그인
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    router.push("/signup");
                    setMenuOpen(false);
                  }}
                >
                  회원가입
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
