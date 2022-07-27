import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import OnlineRatePie from '../OnlineRatePie';
import { onlineRate, routeInfo } from '@/services/api';

import styles from './index.less';

// 设备在线率
const DeviceOnlineRate: React.FC = () => {
  const [rateInfo, setRateInfo] = useState<API.OnlineRateItem>({
    rsu: { online: 0, offline: 0, notRegister: 0 },
    camera: { online: 0, offline: 0, notRegister: 0 },
    radar: { online: 0, offline: 0, notRegister: 0 },
  });

  const fetchOnlineRate = async () => {
    const { data } = await onlineRate();
    setRateInfo(data);
  };

  useEffect(() => {
    fetchOnlineRate();
    const id = setInterval(() => fetchOnlineRate(), 5000);
    return () => clearInterval(id);
  }, []);

  const rateMap = [
    { icon: 'platform_rsu.png', name: t('RSU online rate'), value: rateInfo.rsu },
    { icon: 'platform_camera.png', name: t('Camera'), value: rateInfo.camera },
    { icon: 'platform_radar.png', name: t('Radar'), value: rateInfo.radar },
  ];
  return (
    <div className={styles.online}>
      <div className={styles.rate_title}>{t('Device online rate')}</div>
      <div className={classNames(styles.wrapper, 'f-column')}>
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
          </div>
        ))}
      </div>
    </div>
  );
};

// 路口信息
const IntersectionInformation: React.FC<{ esn: string }> = ({ esn }) => {
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
    <div className={styles.intersection}>
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
  return (
    <>
      <DeviceOnlineRate />
      <IntersectionInformation esn={esn} />
    </>
  );
};

export default IntersectionStatistics;
