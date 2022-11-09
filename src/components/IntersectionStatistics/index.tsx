import React, { useRef, useState } from 'react';

import DisplayModal from '../DisplayModal';
import LiveStream from 'center-src/components/ReFlv';
import { Button } from 'antd';
import CloudPoint from '../CloudPoint';

import IntersectionInformation from './IntersectionInformation';
import DeviceOnlineRate from './DeviceOnlineRate';

const IntersectionStatistics: React.FC<{ esn: string }> = ({ esn }) => {
  const cameraModalRef: any = useRef(null);
  const cloudPointModalRef: any = useRef(null);
  const deviceOnlineRateRef: any = useRef(null);

  const [playLiveStream, setPlayLiveStream] = useState<{ url: string; title: string }>({
    url: '',
    title: '',
  });
  const [wsUrl, setWsUrl] = useState('');

  const footer = (
    <div>
      <Button
        onClick={() => {
          const getStream = deviceOnlineRateRef.current?.changeCamera(false);
          setPlayLiveStream(getStream);
        }}
      >
        上一个
      </Button>
      <Button
        onClick={() => {
          const getStream = deviceOnlineRateRef.current?.changeCamera(true);
          setPlayLiveStream(getStream);
        }}
      >
        下一个
      </Button>
    </div>
  );

  const liveStreamFooter = () => {
    const length = deviceOnlineRateRef.current?.cameras?.length;
    return length > 1 ? footer : null;
  };

  const lidarStreamFooter = () => {
    const length = deviceOnlineRateRef.current?.lidars?.length;
    return length > 1 ? footer : null;
  };

  const showLiveStreamCallback = (url: string, title: string) => {
    setPlayLiveStream({ url, title });
    cameraModalRef.current?.handleShowModal();
  };

  const showLiveCloudPointCallback = (url: string) => {
    setWsUrl(url);
    cloudPointModalRef.current?.handleShowModal();
  };

  return (
    <>
      <DeviceOnlineRate
        esn={esn}
        showLiveStream={showLiveStreamCallback}
        showCloudPoint={showLiveCloudPointCallback}
        ref={deviceOnlineRateRef}
      />
      <IntersectionInformation esn={esn} />

      <DisplayModal
        ref={cameraModalRef}
        title={`展示视频 —— ${playLiveStream.title}`}
        width={800}
        component={<LiveStream url={playLiveStream.url} />}
        footer={liveStreamFooter()}
        onCloseCallback={null}
      />

      <DisplayModal
        ref={cloudPointModalRef}
        title={'展示云点图'}
        width={800}
        component={<CloudPoint height={450} width={780} isFixedAspect={true} wsUrl={wsUrl} />}
        footer={lidarStreamFooter()}
        onCloseCallback={null}
      />
    </>
  );
};

export default IntersectionStatistics;
