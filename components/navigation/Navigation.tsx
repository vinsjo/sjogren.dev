import { classNames } from '@utils/react';
import Link from 'next/link';
import styles from './Navigation.module.css';

import { SectionName, useVisibleSections } from 'stores/sectionsStore';

const createLinkProps = <T extends SectionName>(
  section: T,
  label?: string
): { section: T; hash: `#${T}`; label: string } => ({
  section,
  hash: `#${section}`,
  label: label || section,
});

const links = [
  createLinkProps(SectionName.Contact),
  createLinkProps(SectionName.Projects),
  createLinkProps(SectionName.Start, 'To Start'),
] satisfies { section: SectionName; hash: `#${SectionName}`; label: string }[];

const Navigation = () => {
  const visibleSections = useVisibleSections();
  return (
    <>
      {links.map(({ label, hash, section }) => {
        const href = section === SectionName.Start ? '' : hash;
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

export default Navigation;
