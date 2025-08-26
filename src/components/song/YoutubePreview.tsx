import { formatYoutubeDuration } from "src/utils/parseSongDuration";

export default function YoutubePreview({
  youtubeVId,
  duration,
}: {
  youtubeVId: string;
  duration: string;
}) {
  if (!youtubeVId || !duration) return null;

  return (
    <div className="w-40 rounded-lg border bg-gray-100 shadow-sm p-2">
      <img
        src={`https://img.youtube.com/vi/${youtubeVId}/0.jpg`}
        alt="유튜브 썸네일"
        className="w-full h-24 object-cover rounded-md mb-2"
      />
      <p className="text-xs text-gray-500">
        ⏱ 길이:{" "}
        <span className="text-sm font-semibold text-gray-800">
          {formatYoutubeDuration(duration)}
        </span>
      </p>
    </div>
  );
}
