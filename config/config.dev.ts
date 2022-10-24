// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  define: {
    'process.env.API_SERVER': '/api',
    'process.env.MQTT_URL': 'mqtt://139.196.13.9:15675',
    'process.env.MQTT_PATH': '/mqtt',
    'process.env.MQTT_USERNAME': 'root',
    'process.env.MQTT_PASSWORD': 'abc@1234',
    'process.env.AMAP_KEY': 'a7a90e05a37d3f6bf76d4a9032fc9129',
    'process.env.WEBSOCKET_URL': 'ws://47.100.126.13:8000/ws/127.0.0.1',
  },
});
