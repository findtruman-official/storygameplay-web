import { createFromIconfontCN } from '@ant-design/icons';

export const DEV_MODE = process.env.NODE_ENV === 'development';

export const getConicalSpiral = (t: number, radius: number, height: number) => {
  return [-radius * Math.cos(t), -height * t, radius * Math.sin(t)];
};

export const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3385897_341fnmqjnep.js',
});

export * from './clipboard';
export * from './web3';
