import { atom } from 'recoil';
import { DeviceType } from '@utils/misc';

const deviceTypeState = atom<DeviceType>({
    key: 'DeviceTypeState',
    default: null,
});

export default deviceTypeState;
