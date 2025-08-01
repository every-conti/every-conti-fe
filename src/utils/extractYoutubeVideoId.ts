const extractYoutubeVideoId = (url: string): string | null => {
    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.hostname === "youtube") {
            return parsedUrl.pathname.substring(1);
        } else if (parsedUrl.hostname.includes("youtube.com")) {
            if (parsedUrl.pathname === "/watch") {
                return parsedUrl.searchParams.get("v");
            } else if (parsedUrl.pathname.startsWith("/embed/")) {
                return parsedUrl.pathname.split("/embed/")[1].split("?")[0];
            }
        }
    } catch (e) {
        return null;
    }
    return null;
};
export default extractYoutubeVideoId;