"use client";

import { Play } from "lucide-react";
import {MinimumSongToPlayDto} from "src/dto/common/minimum-song-to-play.dto";
import {usePlayerStore} from "src/store/usePlayerStore";
import {ReactNode} from "react";

interface PlayButtonProps {
    song: MinimumSongToPlayDto;
    children?: ReactNode;
}

export default function PlayButton({ song, children }: PlayButtonProps) {
    const { setCurrentSong, setIsPlaying } = usePlayerStore();

    const handlePlay = () => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                handlePlay();
            }}
            className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center cursor-pointer"
        >
            {children ?? <Play className="w-6 h-6 text-gray-800 ml-1" />}
        </div>
    );
}