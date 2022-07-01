export type SignedData<T> = {
  timestamp: number;
  address: string;
  rawdata: T;
};

export type ResultWrapper<T> = {
  code: number;
  msg: string;
  data: T;
};

export type BadgeStatus = {
  scene: string;
  status: 'got' | 'not-got' | 'claimed';
};

export enum BadgeType {
  BlackWaterLake = 'black-water-lake',
  ScarletChurch = 'bloody-church',
  MetaverseCarnival = 'the-trip',
}
