export default {
  npmClient: 'pnpm',
  routes: [
    { exact: true, path: '/', component: 'index' },
    {
      exact: true,
      path: '/achievements',
      component: 'achievements',
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
  mfsu: false,
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './',
};
