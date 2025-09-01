"use client";
import { LogOut, Plus, Menu, X, User, Settings, Music } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "src/components/ui/button";
import { useAuthStore } from "src/store/useAuthStore";
import logo from "src/assets/logo.png";
import loadingIcon from "src/assets/loading.gif";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { ImageWithFallback } from "../ImageWithFallback";
import basicProfile from "src/assets/basic-profile.png";

const navItems = [
  {
    label: "콘티",
    children: [
      { label: "콘티 찾기", path: "/conti/search" },
      { label: "콘티 등록", path: "/conti/create" },
    ],
  },
  {
    label: "찬양",
    children: [
      { label: "찬양 찾기", path: "/song/search" },
      { label: "찬양 등록", path: "/song/create" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (path: string) => {
    const query = searchParams.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;
    return fullPath === path;
  };
  const isGroupActive = (children: { path: string }[]) => children.some((c) => isActive(c.path));
  const dropdownTimers = useRef<{ [key: string]: NodeJS.Timeout | null }>({});

  return (
    <>
      <header className="fixed top-0 left-0 w-[calc(100vw-8px)] h-18 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 z-50">
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
            {navItems.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => {
                  if (dropdownTimers.current[group.label]) {
                    clearTimeout(dropdownTimers.current[group.label]!);
                  }
                  setActiveDropdown(group.label);
                }}
                onMouseLeave={() => {
                  dropdownTimers.current[group.label] = setTimeout(() => {
                    setActiveDropdown((prev) => (prev === group.label ? null : prev));
                  }, 200);
                }}
              >
                <button
                  className={`transition-colors ${
                    isGroupActive(group.children)
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                  onClick={() => {
                    if (group.label === "찬양") router.push("/song/search");
                    if (group.label === "콘티") router.push("/conti/search");
                  }}
                >
                  {group.label}
                </button>
                {activeDropdown === group.label && (
                  <div
                    className="absolute bg-white shadow-lg border mt-2 rounded w-36 z-50"
                    onMouseEnter={() => {
                      if (dropdownTimers.current[group.label]) {
                        clearTimeout(dropdownTimers.current[group.label]!);
                      }
                    }}
                    onMouseLeave={() => {
                      dropdownTimers.current[group.label] = setTimeout(() => {
                        setActiveDropdown((prev) => (prev === group.label ? null : prev));
                      }, 200);
                    }}
                  >
                    {group.children.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => router.push(item.path)}
                        className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          isActive(item.path) ? "text-blue-600 font-semibold" : "text-gray-800"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden text-gray-800 z-60"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* 유저 상태 버튼 */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <Image src={loadingIcon} alt="로딩 중" width={24} height={24} />
            ) : user ? (
              <>
                <span className="text-sm text-gray-700 hidden lg:block">{user.nickname}님</span>

                {/* 프로필 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                      <ImageWithFallback
                        src={user.profileImage ?? basicProfile.src}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => router.push("/my-page?tab=contis")}
                      className="cursor-pointer"
                    >
                      <Music className="mr-2 h-4 w-4" />
                      <span>내 콘티</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/my-page?tab=settings")}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>설정</span>
                    </DropdownMenuItem>
                    {/*<DropdownMenuItem className="cursor-pointer">*/}
                    {/*  <Settings className="mr-2 h-4 w-4" />*/}
                    {/*  <span>설정</span>*/}
                    {/*</DropdownMenuItem>*/}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>로그아웃</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setMenuOpen(false)}>
          <div
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 flex flex-col p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">메뉴</h2>
            {navItems.map((group) => (
              <div key={group.label} className="mb-3">
                <h3 className="text-sm font-semibold text-gray-500 mb-1">{group.label}</h3>
                {group.children.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      router.push(item.path);
                      setMenuOpen(false);
                    }}
                    className={`block w-full text-left py-2 px-2 rounded hover:bg-gray-100 ${
                      isActive(item.path) ? "text-blue-600 font-semibold" : "text-gray-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
            {user?.id && <div className="mb-3">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">마이 페이지</h3>
              <button
                  onClick={() => {
                    router.push("/my-page?tab=contis");
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 px-2 rounded hover:bg-gray-100 ${
                      isActive("/my-page?tab=contis") ? "text-blue-600 font-semibold" : "text-gray-800"
                  }`}
              >
                내 콘티
              </button>
              <button
                  onClick={() => {
                    router.push("/my-page?tab=settings");
                    setMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 px-2 rounded hover:bg-gray-100 ${
                      isActive("/my-page?tab=settings")
                          ? "text-blue-600 font-semibold"
                          : "text-gray-800"
                  }`}
              >
                설정
              </button>
            </div>}

            <hr className="my-4" />

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
                  <LogOut className="w-4 h-4 mr-2" /> 로그아웃
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
