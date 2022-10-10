import { useIsMobile, useWindowSize } from '@hooks/recoil';
import { classNames } from '@utils/react';
import { HTMLProps, useMemo } from 'react';
import styles from './Section.module.css';

export type SectionProps = HTMLProps<HTMLDivElement>;

const Section = ({ children, className, ...props }: SectionProps) => {
    const mobile = useIsMobile();
    const { innerWidth, innerHeight } = useWindowSize();
    const maxSize = useMemo(() => {
        if (!mobile || !innerWidth || !innerHeight) return null;
        return { maxWidth: innerWidth, maxHeight: innerHeight };
    }, [mobile, innerWidth, innerHeight]);
    return !children ? null : (
        <section
            className={classNames(styles.section, className)}
            style={maxSize}
            {...props}
        >
            {children}
        </section>
    );
};
export function createSection<T extends JSX.Element, P>(
    Component: (props: P) => T,
    sectionProps?: Omit<SectionProps, 'children'>
) {
    if (!sectionProps) sectionProps = {};
    // eslint-disable-next-line react/display-name
    return (props: P) => {
        return (
            <Section {...sectionProps}>
                <Component {...props} />
            </Section>
        );
    };
}

export default Section;
