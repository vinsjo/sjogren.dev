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
}: PartialRepo) => {
    return (
        <div className={styles.container}>
            <a
                href={html_url}
                target="_blank"
                rel="noreferrer"
                title="To Repository on GitHub"
            >
                <h3 className={styles.title}>{package_name || name}</h3>
            </a>
            <code className={styles.description}>{description}</code>
            <code className={styles.language}>{language}</code>
        </div>
    );
};

export default RepoCard;
