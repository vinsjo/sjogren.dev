import { useCallback, useMemo } from 'react';
import { classNames } from '@utils/react';
import currentSectionState, { type SectionName } from '@recoil/currentSection';
import { useRecoilState } from 'recoil';
import styles from './Navigation.module.css';

const links: { section: SectionName; text: string }[] = [
    { section: 'contact', text: 'Contact' },
    { section: 'projects', text: 'Projects' },
    { section: 'start', text: 'To Start' },
];

const Navigation = () => {
    const [currentSection, setCurrentSection] =
        useRecoilState(currentSectionState);

    const visibleLinks = useMemo(() => {
        return links.filter(({ section }) => section !== currentSection);
    }, [currentSection]);

    const handleClick = useCallback(
        (ev: React.MouseEvent<HTMLAnchorElement>) => {
            ev.preventDefault();
            const { href } = ev.currentTarget;
            const section = href.slice(href.lastIndexOf('/') + 1);
            if (section === currentSection) return;
            setCurrentSection(section as SectionName);
        },
        [currentSection, setCurrentSection]
    );
    return (
        <>
            {visibleLinks.map(({ section, text }) => {
                return (
                    <div
                        key={`link-${section}`}
                        className={classNames(
                            styles.container,
                            styles[section]
                        )}
                    >
                        <a
                            className={classNames('title', styles.link)}
                            href={section}
                            onClick={handleClick}
                        >
                            {text}
                        </a>
                    </div>
                );
            })}
        </>
    );
};

export default Navigation;
