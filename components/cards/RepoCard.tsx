import type { PartialRepo } from '@utils/misc/github-api';
import { useMemo } from 'react';
import { formatURL } from '@utils/misc';
import styles from './RepoCard.module.css';

const RepoCard = ({
    name,
    description,
    html_url,
    homepage,
    language,
}: PartialRepo) => {
    const homepageURL = useMemo(() => {
        return !homepage ? null : formatURL(homepage);
    }, [homepage]);
    return (
        <div className={styles.container}>
            <a
                href={html_url}
                target="_blank"
                rel="noreferrer"
                title="To Repository on GitHub"
            >
                <h3 className={styles.name}>{name}</h3>
            </a>
            <code className={styles.description}>{description}</code>
            {!homepage ? null : (
                <a
                    href={homepage}
                    target="_blank"
                    rel="noreferrer"
                    title={
                        homepage.includes('npmjs.com')
                            ? 'To npm package'
                            : 'To homepage'
                    }
                >
                    {homepageURL}
                </a>
            )}
        </div>
    );
};

export default RepoCard;
