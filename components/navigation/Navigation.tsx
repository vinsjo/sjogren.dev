import { useCallback } from 'react';
import { classNames } from '@utils/react';
import currentSectionState, {
    sections,
    type SectionName,
} from '@recoil/currentSection';
import { useRecoilState } from 'recoil';
import styles from './Navigation.module.css';

const Navigation = () => {
    const [currentSection, setCurrentSection] =
        useRecoilState(currentSectionState);
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
            <div
                className={classNames(
                    styles.container,
                    styles.contact,
                    currentSection === 'contact' && styles.current
                )}
            >
                <a
                    className={classNames('title', styles.link)}
                    href="contact"
                    onClick={handleClick}
                >
                    Contact
                </a>
            </div>
            <div
                className={classNames(
                    styles.container,
                    styles.projects,
                    currentSection === 'projects' && styles.current
                )}
            >
                <a
                    className={classNames('title', styles.link)}
                    href="projects"
                    onClick={handleClick}
                >
                    Projects
                </a>
            </div>
            <div
                className={classNames(
                    styles.container,
                    styles.start,
                    currentSection === 'start' && styles.current
                )}
            >
                <a
                    className={classNames('title', styles.link)}
                    href="start"
                    onClick={handleClick}
                >
                    To Start
                </a>
            </div>
        </>
    );
};

export default Navigation;
