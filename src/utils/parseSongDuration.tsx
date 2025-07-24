export default function parseSongDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  return `${hours != 0 ? String(hours).padStart(2, "0") + ":" : ""}${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
