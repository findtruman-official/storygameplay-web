export default {
  npmClient: 'pnpm',
  routes: [
    {
      path: '/',
      component: '@/providers/WalletProvider/index',
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
  history: {
    type: 'hash',
  },
  proxy: {
    '/fcc/api': {
      target: 'https://findtruman.io/',
      changeOrigin: true,
      pathRewrite: { '^/fcc/api': '/fcc/api' },
    },
  },
  publicPath: '/',
};
