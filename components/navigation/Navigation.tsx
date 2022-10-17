import { classNames } from '@utils/react';
import Link from 'next/link';
import styles from './Navigation.module.css';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import currentSectionState, { paths, type SectionName } from '@recoil/sections';
import { useRecoilValue } from 'recoil';

const links: { section: SectionName; href: string; text: string }[] = [
    { section: 'contact', href: paths.contact, text: 'Contact' },
    { section: 'projects', href: paths.projects, text: 'Projects' },
    { section: 'start', href: paths.start, text: 'To Start' },
];

const Navigation = () => {
    const currentSection = useRecoilValue(currentSectionState);
    const visibleLinks = useMemo(
        () => links.filter(({ section }) => section !== currentSection),
        [currentSection]
    );
    return (
        <>
            {visibleLinks.map(({ href, text, section }) => {
                return (
                    <div
                        key={`link-${section}`}
                        className={classNames(
                            styles.container,
                            styles[section]
                        )}
                    >
                        <Link href={href} shallow={true}>
                            <a className={classNames('title', styles.link)}>
                                {text}
                            </a>
                        </Link>
                    </div>
                );
            })}
        </>
    );
};

export default Navigation;
