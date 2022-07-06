import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  headerHeight: 80,
  title: 'OpenV2X Central Portal',
  primaryColor: '#1890ff',
  fixedHeader: false,
  pwa: false,
  colorWeak: false,
};

export default Settings;
