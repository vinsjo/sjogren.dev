import { atom } from 'recoil';

export type DeviceTypeState =
    | null
    | 'console'
    | 'mobile'
    | 'tablet'
    | 'smarttv'
    | 'wearable'
    | 'embedded';

const deviceTypeState = atom<DeviceTypeState>({
    key: 'DeviceTypeState',
    default: null,
});

export default deviceTypeState;
