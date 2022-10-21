import Mpegts from 'mpegts.js';
import { useCallback, useEffect, useRef } from 'react';
import cls from './index.module.less';

interface FlvProps {
  data: Mpegts.MediaDataSource;
  config: Mpegts.Config | undefined;
  onReady: (play: any) => void;
}

/**
 * react component wrap flv.js
 */
const ReFlv: React.FC<FlvProps> = (props: FlvProps) => {
  const flvRef = useRef<Mpegts.Player>();
  const videoRef = useRef<HTMLVideoElement>(null);

  const initProgress = useCallback(() => {
    if (flvRef.current) {
      const end = flvRef.current.buffered.end(0);
      const delta = end - flvRef.current.currentTime;

      // 延迟过大，通过跳帧的方式更新视频
      if (delta > 10 || delta < 0) {
        flvRef.current.currentTime = flvRef.current.buffered.end(0) - 1;
        return;
      }

      // 追帧
      if (delta > 1) {
        videoRef.current!.playbackRate = 1.1;
      } else {
        videoRef.current!.playbackRate = 1;
      }
    }
  }, []);

  const stopAll = useCallback(() => {
    flvRef.current?.pause();
    flvRef.current?.unload();
    flvRef.current?.detachMediaElement();
    flvRef.current?.destroy();
    flvRef.current = undefined;
  }, []);

  const CreatePlayer = useCallback(() => {
    const { data, config, onReady } = props;
    if (Mpegts.getFeatureList().mseLivePlayback) {
      flvRef.current = Mpegts.createPlayer(data, config);
      if (videoRef.current) {
        flvRef.current.attachMediaElement(videoRef.current);
        flvRef.current.load();
        videoRef.current.addEventListener('progress', initProgress, false);

        if (onReady) {
          onReady(videoRef.current);
        }
      }
    }
  }, [initProgress, props]);

  useEffect(() => {
    CreatePlayer();
    const videoElement = videoRef.current;
    return () => {
      videoElement?.removeEventListener('progress', initProgress, false);
      stopAll();
    };
  }, [CreatePlayer, initProgress, props, stopAll]);

  return (
    <div className={cls.flv_player_content}>
      <video
        controls={true}
        ref={videoRef}
        controlsList={'nodownload noremoteplayback noplaybackrate'}
      />
    </div>
  );
};

export default ReFlv;
