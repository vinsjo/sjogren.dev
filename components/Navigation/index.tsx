import Link from 'next/link';
import styles from './styles.module.css';

import { classNames } from '@/utils/react';

import { PageSection } from '../sections/constants';

const createLinkProps = <T extends PageSection>(
  section: T,
  label?: string
): { section: T; hash: `#${T}`; label: string } => ({
  section,
  hash: `#${section}`,
  label: label || section,
});

const sectionLinks = [
  createLinkProps(PageSection.Contact),
  createLinkProps(PageSection.Projects),
  createLinkProps(PageSection.Start, 'To Start'),
];

export const Navigation: React.FC = () => {
  return (
    <>
      {sectionLinks.map(({ label, hash, section }) => {
        const href = section === PageSection.Start ? '' : hash;
        return (
          <div
            key={`link-${section}`}
            className={classNames(styles.container, styles[section])}
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
