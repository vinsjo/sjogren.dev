import { classNames } from '@utils/react';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import styles from './Navigation.module.css';
import currentPathState from '@recoil/currentPath';
import type { SectionName } from '@recoil/sections';
import { useMemo } from 'react';

const links: { section: SectionName; href: string; text: string }[] = [
    { section: 'contact', href: '/contact', text: 'Contact' },
    { section: 'projects', href: '/projects', text: 'Projects' },
    { section: 'start', href: '/', text: 'To Start' },
];

const Navigation = () => {
    const currentPath = useRecoilValue(currentPathState);
    const visibleLinks = useMemo(
        () => links.filter(({ href }) => href !== currentPath),
        [currentPath]
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
