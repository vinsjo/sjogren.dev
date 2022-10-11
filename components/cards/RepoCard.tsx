import type { PartialRepo } from '@utils/misc/github-api';
import { useMemo } from 'react';
import { formatURL } from '@utils/misc';
import styles from './RepoCard.module.css';

const RepoCard = ({
    package_name,
    name,
    description,
    html_url,
    language,
    homepage,
}: PartialRepo) => {
    const homepageDisplay = useMemo(() => {
        return !homepage ? null : formatURL(homepage);
    }, [homepage]);
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <a
                    className={styles.title}
                    href={html_url}
                    target="_blank"
                    rel="noreferrer"
                    title="To GitHub Repository"
                >
                    {package_name || name}
                </a>
                {language && (
                    <p className={styles.language}>
                        <small>Written in {language}</small>
                    </p>
                )}
            </div>
            <div className={styles.bottom}>
                <code className={styles.description}>{description}</code>
                {homepage && homepageDisplay && (
                    <a
                        className={styles.homepage}
                        href={homepage}
                        target="_blank"
                        rel="noreferrer"
                        title="To project homepage"
                    >
                        <code>{homepageDisplay}</code>
                    </a>
                )}
            </div>
        </div>
    );
};

export default RepoCard;
