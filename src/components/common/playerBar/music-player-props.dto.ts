import { Dispatch, JSX, SetStateAction } from "react";
import { ReactPlayerStateDto } from "src/components/common/playerBar/react-player-state.dto";
import { PlayerRepeatMode } from "src/components/common/playerBar/player-repeat-mode";

export interface MusicPlayerPropsDto {
  showVolumeControl: boolean;
  setShowVolumeControl: (showVolumeControl: boolean) => void;

  isInConti: boolean;
  setIsInConti: (isInConti: boolean) => void;

  setIsFullScreen: (isFullScreen: boolean) => void;

  shuffle: boolean;
  setShuffle: (shuffle: boolean) => void;
  repeatMode: PlayerRepeatMode;
  hasPrev: boolean;
  hasNext: boolean;

  nextSong: () => void;
  prevSong: () => void;

  cycleRepeatMode: () => void;
  getRepeatIcon: () => JSX.Element;

  state: ReactPlayerStateDto;
  // setState: (state: ReactPlayerStateDto) => void;
  setState: Dispatch<SetStateAction<ReactPlayerStateDto>>;
  isSeeking: boolean;
  setIsSeeking: (isSeeking: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;

  onPlayPause: () => void;
  handleLike: () => void;
  handleProgress: () => void;
  handleAddToConti: () => void;
  handleSeek: (value: number[]) => void;

  isLiked: boolean;
  onClose: () => void;
}
