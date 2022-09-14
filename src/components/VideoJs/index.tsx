import videojs from 'video.js';
import { useEffect, useRef } from 'react';
import 'video.js/dist/video-js.css';

export interface VideoJSProps {
  options: videojs.PlayerOptions;
  onReady: (play: any) => void;
}

export const VideoJS = (props: VideoJSProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<videojs.Player>();

  const { options, onReady } = props;

  const init = () => {
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) {
        return;
      }

      const player = (playerRef.current = videojs(videoElement, options, () => {
        if (onReady) {
          onReady(player);
          player.play();
        }
      }));
    } else {
      const player = playerRef.current;
      if (options.sources?.length) {
        player.src(options.sources[0].src);
      }
    }
  };

  useEffect(() => {
    init();
  }, [options, videoRef]);

  return (
    <div data-vjs-player>
      <video
        id="my-player"
        className="video-js vjs-big-play-centered"
        poster="//vjs.zencdn.net/v/oceans.png"
        data-setup="{}"
        ref={videoRef}
      >
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noreferrer">
            supports HTML5 video
          </a>
        </p>
      </video>
    </div>
  );
};
