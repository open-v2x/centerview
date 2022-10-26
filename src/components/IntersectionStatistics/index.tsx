import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import OnlineRatePie from '../OnlineRatePie';
import { getCamerasByRsuEsn, getLidarsByRsuEsn, onlineRate, routeInfo } from '@/services/api';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import styles from './index.less';
import DisplayModal from '../DisplayModal';
import LiveStream from '@/components/ReFlv';
import { Button } from 'antd';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import CloudPoint from '../CloudPoint';

// 设备在线率
const DeviceOnlineRate = forwardRef(
  (
    {
      esn,
      showLiveStream,
      showCloudPoint,
    }: { esn: string; showLiveStream: (url: string) => void; showCloudPoint: () => void },
    ref,
  ) => {
    const [show, setShow] = useState(true);
    const [rateInfo, setRateInfo] = useState<API.OnlineRateItem>({
      rsu: { online: 0, offline: 0, notRegister: 0 },
      camera: { online: 0, offline: 0, notRegister: 0 },
      radar: { online: 0, offline: 0, notRegister: 0 },
      lidar: { online: 0, offline: 0, notRegister: 0 },
      spat: { online: 0, offline: 0, notRegister: 0 },
    });

    // 摄像头
    const [cameras, setCameras] = useState<API.OnlineCameras[]>([]);
    const [curCameraIndex, setCameraIndex] = useState(0);

    // 雷达
    const [lidars, setLidars] = useState<[]>([]);
    const [curLidarIndex, setLidarIndex] = useState(0);

    const fetchOnlineRate = async () => {
      const { data } = await onlineRate();
      setRateInfo(data);
    };

    const fetchCameras = useCallback(async () => {
      const { data } = await getCamerasByRsuEsn(esn);
      setCameras(data);
    }, [esn]);

    const fetchLidars = useCallback(async () => {
      const { data } = await getLidarsByRsuEsn(esn);
      setLidars(data);
    }, [esn]);

    useEffect(() => {
      fetchOnlineRate();
      fetchCameras();
      fetchLidars();
      const id = setInterval(() => {
        fetchOnlineRate();
        fetchCameras();
      }, 5000);
      return () => clearInterval(id);
    }, [fetchCameras, fetchLidars]);

    const handleToLiveStream = () => {
      if (cameras.length) {
        showLiveStream?.(cameras[curCameraIndex].streamUrl);
      }
    };

    const handleToCloudPoint = () => {
      if (lidars.length) {
        showCloudPoint?.();
      }
    };

    const handleChangeIndex = (isAdd: boolean, arr: any[], index: number, setFunc: any) => {
      if (isAdd) {
        if (index === arr.length - 1) {
          setFunc(0);
        } else {
          setFunc(index + 1);
        }
      } else {
        if (index === 0) {
          setFunc(arr.length - 1);
        } else {
          setFunc(index - 1);
        }
      }
    };

    const getNextCamera = () => handleChangeIndex(true, cameras, curCameraIndex, setCameraIndex);
    const getPreCamera = () => handleChangeIndex(false, cameras, curCameraIndex, setCameraIndex);
    const getNextLidar = () => handleChangeIndex(true, lidars, curLidarIndex, setLidarIndex);
    const getPreLidar = () => handleChangeIndex(false, lidars, curLidarIndex, setLidarIndex);

    useImperativeHandle(ref, () => ({
      changeCamera: (isAdd: boolean) => {
        if (isAdd) {
          getNextCamera();
        } else {
          getPreCamera();
        }
        return cameras[curCameraIndex]?.streamUrl;
      },
    }));

    const footerCamera = () => {
      return (
        <div className={classNames(styles.font_change_name, 'f f-a-center')}>
          <div className={classNames(styles.footer, 'f f-a-center')}>
            <span>摄像头：</span>
            <span
              className={classNames(styles.cursor_pointer, styles.mr_10)}
              onClick={() => handleToLiveStream()}
            >
              {cameras[curCameraIndex]?.name || '---'}
            </span>
          </div>
          {cameras.length > 1 && (
            <div className={classNames(styles.font_change_name_icon, 'f f-column f-a-center')}>
              <CaretUpOutlined onClick={getPreCamera} />
              <CaretDownOutlined onClick={getNextCamera} />
            </div>
          )}
        </div>
      );
    };

    const footerLidar = () => {
      return (
        <div className={classNames(styles.font_change_name, 'f f-a-center')}>
          <div className={classNames(styles.footer, 'f f-a-center')}>
            <span>查看雷达云点：</span>
            <span
              className={classNames(styles.cursor_pointer, styles.mr_10)}
              onClick={() => handleToCloudPoint()}
            >
              {lidars[curLidarIndex]?.name || '---'}
            </span>
          </div>
          {lidars.length > 1 && (
            <div className={classNames(styles.font_change_name_icon, 'f f-column f-a-center')}>
              <CaretUpOutlined onClick={getPreLidar} />
              <CaretDownOutlined onClick={getNextLidar} />
            </div>
          )}
        </div>
      );
    };

    const rateMap = [
      { icon: 'platform_rsu.png', name: t('RSU online rate'), value: rateInfo.rsu },
      {
        icon: 'platform_camera.png',
        name: t('Camera'),
        value: rateInfo.camera,
        footer: footerCamera,
      },
      { icon: 'platform_radar.png', name: t('Radar'), value: rateInfo.radar },
      { icon: 'platform_radar.png', name: t('Lidar'), value: rateInfo.lidar, footer: footerLidar },
      { icon: 'platform_camera.png', name: t('SPAT'), value: rateInfo.spat },
    ];

    return (
      <div>
        <div className={classNames(styles.online, show ? styles.show : styles.hide)}>
          <a className={styles.left_icon} onClick={() => setShow(!show)}>
            {show ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </a>
          <div className={styles.rate_title}>{t('Device online rate')}</div>
          <div className={classNames(styles.rate_content, styles.wrapper)}>
            {rateMap.map(
              ({ icon, name, value: { online = 0, offline = 0, notRegister = 0 }, footer }) => (
                <div key={name as string} className={classNames(styles.wrapper, 'f-column')}>
                  <div className="f f-a-center">
                    <img className={styles.online_image} src={`/assets/images/${icon}`} alt="" />
                    <div className={classNames(styles.online_statistics, 'f f-a-center')}>
                      {name}:
                      <div className={styles.online_statistics_value}>
                        {online && Math.floor((online / (online + offline)) * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className={styles.chart_wrapper}>
                    <OnlineRatePie value={{ online, offline, notRegister }} />
                  </div>
                  {footer && footer()}
                </div>
              ),
            )}
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
  const cameraModalRef: any = useRef(null);
  const cloudPointModalRef: any = useRef(null);
  const deviceOnlineRateRef: any = useRef(null);

  const [playLiveStreamUrl, setPlayLiveStreamUrl] = useState('');

  const liveStreamFooter = () => {
    return cameraModalRef.current?.cameras?.length > 1 ? (
      <div>
        <Button
          onClick={() => {
            const getUrl = deviceOnlineRateRef.current?.changeCamera(false);
            setPlayLiveStreamUrl(getUrl);
          }}
        >
          上一个
        </Button>
        <Button
          onClick={() => {
            const getUrl = deviceOnlineRateRef.current?.changeCamera(true);
            setPlayLiveStreamUrl(getUrl);
          }}
        >
          下一个
        </Button>
      </div>
    ) : null;
  };

  const showLiveStreamCallback = (url: string) => {
    setPlayLiveStreamUrl(url);
    cameraModalRef.current?.handleShowModal();
  };

  const showLiveCloudPointCallback = () => {
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
        title={'展示视频'}
        width={800}
        component={<LiveStream url={playLiveStreamUrl} />}
        footer={liveStreamFooter()}
        onCloseCallback={null}
      />

      <DisplayModal
        ref={cloudPointModalRef}
        title={'展示云点图'}
        width={800}
        component={<CloudPoint height={450} width={780} isFixedAspect={true} />}
        footer={null}
        onCloseCallback={null}
      />
    </>
  );
};

export default IntersectionStatistics;
