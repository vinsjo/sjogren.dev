import UAParser from 'ua-parser-js';
import { getWindow } from './window';

export type DeviceType =
  | 'console'
  | 'mobile'
  | 'tablet'
  | 'smarttv'
  | 'wearable'
  | 'embedded';

export type MobileDeviceType = Extract<DeviceType, 'mobile' | 'tablet'>;

export function getDeviceType(): Nullable<DeviceType> {
  const { userAgent } = getWindow().navigator ?? {};

  return !userAgent
    ? null
    : (new UAParser(userAgent).getDevice().type as DeviceType) || null;
}

const mobileDeviceTypes = new Set<MobileDeviceType>(['mobile', 'tablet']);

export function isMobileDeviceType(type: unknown): type is MobileDeviceType {
  return (mobileDeviceTypes as Set<unknown>).has(type);
}
