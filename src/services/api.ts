import request from './request';

// 登录
export async function login(body: API.LoginParams) {
  return request<API.LoginResult>('/login', {
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

// 站点列表
export async function edgeSiteList(params: API.EdgeSiteSearch) {
  return request<API.ListResult<API.EdgeSiteItem>>(`/edge_nodes`, {
    method: 'get',
    params,
  });
}

// 区域
export async function countries() {
  return request<API.CountriesItem[]>(`/countries`, {
    method: 'get',
    params: { cascade: true },
  });
}

// RSU
export async function rsuDeviceList(nodeId: number, areaCode: string) {
  return request<API.ListResult<API.DeviceListItem>>(`/edge_node_rsus`, {
    method: 'GET',
    params: { nodeId, areaCode, pageNum: 1, pageSize: -1 },
  });
}

// 设备在线率
export async function onlineRate() {
  return request<{ data: API.OnlineRateItem }>(`/homes/online_rate`, {
    method: 'get',
  });
}

// 路口信息
export async function routeInfo(params: { rsuEsn: string }) {
  return request<API.RouteInfoItem>(`/homes/route_info`, {
    method: 'get',
    params,
  });
}

// 下载 MAP 配置
export async function downloadMapConfig(id: number) {
  return request<any>(`/rsus/${id}/map`, {
    method: 'GET',
  });
}

// 根据 rsnId 获取对应绑定的 cameras
export async function getCamerasByRsuEsn(rsuEsn: number | string) {
  return request<any>(`/cameras`, {
    method: 'GET',
    params: {
      rsuEsn,
    },
  });
}
