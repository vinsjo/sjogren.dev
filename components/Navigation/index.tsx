import Link from 'next/link';
import clsx from 'clsx';

import { PageSection } from '../sections/constants';

import styles from './styles.module.css';

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
            className={clsx(styles.container, styles[section])}
          >
            <Link
              href={href}
              className={clsx('title', styles.link)}
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
