import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import OnlineRatePie from '../OnlineRatePie';
import { getCamerasByRsuEsn, onlineRate, routeInfo } from '@/services/api';
import {
  CaretLeftOutlined,
  CaretRightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import DisplayModal from '../DisplayModal';
import LiveStream from '@/pages/LiveStream';
import { Button } from 'antd';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';

// 设备在线率
const DeviceOnlineRate = forwardRef(
  ({ esn, showLiveStream }: { esn: string; showLiveStream: (url: string) => void }, ref) => {
    const [show, setShow] = useState(true);
    const [rateInfo, setRateInfo] = useState<API.OnlineRateItem>({
      rsu: { online: 0, offline: 0, notRegister: 0 },
      camera: { online: 0, offline: 0, notRegister: 0 },
      radar: { online: 0, offline: 0, notRegister: 0 },
      lidar: { online: 0, offline: 0, notRegister: 0 },
    });
    const [cameras, setCameras] = useState<API.OnlineCameras[]>([]);
    const [curCameraIndex, setCameraIndex] = useState(0);

    const fetchOnlineRate = async () => {
      const { data } = await onlineRate();
      setRateInfo(data);
    };

    const fetchCameras = async () => {
      const { data } = await getCamerasByRsuEsn(esn);
      setCameras(data);
    };

    useEffect(() => {
      fetchOnlineRate();
      fetchCameras();
      const id = setInterval(() => {
        fetchOnlineRate();
        fetchCameras();
      }, 5000);
      return () => clearInterval(id);
    }, []);

    const toCamera = () => {
      if (cameras.length) {
        showLiveStream?.(cameras[curCameraIndex].streamUrl);
      }
    };

    const handleChangeIndex = (isAdd: boolean) => {
      if (isAdd) {
        if (curCameraIndex === cameras.length - 1) {
          setCameraIndex(0);
        } else {
          setCameraIndex(curCameraIndex + 1);
        }
      } else {
        if (curCameraIndex === 0) {
          setCameraIndex(cameras.length - 1);
        } else {
          setCameraIndex(curCameraIndex - 1);
        }
      }
    };

    useImperativeHandle(ref, () => ({
      getNextCamera: (isAdd: boolean) => {
        handleChangeIndex(isAdd);
        return cameras[curCameraIndex]?.streamUrl;
      },
    }));

    const rateMap = [
      { icon: 'platform_rsu.png', name: t('RSU online rate'), value: rateInfo.rsu },
      { icon: 'platform_camera.png', name: t('Camera'), value: rateInfo.camera },
      { icon: 'platform_radar.png', name: t('Radar'), value: rateInfo.radar },
      { icon: 'platform_radar.png', name: t('Lidar'), value: rateInfo.lidar },
    ];

    return (
      <div>
        <div className={classNames(styles.online, show ? styles.show : styles.hide)}>
          <a className={styles.left_icon} onClick={() => setShow(!show)}>
            {show ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </a>
          <div className={styles.rate_title}>{t('Device online rate')}</div>
          <div className={classNames(styles.rate_content, styles.wrapper)}>
            {rateMap.map(({ icon, name, value: { online = 0, offline = 0, notRegister = 0 } }) => (
              <div key={name as string} className={classNames(styles.wrapper, 'f-column')}>
                <div className="f f-a-center">
                  <img className={styles.online_image} src={`/assets/images/${icon}`} alt="" />
                  <div className={classNames(styles.online_statistics, 'f f-a-center')}>
                    <div>{name}：</div>
                    <div className={styles.online_statistics_value}>
                      {online && Math.floor((online / (online + offline)) * 100)}%
                    </div>
                  </div>
                </div>
                <div className={styles.chart_wrapper}>
                  <OnlineRatePie value={{ online, offline, notRegister }} />
                </div>
                {name === t('Camera') && (
                  <div className={styles.camera_address}>
                    <div>
                      摄像头：
                      <span onClick={() => toCamera()}>
                        {cameras[curCameraIndex]?.name || '---'}
                      </span>
                    </div>
                    {cameras.length > 0 && (
                      <div className="f f-a-center">
                        <CaretLeftOutlined onClick={() => handleChangeIndex(false)} />
                        <CaretRightOutlined onClick={() => handleChangeIndex(true)} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
);

// 路口信息
const IntersectionInformation: React.FC<{ esn: string }> = ({ esn }) => {
  const [show, setShow] = useState(true);
  const [info, setInfo] = useState<API.RouteInfoItem>({
    vehicleTotal: 0,
    averageSpeed: 0,
    pedestrianTotal: 0,
    congestion: '',
  });

  const fetchRouteInfo = async () => {
    const res = await routeInfo({ rsuEsn: esn });
    setInfo(res);
  };

  useEffect(() => {
    fetchRouteInfo();
    const id = setInterval(() => fetchRouteInfo(), 5000);
    return () => clearInterval(id);
  }, []);

  const intersectionStyle = (style = styles.intersection_number) => classNames(style, 'f-middle');
  const congestionMap = {
    'free flow': t('Free flow'),
    congestion: t('Congestion'),
  };
  const intersectionMap = [
    {
      icon: 'platform_vehicle.png',
      name: t('Vehicles (unit)'),
      value: info.vehicleTotal || 0,
      style: intersectionStyle(),
    },
    {
      icon: 'platform_speed.png',
      name: t('Average speed (km/h)'),
      value: info.averageSpeed || 0,
      style: intersectionStyle(),
    },
    {
      icon: 'platform_pedestrian.png',
      name: t('Pedestrians'),
      value: info.pedestrianTotal || 0,
      style: intersectionStyle(),
    },
    {
      icon: 'platform_congestion.png',
      name: t('Congestion situation'),
      value: congestionMap[info.congestion] || '',
      style: intersectionStyle(styles.intersection_value),
    },
  ];
  return (
    <div className={classNames(styles.intersection, show ? styles.show : styles.hide)}>
      <a className={styles.right_icon} onClick={() => setShow(!show)}>
        {show ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </a>
      <div className={styles.rate_title}>{t('Intersection information')}</div>
      <div className={classNames(styles.wrapper, 'f-column f-j-between')}>
        {intersectionMap.map(({ icon, name, value, style }) => (
          <div key={name as string} className={classNames(styles.information_item, 'f')}>
            <div className={classNames(styles.intersection_icon, 'f-middle')}>
              <img className={styles.intersection_icon_image} src={`/assets/images/${icon}`} />
            </div>
            <div className={classNames(styles.intersection_name, 'f f-a-center')}>{name}：</div>
            <div className={style}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IntersectionStatistics: React.FC<{ esn: string }> = ({ esn }) => {
  const cameraModalRef = useRef(null);
  const deviceOnlineRateRef = useRef(null);

  const [playLiveStreamUrl, setPlayLiveStreamUrl] = useState('');

  const liveStreamFooter = () => {
    return (
      <div>
        <Button
          onClick={() => {
            const getUrl = deviceOnlineRateRef.current?.getNextCamera(false);
            setPlayLiveStreamUrl(getUrl);
          }}
        >
          上一个
        </Button>
        <Button
          onClick={() => {
            const getUrl = deviceOnlineRateRef.current?.getNextCamera(true);
            setPlayLiveStreamUrl(getUrl);
          }}
        >
          下一个
        </Button>
      </div>
    );
  };

  const showLiveStreamCallback = (url: string) => {
    setPlayLiveStreamUrl(url);
    cameraModalRef.current?.handleShowModal();
  };

  return (
    <>
      <DeviceOnlineRate
        esn={esn}
        showLiveStream={showLiveStreamCallback}
        ref={deviceOnlineRateRef}
      />
      <IntersectionInformation esn={esn} />

      <DisplayModal
        ref={cameraModalRef}
        title={'展示视频'}
        width={800}
        component={<LiveStream url={playLiveStreamUrl} />}
        footer={liveStreamFooter()}
        onCloseCallback={null}
      />
    </>
  );
};

export default IntersectionStatistics;
