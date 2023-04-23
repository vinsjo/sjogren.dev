import React from 'react';
import { HTMLProps, useEffect, useRef } from 'react';
import { classNames } from '@utils/react';
import styles from './Section.module.css';

import useIntersectionObserver from '@hooks/useIntersectionObserver';
import useDidMount from '@hooks/useDidMount';
import { useSectionsStore, SectionName } from 'stores/sectionsStore';

export type SectionProps = HTMLProps<HTMLDivElement> & { id: SectionName };

const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
};

const { setCurrentSection } = useSectionsStore.getState();

const Section = ({ id, children, className, ...props }: SectionProps) => {
    const ref = useRef<HTMLDivElement>();
    const didMount = useDidMount();
    const { isVisible } = useIntersectionObserver(ref, observerOptions);
    useEffect(() => {
        if (!didMount || !isVisible) return;
        setCurrentSection(id);
    }, [didMount, id, isVisible]);
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

export function createSection<P = Record<string, never>>(
    Component: React.FC<P>,
    sectionProps: SectionProps
): React.FC<P> {
    // eslint-disable-next-line react/display-name
    return (props) => {
        return (
            <Section {...sectionProps}>
                <Component {...props} />
            </Section>
        );
    };
}

export default Section;
