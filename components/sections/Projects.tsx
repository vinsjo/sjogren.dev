import { PartialRepo } from '@utils/api/github-api';
import { createSection } from './Section';
import RepoCard from '@components/cards/RepoCard';
import styles from './Projects.module.css';
import { SectionName } from 'stores/sectionsStore';

interface ProjectsProps {
    repos?: PartialRepo[];
}

const Projects = createSection(
    ({ repos }: ProjectsProps) => {
        return !repos?.length ? null : (
            <>
                <h3 className="title">Projects on GitHub</h3>
                <div className={styles['card-grid']}>
                    {repos.map((repo) => {
                        return <RepoCard key={`repo-${repo.id}`} {...repo} />;
                    })}
                </div>
            </>
        );
    },
    { id: SectionName.Projects, className: styles.section }
);

export default Projects;
