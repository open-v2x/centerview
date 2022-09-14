import Mpegts from 'mpegts.js';
import { useEffect, useRef, useState } from 'react';
import cls from './index.module.less';

interface FlvProps {
  data: Mpegts.MediaDataSource;
  config?: Mpegts.Config;
}

/**
 * react component wrap flv.js
 */
const ReFlv: React.FC<FlvProps> = (props) => {
  const flvRef = useRef<Mpegts.Player>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lastDecodedFrame, setLastDecodedFrame] = useState(0);

  // const oneFrame = {
  //   x: '20',
  //   y: '30',
  //   width: 40,
  //   height: 50,
  // };

  // const clearCanvas = () => {
  //   const canvas = document.getElementById('canvas');
  //   const ctx = canvas?.getContext('2d');
  //   ctx.clearRect(0, 0, canvas?.width, canvas?.height);
  // };

  // const handleOneFrame = () => {
  //   const canvas = document.getElementById('canvas');
  //   const ctx = canvas?.getContext('2d');
  //   clearCanvas();

  //   ctx.lineWidth = 1;
  //   ctx.strokeStyle = 'red';
  //   ctx.strokeRect(oneFrame.x, oneFrame.y, oneFrame.width, oneFrame.height);
  // };

  const CreatePlayer = () => {
    if (Mpegts.getFeatureList().mseLivePlayback) {
      const { data, config } = props;
      flvRef.current = Mpegts.createPlayer(data, config);
      if (videoRef.current) {
        flvRef.current.attachMediaElement(videoRef.current);
        flvRef.current.load();
        setTimeout(() => {
          if (flvRef.current) {
            flvRef.current.play();
          }
        });
        flvRef.current.on('statistic_info', (res) => {
          if (lastDecodedFrame === 0) {
            setLastDecodedFrame(res.decodedFrames);
            return;
          }
          if (lastDecodedFrame !== res.decodedFrames) {
            setLastDecodedFrame(res.decodedFrames);
          } else {
            setLastDecodedFrame(0);
            if (flvRef.current) {
              flvRef.current.pause();
              flvRef.current.unload();
              flvRef.current.detachMediaElement();
              flvRef.current.destroy();
              flvRef.current = undefined;
              CreatePlayer();
            }
          }
        });
        // setTimeout(() => {
        //   handleOneFrame();
        // }, 2000);
      }
    }
  };

  useEffect(() => {
    CreatePlayer();
  }, [props]);

  return (
    <div className={cls.flv_player_content}>
      <video
        controls={true}
        style={Object.assign({
          width: '100%',
        })}
        ref={videoRef}
      />
      {/* <canvas className={cls.canvas} id="canvas" width={668} height={422} /> */}
    </div>
  );
};

export default ReFlv;
