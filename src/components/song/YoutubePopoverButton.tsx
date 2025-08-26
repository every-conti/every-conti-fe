import { useEffect, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "src/components/ui/popover";
import { Button } from "src/components/ui/button";
import YoutubePreview from "src/components/song/YoutubePreview";

export default function YoutubePopoverButton({
  youtubeVId,
  duration,
}: {
  youtubeVId: string;
  duration: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const html = document.querySelector("html");
    const body = document.querySelector("body");

    if (open) {
      html?.classList.add("overflow-hidden");
      body?.classList.add("overflow-hidden");
    } else {
      html?.classList.remove("overflow-hidden");
      body?.classList.remove("overflow-hidden");
    }

    return () => {
      html?.classList.remove("overflow-hidden");
      body?.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          🎬 영상 미리보기
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 shadow-xl border">
        <YoutubePreview youtubeVId={youtubeVId} duration={duration} />
      </PopoverContent>
    </Popover>
  );
}
