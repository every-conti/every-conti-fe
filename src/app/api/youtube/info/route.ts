import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const videoId = req.nextUrl.searchParams.get('v');
    if (!videoId) {
        return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
    );
    const data = await res.json();
    return NextResponse.json(data);
}