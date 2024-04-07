import Link from 'next/link';
import styles from './styles.module.css';

import { classNames } from '@/utils/react';

import { PageSection, useVisibleSections } from '@/stores/sectionsStore';

const createLinkProps = <T extends PageSection>(
  section: T,
  label?: string
): { section: T; hash: `#${T}`; label: string } => ({
  section,
  hash: `#${section}`,
  label: label || section,
});

const links = [
  createLinkProps(PageSection.Contact),
  createLinkProps(PageSection.Projects),
  createLinkProps(PageSection.Start, 'To Start'),
] satisfies { section: PageSection; hash: `#${PageSection}`; label: string }[];

export const Navigation: React.FC = () => {
  const visibleSections = useVisibleSections();
  return (
    <>
      {links.map(({ label, hash, section }) => {
        const href = section === PageSection.Start ? '' : hash;
        const hidden = visibleSections[section];
        return (
          <div
            key={`link-${section}`}
            className={classNames(styles.container, styles[section], {
              hidden,
            })}
            hidden={hidden}
          >
            <Link
              href={href}
              className={classNames('title', styles.link)}
              shallow
              onClick={() => {
                window.location.hash = href;
              }}
            >
              {label}
            </Link>
          </div>
        );
      })}
    </>
  );
};
