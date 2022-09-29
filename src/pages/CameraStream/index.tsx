import ReFlv from '@/components/ReFlv';
// import { VideoJS } from '@/components/VideoJs';
// import { useRef } from 'react';
// import style from './index.module.less';

export default function CameraStream() {
  // const [url, setUrl] = useState('http://172.16.151.70:7001/live/result.flv');
  // useEffect(() => {
  //   setTimeout(() => {
  //     setUrl(
  //       'https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv',
  //     );
  //   }, 10000);
  // }, []);

  // const videoRef = useRef<videojs.VideoJsPlayer>();

  // const options: videojs.VideoJsPlayerOptions = {
  //   controls: true,
  //   playbackRates: [0.7, 1.0, 1.5, 2.0],
  //   autoplay: true,
  //   muted: false,
  //   loop: true,
  //   preload: 'auto',
  //   language: 'zh-CN',
  //   aspectRatio: '16:9',
  //   fluid: true,
  //   sources: [
  //     {
  //       src: 'https://c1--cn-gotcha208.bilivideo.com/live-bvc/544632/live_1927149793_21890494_1500/index.m3u8?expires=1664272465&len=0&oi=241717928&pt=web&qn=0&trid=1007afc2c084a6fa4a1abbced512cf49c5ad&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha208&sign=faa2137579976f9304680a11e9ae91bf&sk=657866af8fc16d8b2b84dfdde3e98143003d0328c8f0c052fd12c7ce2bfbc0dc&p2p_type=1&src=57345&sl=1&free_type=0&pp=rtmp&machinezone=ylf&source=onetier&site=9c6e116b3d6e5af01cb2f70250e485b1&order=1',
  //       type: 'application/vnd.apple.mpegurl',
  //     },
  //   ],
  //   width: document.documentElement.clientWidth,
  //   notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
  //   controlBar: {
  //     timeDivider: true,
  //     durationDisplay: true,
  //     remainingTimeDisplay: true,
  //     fullscreenToggle: true, // 全屏按钮
  //   },
  // };
  // const onReady = (play: videojs.VideoJsPlayer) => {
  //   videoRef.current = play;
  //   play.play();
  // };

  return (
    <div>
      {/* <VideoJS options={options} onReady={onReady} /> */}
      <ReFlv
        data={{
          type: 'flv',
          isLive: true,
          url: 'http://101.133.236.98:7001/live/movie.flv',
          cors: true,

          // url: 'https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv',
        }}
        config={{
          enableWorker: true,
          enableStashBuffer: false,
          stashInitialSize: 128,
          liveBufferLatencyChasing: true,
          liveBufferLatencyMinRemain: 3,
          liveBufferLatencyMaxLatency: 5,
        }}
        // url="ws://localhost:8888/rtsp/1/?url=rtsp://101.132.182.165:8554/test"
        // url="https://c1--cn-gotcha208.bilivideo.com/live-bvc/544632/live_1927149793_21890494_1500/index.m3u8?expires=1664272465&len=0&oi=241717928&pt=web&qn=0&trid=1007afc2c084a6fa4a1abbced512cf49c5ad&sigparams=cdn,expires,len,oi,pt,qn,trid&cdn=cn-gotcha208&sign=faa2137579976f9304680a11e9ae91bf&sk=657866af8fc16d8b2b84dfdde3e98143003d0328c8f0c052fd12c7ce2bfbc0dc&p2p_type=1&src=57345&sl=1&free_type=0&pp=rtmp&machinezone=ylf&source=onetier&site=9c6e116b3d6e5af01cb2f70250e485b1&order=1"
      />
    </div>
    // <div className={style.flv_player}>
    //    <div className={style.content}>
    //      <ReFlv
    //       type="flv"
    //       // url="https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv"
    //       // url="ws://localhost:8888/rtsp/1/?url=rtsp://101.132.182.165:8554/test"
    //       url="http://172.16.151.70:7001/live/result.flv"
    //       isLive={true}
    //     />
    //    </div>
    //  </div>
  );
}
