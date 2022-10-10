import { PartialRepo } from '@utils/misc/github-api';
import { createSection } from './Section';
import RepoCard from '@components/cards/RepoCard';
import styles from './Repos.module.css';

const Repos = createSection(
    ({ repos }: { repos: PartialRepo[] }) => {
        return !repos || !repos.length ? null : (
            <div className={styles['card-grid']}>
                {repos.map((repo) => {
                    return <RepoCard key={`repo-${repo.id}`} {...repo} />;
                })}
            </div>
        );
    },
    { id: 'repos' }
);

export default Repos;
