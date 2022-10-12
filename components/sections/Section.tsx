import { HTMLProps, useEffect, useRef } from 'react';
import { classNames } from '@utils/react';
import styles from './Section.module.css';
import type { SectionName } from '@recoil/currentSection';
import currentSectionState from '@recoil/currentSection';
import useIntersectionObserver from '@hooks/useIntersectionObserver';
import { useSetRecoilState } from 'recoil';
import useDidMount from '@hooks/useDidMount';

export type SectionProps = HTMLProps<HTMLDivElement> & { id: SectionName };

const observerOptions: IntersectionObserverInit = {
    threshold: 0.2,
};

const Section = ({ id, children, className, ...props }: SectionProps) => {
    const ref = useRef<HTMLDivElement>();
    const didMount = useDidMount();
    const setCurrentSection = useSetRecoilState(currentSectionState);
    const { isVisible } = useIntersectionObserver(ref, observerOptions);
    useEffect(() => {
        if (!didMount || !isVisible) return;
        setCurrentSection(id);
    }, [didMount, id, isVisible, setCurrentSection]);
    return (
        <section
            ref={ref}
            className={classNames(styles.section, className)}
            id={id}
            {...props}
        >
            {children}
        </section>
    );
};

export default Section;
