import ReFlv from './ReFlv';
import type Mpegts from 'mpegts.js';
export default function LiveStream(props: { url: string }) {
  const { url } = props;

  const onReady = (play: Mpegts.Player) => {
    play.play();
  };

  return (
    <ReFlv
      data={{
        type: 'flv',
        isLive: true,
        url: url,
        cors: true,
        hasAudio: false,
      }}
      config={{
        enableWorker: true,
        enableStashBuffer: false,
        stashInitialSize: 128,
        liveBufferLatencyChasing: true,
        liveBufferLatencyMinRemain: 3,
        liveBufferLatencyMaxLatency: 5,
        autoCleanupSourceBuffer: true,
      }}
      onReady={onReady}
    />
  );
}
