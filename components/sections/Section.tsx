import clsx from 'clsx';
import styles from './Section.module.css';

import { PageSection } from './constants';

export type SectionProps = Omit<React.HTMLProps<HTMLDivElement>, 'ref'> & {
  id: PageSection;
};

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className,
  ...props
}) => {
  return (
    <section className={clsx(styles.section, className)} id={id} {...props}>
      {children}
    </section>
  );
};

export function createSection<P extends object>(
  Component: React.ComponentType<P>,
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
