import React from 'react';
import classNames from 'classnames';
import RightContent from '../RightContent';

import styles from './index.less';

type PlatformHeaderProps = {
  back?: boolean;
  position?: 'absolute' | 'relative';
  children?: React.ReactNode;
};

const BackButton = () => {
  return (
    <div className={classNames(styles.right_back, 'f-middle')} onClick={() => history.back()}>
      {t('Back')}
    </div>
  );
};

const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  back = false,
  position = 'absolute',
  children,
}) => {
  return (
    <div className={classNames('header', styles.header)} style={{ position }}>
      <img className={styles.header_image} src="/assets/images/platform_head.png" alt="" />
      <div className={classNames('f f-middle', styles.header_title)}>
        {t('OpenV2X Central Portal')}
      </div>
      <div className={classNames('f f-a-center', styles.header_left)}>{children}</div>
      <div className={classNames('f f-a-center', styles.header_right)}>
        {back && <BackButton />}
        <RightContent />
      </div>
    </div>
  );
};

export default PlatformHeader;
