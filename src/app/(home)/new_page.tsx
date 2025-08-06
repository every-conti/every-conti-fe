// import { useState } from "react";
import {
    Plus,
    Search,
    Music,
    List,
    ArrowRight,
    Sparkles,
    Users,
    Clock,
    TrendingUp
} from "lucide-react";
import { Button } from "src/components/ui/button";
import {Card} from "src/components/ui/card";
import {Badge} from "src/components/ui/badge";
import {ImageWithFallback} from "src/components/common/ImageWithFallback";
import {Input} from "src/components/ui/input";

interface Song {
    id: string;
    title: string;
    artist: string;
    key: string;
    genre: string;
    duration: string;
    views: string;
    likes: string;
    thumbnail: string;
    themes: string[];
}

interface HomePageProps {
    onPageChange: (page: string) => void;
    onSearchSubmit: (searchTerm: string) => void;
    totalSongs: number;
    recentSongs: Song[];
}

export default function HomePage({ onPageChange, onSearchSubmit, totalSongs, recentSongs }: HomePageProps) {
    // const [quickSearch, setQuickSearch] = useState("");

    const handleQuickSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // if (quickSearch.trim()) {
        //     onSearchSubmit(quickSearch);
        //     onPageChange("search");
        // }
    };

    const stats = [
        { label: "등록된 찬양", value: totalSongs.toLocaleString(), icon: Music },
        { label: "활성 사용자", value: "1,234", icon: Users },
        { label: "생성된 콘티", value: "567", icon: List },
        { label: "이번 주 재생", value: "89K", icon: TrendingUp }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        한국어 찬양 & 콘티 플랫폼
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        원하는 찬양을 쉽게 찾고, AI의 도움으로 새로운 찬양을 생성하며,
                        완벽한 콘티를 만들어보세요
                    </p>

                    {/* Quick Search */}
                    <form onSubmit={handleQuickSearch} className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="찬양 제목이나 가사로 검색해보세요..."
                                // value={quickSearch}
                                // onChange={(e) => setQuickSearch(e.target.value)}
                                className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 shadow-lg"
                            />
                            <Button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-700"
                            >
                                검색
                            </Button>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            총 <span className="text-blue-600 font-medium">{totalSongs.toLocaleString()}</span>곡이 검색 가능합니다
                        </p>
                    </form>

                    {/* Main Action Buttons */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* 찬양 생성 */}
                        <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 cursor-pointer group"
                              onClick={() => onPageChange("song-create")}>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl mb-3 text-gray-800">찬양 생성</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    AI의 도움을 받아 새로운 찬양을 만들어보세요.
                                    가사부터 테마까지 자동으로 분석해드립니다.
                                </p>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full group-hover:px-10 transition-all">
                                    찬양 만들기
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </Card>

                        {/* 콘티 생성 */}
                        <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 cursor-pointer group"
                              onClick={() => onPageChange("conti-create")}>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <List className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl mb-3 text-gray-800">콘티 생성</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    예배나 모임을 위한 완벽한 찬양 콘티를 구성해보세요.
                                    키와 분위기를 고려한 최적의 순서를 제안합니다.
                                </p>
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full group-hover:px-10 transition-all">
                                    콘티 만들기
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-6 bg-white/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                                <div className="text-2xl mb-1 text-gray-800">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Songs */}
            <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl mb-2 text-gray-800">최근 등록된 찬양</h2>
                            <p className="text-gray-600">새롭게 추가된 찬양들을 확인해보세요</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => onPageChange("search")}
                            className="hover:bg-blue-50 hover:border-blue-300"
                        >
                            전체 보기
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentSongs.slice(0, 6).map((song) => (
                            <Card key={song.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                                <div className="relative h-32">
                                    <ImageWithFallback
                                        src={song.thumbnail}
                                        alt={song.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <Badge className="absolute bottom-2 right-2 bg-black/70 text-white text-xs">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {song.duration}
                                    </Badge>
                                </div>
                                <div className="p-4">
                                    <h4 className="mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {song.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">{song.artist}</p>
                                    <div className="flex flex-wrap gap-1">
                                        <Badge variant="outline" className="text-xs">
                                            {song.key}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {song.genre}
                                        </Badge>
                                        {song.themes.slice(0, 1).map(theme => (
                                            <Badge key={theme} variant="secondary" className="text-xs">
                                                {theme}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl mb-4">지금 시작해보세요</h2>
                    <p className="text-xl mb-8 opacity-90">
                        더 나은 예배와 찬양 경험을 위한 첫 걸음을 내딛어보세요
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={() => onPageChange("song-create")}
                            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            첫 찬양 만들기
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => onPageChange("search")}
                            className="border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg"
                        >
                            <Search className="w-5 h-5 mr-2" />
                            찬양 둘러보기
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}