import { Music } from "lucide-react";
import { Button } from "src/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 text-blue-600" />
          <span className="text-xl text-blue-600">찬양콘티</span>
        </div>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            찬양 검색
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            콘티 모아보기
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            팔로잉
          </a>
        </nav>

        {/* 로그인/회원가입 */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" className="text-gray-600">
            로그인
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">회원가입</Button>
        </div>
      </div>
    </header>
  );
}
