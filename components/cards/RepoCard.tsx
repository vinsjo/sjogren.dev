import { useMemo } from 'react';
import { formatURL } from '@utils/misc';
import type { PartialRepo } from '@utils/api/github-api';
import Link from '@components/links/Link';
import styles from './RepoCard.module.css';

const RepoCard = ({
    package_name,
    name,
    description,
    html_url,
    language,
    homepage,
}: PartialRepo) => {
    const homepageOutput = useMemo(() => formatURL(homepage), [homepage]);
    return (
        <div className={styles.container}>
            <div className={styles.top}>
                <Link
                    className={styles.title}
                    href={html_url}
                    target="_blank"
                    title="To GitHub Repository"
                >
                    {package_name || name}
                </Link>
                {language && (
                    <p className={styles.language}>
                        <small>Written in {language}</small>
                    </p>
                )}
            </div>
            <div className={styles.bottom}>
                <p className={styles.description}>{description}</p>
                {!!homepageOutput && (
                    <Link
                        className={styles.homepage}
                        href={homepage}
                        target="_blank"
                        title={`View project at ${homepage}`}
                    >
                        {homepageOutput}
                    </Link>
                )}
            </div>
        </div>
    );
};

export default RepoCard;
