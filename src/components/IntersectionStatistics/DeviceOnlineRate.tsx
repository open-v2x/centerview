import React, { useRef } from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useImperativeHandle } from 'react';

import classNames from 'classnames';
import OnlineRatePie from '../OnlineRatePie';
import { getCamerasByRsuEsn, getLidarsByRsuEsn, onlineRate } from 'center-src/services/api';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

import imgRsu from 'center-src/assets/images/platform_rsu.png';
import imgCamera from 'center-src/assets/images/platform_camera.png';
import imgRadar from 'center-src/assets/images/platform_radar.png';
import imgSpat from 'center-src/assets/images/platform_spat.png';

import styles from './index.less';

// 设备在线率
const DeviceOnlineRate = forwardRef(
  (
    {
      esn,
      showLiveStream,
      showCloudPoint,
    }: {
      esn: string;
      showLiveStream: (url: string, title: string) => void;
      showCloudPoint: (wsUrl: string) => void;
    },
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
    const curCameraIndexRef = useRef(0);

    // 雷达
    const [lidars, setLidars] = useState<any>([]);
    const curLidarIndexRef = useRef(0);

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
        fetchLidars();
      }, 5000);
      return () => clearInterval(id);
    }, [fetchCameras, fetchLidars]);

    const handleToLiveStream = () => {
      if (cameras.length) {
        const { streamUrl, name } = cameras[curCameraIndexRef.current];
        showLiveStream?.(streamUrl, name);
      }
    };

    const handleToCloudPoint = () => {
      if (lidars.length) {
        const { wsUrl } = lidars[curLidarIndexRef.current];
        showCloudPoint?.(wsUrl);
      }
    };

    const handleChangeCamera = (isAdd: boolean) => {
      const index = curCameraIndexRef.current;
      if (isAdd) {
        if (index === cameras.length - 1) {
          curCameraIndexRef.current = 0;
        } else {
          curCameraIndexRef.current = index + 1;
        }
      } else {
        if (index === 0) {
          curCameraIndexRef.current = cameras.length - 1;
        } else {
          curCameraIndexRef.current = index - 1;
        }
      }
    };

    const handleChangeLidar = (isAdd: boolean) => {
      const index = curLidarIndexRef.current;
      if (isAdd) {
        if (index === lidars.length - 1) {
          curLidarIndexRef.current = 0;
        } else {
          curLidarIndexRef.current = index + 1;
        }
      } else {
        if (index === 0) {
          curLidarIndexRef.current = lidars.length - 1;
        } else {
          curLidarIndexRef.current = index - 1;
        }
      }
    };

    const getNextCamera = () => handleChangeCamera(true);
    const getPreCamera = () => handleChangeCamera(false);
    const getNextLidar = () => handleChangeLidar(true);
    const getPreLidar = () => handleChangeLidar(false);

    useImperativeHandle(ref, () => ({
      changeCamera: async (isAdd: boolean) => {
        if (isAdd) {
          await getNextCamera();
        } else {
          await getPreCamera();
        }
        const { streamUrl, name } = cameras[curCameraIndexRef.current];
        return { url: streamUrl, title: name };
      },
      cameras: cameras,
      lidars: lidars,
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
              {cameras[curCameraIndexRef.current]?.name || '---'}
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
              {lidars[curLidarIndexRef.current]?.name || '---'}
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
      { icon: imgRsu, name: t('RSU online rate'), value: rateInfo.rsu },
      {
        icon: imgCamera,
        name: t('Camera'),
        value: rateInfo.camera,
        footer: footerCamera,
      },
      { icon: imgRadar, name: t('Radar'), value: rateInfo.radar },
      { icon: imgRadar, name: t('Lidar'), value: rateInfo.lidar, footer: footerLidar },
      { icon: imgSpat, name: t('SPAT'), value: rateInfo.spat },
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
                    <img className={styles.online_image} src={icon} alt="" />
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

export default DeviceOnlineRate;
