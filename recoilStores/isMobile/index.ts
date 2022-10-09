import { selector } from 'recoil';
import deviceTypeState from '@recoil/deviceType';

const isMobileState = selector({
    key: 'IsMobileState',
    get: ({ get }) => {
        const type = get(deviceTypeState);
        return ['mobile', 'tablet'].includes(type);
    },
});

export default isMobileState;
