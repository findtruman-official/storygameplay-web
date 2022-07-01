export default {
  npmClient: 'pnpm',
  routes: [
    {
      path: '/',
      component: '@/providers/WalletProvider/index',
      routes: [
        {
          path: '/',
          component: '@/layouts/BannerLayout',
          routes: [
            { exact: true, path: '/', component: 'index' },
            {
              exact: true,
              path: '/achievements',
              component: 'achievements',
            },
          ],
        },
      ],
    },
  ],
  history: {
    type: 'hash',
  },
  proxy: {
    '/api': {
      target: 'http://10.243.248.69:3301/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
};
