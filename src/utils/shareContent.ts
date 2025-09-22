import { ShareModeTypes } from "src/types/share-mode.types";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import { parseSongDuration } from "src/utils/parseSongDuration";
import { getFullYoutubeURIByVId } from "src/utils/youtubeVIdUtils";
import { MinimumSongToPlayDto } from "src/dto/common/minimum-song-to-play.dto";
import {SongKeyKorean} from "src/types/song/song-key.types";

function handleUnsupportedShare(shareData: any) {
  if (shareData.url) {
    const textarea = document.createElement("textarea");
    textarea.value = `${shareData.text}\n${shareData.url}`;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("링크가 클립보드에 복사되었습니다.");
  } else {
    alert("이 브라우저에서는 공유 기능을 사용할 수 없습니다.");
  }
}

export default function shareContent(mode: ShareModeTypes, url?: string, data?: any) {
  const shareData = {
    title: "",
    text: "",
    url: url ? "" : window.location.href,
  };

  switch (mode) {
    case "song":
      if (data) {
        const song = data as MinimumSongToPlayDto;
        shareData.text = `[에브리콘티]\n🎵 찬양: ${song.songName}\n👤 찬양팀: ${song.praiseTeam.praiseTeamName}\n🕒 총 길이: ${parseSongDuration(song.duration)}\n${song.songKey && `${SongKeyKorean[song.songKey]}키 |\n`}${url && `🔗${url}\n`}유튜브🔗${getFullYoutubeURIByVId(song.youtubeVId)}\n)`;
      } else {
        shareData.text = `[에브리콘티]\n에브리콘티에서 콘티의 정보를 확인하고 콘티를 등록해보세요`;
      }
      break;
    case "lyrics":
      if (data) {
        const song = data as MinimumSongToPlayDto;
        shareData.text = `[에브리콘티]\n${song.songName}가사:\n\n${song.lyrics}}`;
      } else {
        shareData.text = `[에브리콘티]\n에브리콘티에서 곡의 가사를 확인해보세요`;
      }
      break;
    case "conti":
      if (data) {
        const conti = data as ContiWithSongDto;
        shareData.text = `[에브리콘티]\n🎵 콘티: ${conti.title}\n📅 날짜: ${conti.date}\n👤 작성자: ${conti.creator.nickname}\n🕒 총 길이: ${parseSongDuration(conti.songs.reduce((total, s) => total + s.song.duration, 0))}\n${url && "🔗" + url}\n\n▷ 곡 리스트(${conti.songs.length}곡)\n${conti.songs.map((s, idx) => `${idx + 1}. ${s.song.songName} | ${parseSongDuration(s.song.duration)} | ${s.song.songKey ? `${SongKeyKorean[s.song.songKey]}키 | ` : ""}${s.song.praiseTeam.praiseTeamName}\n🔗${getFullYoutubeURIByVId(s.song.youtubeVId)}\n`).join("\n")}`;
      } else {
        shareData.text = `[에브리콘티]\n에브리콘티에서 콘티의 정보를 확인하고 콘티를 등록해보세요`;
      }
      break;

    default:
      break;
  }

  if (window.navigator.share === undefined) {
    handleUnsupportedShare(shareData);
  } else {
    window.navigator.share(shareData);
  }
}
