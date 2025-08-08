import {ShareModeTypes} from "src/types/share-mode.types";

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

export default function shareContent(mode: ShareModeTypes){
    const shareData = {
        title: "",
        text: "",
        url: `${window.location.href}`,
    };

    switch (mode) {
        case "song":
            shareData.text = `에브리콘티에서 찬양의 정보를 확인하고 콘티를 등록해보세요`;
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