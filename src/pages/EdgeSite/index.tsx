import React from 'react';
import { history } from 'umi';
import classNames from 'classnames';
import { ProList } from '@ant-design/pro-list';
import PlatformHeader from '@/components/PlatformHeader';

import styles from './index.less';

const EdgeSite: React.FC = () => {
  return (
    <div className="cloud_platform f-column">
      <PlatformHeader position="relative" />
      <div className={classNames('f-column f-a-center', styles.edge_site)}>
        <div className={styles.wrapper}>
          <div className={styles.wrapper_desc}>
            <p>{t('Please select an edge location')}</p>
            <div
              dangerouslySetInnerHTML={{
                __html: t('EDGE_SITE_TIPS', {
                  value: `<span>${t('Go to [Regional Edge Portal]')}</span>`,
                }),
              }}
            />
          </div>
          <ProList
            size="large"
            search={{ labelWidth: 114, span: 12 }}
            form={{
              size: 'large',
              submitter: {
                submitButtonProps: { style: { width: '88px' } },
                resetButtonProps: { style: { display: 'none' } },
              },
            }}
            request={async () => ({
              // params = {}
              data: Array.from({ length: 18 }, (itme, index) => ({
                id: index + 1,
                name: `站点名称 ${index + 1}`,
              })),
              page: 1,
              total: 18,
              success: true,
            })}
            pagination={{ pageSize: 10 }}
            metas={{
              title: {
                dataIndex: 'name',
                title: t('Edge Site Name'),
              },
              actions: {
                render: (...[, { id }]) => {
                  return [
                    <a
                      key="cloud"
                      onClick={() => history.push({ pathname: '/cloud', query: { id: `${id}` } })}
                    >
                      {t('Go to [Regional Edge Portal]')}
                      <img src="/assets/images/navigate.png" alt="" />
                    </a>,
                  ];
                },
                search: false,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EdgeSite;
