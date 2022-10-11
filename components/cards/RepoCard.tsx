import type { PartialRepo } from '@utils/misc/github-api';
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
            <p className={styles.language}>
                <small>{language}</small>
            </p>
            <code className={styles.description}>{description}</code>
        </div>
    );
};

export default RepoCard;
