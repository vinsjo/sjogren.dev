import { classNames } from '@utils/react';
import Link from 'next/link';
import styles from './Navigation.module.css';

import { SectionName, paths, useCurrentSection } from 'stores/sectionsStore';

const links: { section: SectionName; href: string; text: string }[] = [
    { section: 'contact', href: paths.contact, text: 'Contact' },
    { section: 'projects', href: paths.projects, text: 'Projects' },
    { section: 'start', href: paths.start, text: 'To Start' },
];

const Navigation = () => {
    const currentSection = useCurrentSection();

    return (
        <>
            {links.map(({ href, text, section }) => {
                return (
                    <div
                        key={`link-${section}`}
                        className={classNames(
                            styles.container,
                            styles[section],
                            { hidden: section === currentSection }
                        )}
                        hidden={section === currentSection}
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
