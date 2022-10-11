import { PartialRepo } from '@utils/misc/github-api';
import { createSection } from './Section';
import RepoCard from '@components/cards/RepoCard';
import styles from './Repos.module.css';

const Repos = createSection(
    ({ repos }: { repos: PartialRepo[] }) => {
        if (!repos || !repos.length) return null;
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Projects on GitHub</h3>
                <div className={styles['card-grid']}>
                    {repos.map((repo) => {
                        return <RepoCard key={`repo-${repo.id}`} {...repo} />;
                    })}
                </div>
            </div>
        );
    },
    { id: 'repos' }
);

export default Repos;
