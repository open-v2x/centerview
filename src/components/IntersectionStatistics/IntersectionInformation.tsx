import React, { useEffect } from 'react';
import { useState } from 'react';
import imgVehicle from 'center-src/assets/images/platform_vehicle.png';
import imgSpeed from 'center-src/assets/images/platform_speed.png';
import imgPedestrian from 'center-src/assets/images/platform_pedestrian.png';
import imgCongestion from 'center-src/assets/images/platform_congestion.png';
import { routeInfo } from 'center-src/services/api';
import styles from './index.less';
import classNames from 'classnames';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

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
      icon: imgVehicle,
      name: t('Vehicles (unit)'),
      value: info.vehicleTotal || 0,
      style: intersectionStyle(),
    },
    {
      icon: imgSpeed,
      name: t('Average speed (km/h)'),
      value: info.averageSpeed || 0,
      style: intersectionStyle(),
    },
    {
      icon: imgPedestrian,
      name: t('Pedestrians'),
      value: info.pedestrianTotal || 0,
      style: intersectionStyle(),
    },
    {
      icon: imgCongestion,
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
              <img className={styles.intersection_icon_image} src={icon} />
            </div>
            <div className={classNames(styles.intersection_name, 'f f-a-center')}>{name}：</div>
            <div className={style}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntersectionInformation;
