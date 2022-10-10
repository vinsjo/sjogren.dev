import { useWindowSize } from '@hooks/recoil';
import { classNames } from '@utils/react';
import { HTMLProps } from 'react';
import styles from './Section.module.css';

export type SectionProps = Omit<HTMLProps<HTMLDivElement>, 'style'>;

const Section = ({ children, className, ...props }: SectionProps) => {
    const { innerWidth: width, innerHeight: height } = useWindowSize();
    return !children ? null : (
        <section
            className={classNames(styles.section, className)}
            style={{ width: width || null, height: height || null }}
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
