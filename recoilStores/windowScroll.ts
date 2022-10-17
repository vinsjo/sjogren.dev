import { atom, selector } from 'recoil';

export interface WindowScroll {
    scrollX: number;
    scrollY: number;
}

const windowScroll = atom({
    key: 'WindowScrollState',
    default: { scrollX: 0, scrollY: 0 },
});

const windowScrollState = selector({
    key: 'WindowScrollSelector',
    get: ({ get }) => get(windowScroll),
    set: ({ set, get }, scroll: WindowScroll) => {
        const { scrollX, scrollY } = get(windowScroll);
        if (scroll.scrollX === scrollX && scroll.scrollY === scrollY) return;
        set(windowScroll, scroll);
    },
});

export default windowScrollState;
