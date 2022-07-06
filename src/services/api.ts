import request from './request';

// 登录
export async function login(body: API.LoginParams) {
  return request<API.LoginResult<string>>('/login', {
    method: 'POST',
    data: body,
  });
}

// 获取登录用户信息
export async function currentUser() {
  return request<API.CurrentUser>('/users/me', {
    method: 'GET',
  });
}

// 区域
export async function countries() {
  return request(`/countries`, {
    method: 'get',
    params: { cascade: true },
  });
}

// RSU
export async function rsuDeviceList(areaCode: string) {
  return request(`/rsus`, {
    method: 'GET',
    params: { areaCode, pageSize: -1 },
  });
}

// 设备在线率
export async function onlineRate() {
  return request(`/homes/online_rate`, {
    method: 'get',
  });
}

// 路口信息
export async function routeInfo(params: { rsuEsn: string }) {
  return request(`/homes/route_info`, {
    method: 'get',
    params,
  });
}

// 下载 MAP 配置
export async function downloadMapConfig(id: number) {
  return request<API.PageResult<any>>(`/rsus/${id}/map`, {
    method: 'GET',
  });
}
