"use client";

import {useRef, useState} from "react";
import {Card} from "src/components/ui/card";
import {ArrowRight, Volume2, VolumeX} from "lucide-react";
import Link from "next/link";
import {Button} from "src/components/ui/button";

export default function ContiDemoVideo() {
    const [muted, setMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !muted;
            setMuted(!muted);
        }
    };

    return (
        <Card className="items-center p-6 hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 group">
            <div className="text-center mb-6">
                <h3 className="text-2xl mb-3 text-gray-800">콘티 듣기</h3>
                <p className="text-gray-600 leading-relaxed">
                    홈페이지에서 바로 콘티를 재생하고 음악을 들어보세요
                </p>
            </div>
            <div className="relative">
                <video
                    ref={videoRef}
                    width="320"
                    autoPlay
                    loop
                    preload="auto"
                    muted={muted}
                    playsInline
                >
                    <source
                        src="https://everycontistorage.blob.core.windows.net/public-assets/play-conti.mp4"
                        type="video/mp4"
                    />
                </video>
                {/* 🔊 음소거 버튼 */}
                <button
                    onClick={toggleMute}
                    className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition"
                >
                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>
            <Link href="/conti/search" className="mt-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-3 rounded-full">
                    콘티 들으러 가기 <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </Card>
    );
}