import { HTMLProps } from 'react';
import { classNames } from '@utils/react';
import styles from './Section.module.css';
import type { SectionName } from '@recoil/sections';
import React from 'react';

export type SectionProps = HTMLProps<HTMLDivElement> & { id: SectionName };

// eslint-disable-next-line react/display-name
const Section = React.forwardRef<HTMLDivElement, SectionProps>(
    ({ id, children, className, ...props }, ref) => {
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
    }
);

// const observerOptions: IntersectionObserverInit = {
//     threshold: 0.2,
// };

// const Section = ({ id, children, className, ...props }: SectionProps) => {
//     const ref = useRef<HTMLDivElement>();
//     const didMount = useDidMount();
//     const setCurrentSection = useSetRecoilState(currentSectionState);
//     const { isVisible } = useIntersectionObserver(ref, observerOptions);
//     useEffect(() => {
//         if (!didMount || !isVisible) return;
//         setCurrentSection(id);
//     }, [didMount, id, isVisible, setCurrentSection]);
//     return (
//         <section
//             ref={ref}
//             className={classNames(styles.section, className)}
//             id={id}
//             {...props}
//         >
//             {children}
//         </section>
//     );
// };

export function createSection<P = {}>(
    Component: (props: P) => JSX.Element,
    sectionProps: SectionProps
) {
    // eslint-disable-next-line react/display-name
    return React.forwardRef<HTMLDivElement, P>((props, ref) => {
        return (
            <Section {...sectionProps} ref={ref}>
                <Component {...props} />
            </Section>
        );
    });
}

export default Section;
