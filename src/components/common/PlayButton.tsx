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
    const enqueueAndPlay = usePlayerStore((s) => s.enqueueAndPlay); // 또는 playOne

    const handlePlay = () => {
        enqueueAndPlay([song]);
    };

    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePlay();
            }}
            className="cursor-pointer"
        >
            {children ?? <Play className="w-6 h-6 text-gray-800 ml-1" />}
        </div>
    );
}