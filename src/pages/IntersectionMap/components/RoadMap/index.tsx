import React from 'react';
import RoadImage from './RoadImage';

import styles from './index.less';

const RoadMap: React.FC<{ esn: string }> = ({ esn }) => {
  return (
    <div className={styles.map_wrapper}>
      <div className={styles.box}>
        <img className={styles.box_map} src="/assets/images/map_bg.jpg" alt="" />
        <RoadImage esn={esn} />
      </div>
    </div>
  );
};

export default RoadMap;
