// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Result = {
    detail: string;
  };

  type ListResult<T> = Result & {
    data: T[];
    total: number;
  };

  type LoginParams = {
    username: string;
    password: string;
  };

  type LoginResult = {
    access_token: string;
    token_type: string;
  };

  type CurrentUser = {
    id?: number;
    is_active?: boolean;
    username?: string;
  };

  type EdgeSiteSearch = {
    name?: string;
    pageNum: number;
    pageSize: number;
  };

  type EdgeSiteItem = {
    id: number;
    name: string;
  };

  type DeviceListItem = {
    id: number;
    name: string;
    esn: string;
    location: {
      lon: number;
      lat: number;
    };
  };

  type OnlineType = {
    online?: number;
    offline?: number;
    notRegister?: number;
  };

  type OnlineRateItem = {
    rsu: OnlineType;
    camera: OnlineType;
    radar: OnlineType;
    lidar: OnlineType;
    spat: OnlineType;
  };

  type RouteInfoItem = {
    vehicleTotal: number;
    averageSpeed: number;
    pedestrianTotal: number;
    congestion: string;
  };

  type CountriesItem = {
    code: string;
    name: string;
    children: County[];
  };

  type OnlineCameras = {
    id: number;
    sn: string;
    name: string;
    streamUrl: string;
  };
}
