export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/site',
    component: './EdgeSite',
  },
  {
    path: '/cloud',
    component: './CloudPlatform',
  },
  {
    path: '/map',
    component: './IntersectionMap',
  },
  {
    path: '/',
    redirect: '/site',
  },
  {
    path: '/cloud_lidar',
    component: './CloudLidar',
  },
  {
    component: './404',
  },
];
