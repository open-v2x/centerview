import React from 'react';
import RoadImage from './RoadImage';

import styles from './index.less';

const RoadMap: React.FC<{ esn: string; nodeId: string }> = ({ esn, nodeId }) => {
  return (
    <div className={styles.map_wrapper}>
      <div className={styles.box}>
        <img className={styles.box_map} src="/assets/images/map_bg.jpg" alt="" />
        <RoadImage esn={esn} nodeId={nodeId} />
      </div>
    </div>
  );
};

export default RoadMap;
