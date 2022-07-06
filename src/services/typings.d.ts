// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Result = {
    msg: string;
  };

  type LoginResult<T> = Result & {
    access_token: string;
    token_type: string;
  };

  type PageResult<T> = Result & {
    data: T;
  };

  type ListResult<T> = Result & {
    data: {
      data: T[];
      total: number;
    };
  };

  type LoginParams = {
    username: string;
    password: string;
  };

  type CurrentUser = {
    username?: string;
    avatar?: string;
  };

  type PageParams = {
    type?: 'all' | 'page';
    pageNum?: number;
    pageSize?: number;
  };

  type DetailParams = {
    id: number | string;
  };
}
