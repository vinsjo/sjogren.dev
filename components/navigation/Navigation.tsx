import { classNames } from '@utils/react';
import Link from 'next/link';
import styles from './Navigation.module.css';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import type { SectionName } from '@recoil/sections';

const links: { section: SectionName; href: string; text: string }[] = [
    { section: 'contact', href: '/contact', text: 'Contact' },
    { section: 'projects', href: '/projects', text: 'Projects' },
    { section: 'start', href: '/', text: 'To Start' },
];

const Navigation = () => {
    const { asPath } = useRouter();
    const visibleLinks = useMemo(
        () => links.filter(({ href }) => href !== asPath),
        [asPath]
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
