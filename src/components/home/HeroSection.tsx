import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl mb-4 text-gray-800">당신을 위한 찬양 콘티</h1>
        <p className="text-lg text-gray-600 mb-8">
          유명 찬양팀의 콘티를 한 눈에 확인하고, 나만의 콘티를 만들어보세요.
        </p>

        <div className="max-w-2xl mx-auto">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="찬양 제목이나 가사로 검색하세요..."
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
                // onKeyPress={handleKeyPress}
                className="pl-10 py-3 text-base bg-white border-gray-300 focus:border-blue-500"
              />
            </div>
            <Button
              // onClick={onSearch}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              검색
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
