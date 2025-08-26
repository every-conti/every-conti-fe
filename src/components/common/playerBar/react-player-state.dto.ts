export interface ReactPlayerStateDto {
  src?: string;
  pip: boolean;
  playing: boolean;
  controls: boolean;
  volume: number;
  light: boolean;
  muted: boolean;
  played: number;
  duration: number;
  loop: boolean;
  seeking: boolean;
  playedSeconds: number;
}
