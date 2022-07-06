import React from 'react';
import { history } from 'umi';
import { Button, Result } from 'antd';

const NoFoundPage: React.FC = () => {
  return (
    <Result
      style={{ paddingTop: '100px' }}
      status="404"
      title="404"
      subTitle={<>{t('Sorry, the page you visited does not exist')}</>}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {t('Back to home')}
        </Button>
      }
    />
  );
};

export default NoFoundPage;
