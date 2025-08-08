import {Card} from "src/components/ui/card";
import {ImageWithFallback} from "src/components/common/ImageWithFallback";
import {Calendar, Clock, Heart, MessageCircle, MoreHorizontal, Play, Plus, Share2, Users} from "lucide-react";
import { Button } from "../ui/button";
import {Badge} from "src/components/ui/badge";
import FamousContiDto from "src/dto/home/famous-conti.dto";

const ContiCard = ({ conti }: { conti: FamousContiDto }) => {

    const totalDuration = conti.conti.songs.reduce((total, song) => total + song.duration, 0);

    const formatTotalDuration = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group" >
              {/*onClick={() => onViewContiDetail && onViewContiDetail(convertToContiDetail(conti))}>*/}

            {/* 썸네일 */}
            <div className="relative aspect-video overflow-hidden">
                <ImageWithFallback
                    src={conti.conti.songs[0].thumbnail}
                    alt={conti.conti.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* 재생 오버레이 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Play className="w-5 h-5 text-gray-800 ml-0.5" />
                    </div>
                </div>

                {/* 곡 수 배지 */}
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/50 text-white border-0">
                        {conti.conti.songs.length}곡
                    </Badge>
                </div>
            </div>

            {/* 콘티 정보 */}
            <div className="p-4">
                {/* 제목과 설명 */}
                <div className="mb-3">
                    <h3 className="text-lg mb-1 line-clamp-1">{conti.conti.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{conti.conti.description}</p>
                </div>

                {/* 작성자 정보 */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <ImageWithFallback
                            src={conti.praiseTeam.previewImg ?? ""}
                            alt={conti.praiseTeam.praiseTeamName}
                            className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-700">{conti.praiseTeam.praiseTeamName}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{conti.conti.date.slice(5)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            {"14:30"}
                            {/*<span>{getTotalDuration(conti.songs)}</span>*/}
                        </div>
                    </div>
                </div>

                {/* 테마 태그 */}
                {/*<div className="flex flex-wrap gap-1 mb-3">*/}
                {/*    {conti.themes.slice(0, 2).map(theme => (*/}
                {/*        <Badge key={theme} variant="outline" className="text-xs">*/}
                {/*            {theme}*/}
                {/*        </Badge>*/}
                {/*    ))}*/}
                {/*    {conti.themes.length > 2 && (*/}
                {/*        <Badge variant="outline" className="text-xs text-gray-500">*/}
                {/*            +{conti.themes.length - 2}*/}
                {/*        </Badge>*/}
                {/*    )}*/}
                {/*</div>*/}

                {/* 액션 */}
                <div className="flex items-center justify-between text-sm">
                    {/*<div className="flex items-center space-x-4 text-gray-500">*/}
                    {/*    <div className="flex items-center space-x-1">*/}
                    {/*        <Heart className="w-4 h-4" />*/}
                    {/*        <span>{conti.likes}</span>*/}
                    {/*    </div>*/}
                    {/*    <div className="flex items-center space-x-1">*/}
                    {/*        <Users className="w-4 h-4" />*/}
                    {/*        <span>{conti.comments}</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
        // <Card className="p-6 hover:shadow-lg transition-shadow">
        //     {/* 헤더 */}
        //     <div className="flex items-center justify-between mb-4">
        //         <div className="flex items-center space-x-3">
        //             <ImageWithFallback
        //                 src={conti.authorImage}
        //                 alt={conti.author}
        //                 className="w-10 h-10 rounded-full object-cover"
        //             />
        //             <div>
        //                 <h3 className="text-base">{conti.author}</h3>
        //                 <div className="flex items-center space-x-2 text-sm text-gray-500">
        //                     <Calendar className="w-3 h-3" />
        //                     <span>{conti.date}</span>
        //                 </div>
        //             </div>
        //         </div>
        //
        //         <div className="flex items-center space-x-2">
        //             {!followingUsers.includes(conti.author) && (
        //                 <Button
        //                     size="sm"
        //                     variant="outline"
        //                     onClick={() => toggleFollow(conti.author)}
        //                 >
        //                     <Plus className="w-3 h-3 mr-1" />
        //                     팔로우
        //                 </Button>
        //             )}
        //             <Button variant="ghost" size="sm">
        //                 <MoreHorizontal className="w-4 h-4" />
        //             </Button>
        //         </div>
        //     </div>
        //
        //     {/* 콘티 정보 */}
        //     <div className="mb-4">
        //         <h2 className="text-lg mb-2">{conti.title}</h2>
        //         <p className="text-gray-600 text-sm mb-3">{conti.description}</p>
        //
        //         <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
        //             <div className="flex items-center space-x-1">
        //                 <Users className="w-4 h-4" />
        //                 <span>{conti.songs.length}곡</span>
        //             </div>
        //             <div className="flex items-center space-x-1">
        //                 <Clock className="w-4 h-4" />
        //                 <span>{formatTotalDuration(totalDuration)}</span>
        //             </div>
        //         </div>
        //     </div>
        //
        //     {/* 썸네일 */}
        //     <div className="relative mb-4">
        //         <ImageWithFallback
        //             src={conti.thumbnail}
        //             alt={conti.title}
        //             className="w-full h-48 object-cover rounded-lg"
        //         />
        //         <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
        //             <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
        //                 <Play className="w-8 h-8 text-gray-800 ml-1" />
        //             </div>
        //         </div>
        //     </div>
        //
        //     {/* 곡 목록 */}
        //     <div className="mb-4">
        //         <h4 className="text-sm mb-2 text-gray-700">수록곡</h4>
        //         <div className="space-y-2">
        //             {conti.songs.slice(0, 3).map((song, index) => (
        //                 <div
        //                     key={index}
        //                     className="flex items-center justify-between text-sm"
        //                 >
        //                     <div className="flex items-center space-x-2">
        //                         <span className="text-gray-400 w-4">{index + 1}.</span>
        //                         <span>{song.title}</span>
        //                         <span className="text-gray-500">- {song.artist}</span>
        //                     </div>
        //                     <div className="flex items-center space-x-2">
        //                         <Badge variant="outline" className="text-xs">
        //                             {song.key}
        //                         </Badge>
        //                         <span className="text-gray-400 text-xs">{song.duration}</span>
        //                     </div>
        //                 </div>
        //             ))}
        //             {conti.songs.length > 3 && (
        //                 <p className="text-xs text-gray-500">
        //                     외 {conti.songs.length - 3}곡
        //                 </p>
        //             )}
        //         </div>
        //     </div>
        //
        //     {/* 액션 버튼 */}
        //     <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        //         <div className="flex items-center space-x-4">
        //             <Button variant="ghost" size="sm" className="text-gray-600">
        //                 <Heart className="w-4 h-4 mr-1" />
        //                 {conti.likes}
        //             </Button>
        //             <Button variant="ghost" size="sm" className="text-gray-600">
        //                 <MessageCircle className="w-4 h-4 mr-1" />
        //                 {conti.comments}
        //             </Button>
        //             <Button variant="ghost" size="sm" className="text-gray-600">
        //                 <Share2 className="w-4 h-4 mr-1" />
        //                 공유
        //             </Button>
        //         </div>
        //
        //         <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
        //             콘티 사용하기
        //         </Button>
        //     </div>
        // </Card>
    );
};

export default ContiCard;