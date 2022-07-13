import { extend } from 'umi-request';
import { getToken } from '@/utils/storage';
import { message } from 'antd';
import { clearStorage } from './../utils/storage';
import { history } from 'umi';

const errorHandler = (error: any) => {
  const { response } = error;
  if (response.status === 401) {
    clearStorage();
    history.push('/user/login');
    return Promise.reject(error);
  } else if (response.status != 200) {
    if (response.headers.get('Content-Type').includes('application/json')) {
      response.json().then((res: { detail: string }) => {
        const { detail } = res || {};
        if (detail) {
          message.error(detail);
        }
      });
    } else {
      message.error(response.statusText);
    }
  }
};

const request = extend({
  prefix: `${process.env.API_SERVER}/v1`,
  errorHandler,
});

request.interceptors.request.use((url: string, { params, ...options }: any) => {
  const { current, pageSize, ...param } = params || {};
  if (options.method === 'get') {
    if (current) {
      param.pageNum = current;
    }
    if (pageSize) {
      param.pageSize = pageSize;
    }
  }
  return {
    options: {
      ...options,
      params: param,
      headers: { Authorization: `Bearer ${getToken()}` },
    },
  };
});

export default request;
