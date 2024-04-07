import React, { useMemo } from 'react';
import { HTMLProps, useEffect, useRef } from 'react';
import { classNames } from '@/utils/react';
import styles from './Section.module.css';

import { useSectionsStore, PageSection } from 'stores/sectionsStore';
import { useIntersectionObserver } from 'usehooks-ts';

export type SectionProps = Omit<HTMLProps<HTMLDivElement>, 'ref'> & {
  id: PageSection;
};

const observerOptions: IntersectionObserverInit = {
  threshold: Array(9)
    .fill(0)
    .map((_, i) => 0.1 * (i + 1)),
};

const { setVisible } = useSectionsStore.getState();

export const Section = ({
  id,
  children,
  className,
  ...props
}: SectionProps) => {
  const ref = useRef<HTMLDivElement>();
  const entry = useIntersectionObserver(ref, observerOptions);

  const coverage = useMemo(() => {
    if (!entry?.intersectionRect?.height || !entry?.rootBounds?.height)
      return 0;
    const height = entry.intersectionRect.height;
    const rootHeight = entry.rootBounds.height;
    return height / rootHeight;
  }, [entry?.rootBounds?.height, entry?.intersectionRect?.height]);

  useEffect(() => setVisible(id, coverage >= 0.6), [id, coverage]);

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
