import React from 'react';
import { history, useModel } from 'umi';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import classNames from 'classnames';
import { SelectLang } from 'center-src/components/SelectLang';
import { login } from 'center-src/services/api';
import { setToken } from 'center-src/utils/storage';
import imgUser from 'center-src/assets/images/login_user.png';
import imgPwd from 'center-src/assets/images/login_password.png';
import styles from './index.less';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    const { access_token: token } = await login(values);
    setToken(token);
    await fetchUserInfo();
    if (!history) return;
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.replace(redirect || '/');
  };

  return (
    <div className={classNames(styles.container, 'f f-j-end f-a-center')}>
      <div className={styles.lang} data-lang>
        <SelectLang />
      </div>
      <LoginForm
        logo={<>{t('OpenV2X Central Portal')}</>}
        onFinish={async (values) => {
          await handleSubmit(values as API.LoginParams);
        }}
      >
        <p>{t('Platform Login')}</p>
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <img src={imgUser} />,
          }}
          placeholder={t('Username')}
          rules={[{ required: true, message: t('Please input your username') }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <img src={imgPwd} />,
          }}
          placeholder={t('Password')}
          rules={[{ required: true, message: t('Please input your password') }]}
        />
      </LoginForm>
    </div>
  );
};

export default Login;
