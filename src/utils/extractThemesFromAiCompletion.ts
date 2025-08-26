export default function extractThemesFromAiCompletion(text: string): string[] {
  return text
    .split(",") // 쉼표로 분리
    .map((t) => t.replace(/[^\uAC00-\uD7A3\s]/g, "")) // 한글과 공백만 남기고 제거
    .map((t) => t.trim()) // 앞뒤 공백 제거
    .filter((t) => t.length > 0); // 빈 문자열 제거
}
