import { ApiPrefix } from '@/consts';
import axios, { AxiosResponse } from 'axios';

class ApiError extends Error {
  public code: number;
  public data: any;
  constructor(code: number, msg: string, data: any) {
    super(msg);
    this.code = code;
    this.data = data;
  }
}

// complete url
const _u = (url: string) => ApiPrefix + url;

// handle api result. throw ApiError if something is wrong
const _res = <T>(response: AxiosResponse<ResultWrapper<T>>) => {
  if (response.data.code !== 0) {
    throw new ApiError(
      response.data.code,
      response.data.msg,
      response.data.data,
    );
  }
  return response.data.data;
};

export type ResultWrapper<T> = {
  code: number;
  msg: string;
  data: T;
};

type BadgeStatus = {
  scene: string;
  badgeId: number;
  name: string;
  image: string;
  description: string;
  tokens: number;
  claimable: boolean;
  achievementProofs: string[];
  tokensProofs: string[];
};

export async function listBadgeStatus(opts: {
  address: string;
  scenes: string[];
}) {
  const account = opts.address;
  const scenes = opts.scenes.join(',');

  await new Promise((res) => setTimeout(res, 2000));

  const response = await axios({
    method: 'get',
    url: _u(`/api/badges/status?account=${account}&scenes=${scenes}`),
  });

  return _res<BadgeStatus[]>(response);
}
