import { PartialRepo } from '@utils/api/github-api';
import Section from './Section';
import RepoCard from '@components/cards/RepoCard';
import styles from './Projects.module.css';
import { classNames } from '@utils/react';

const Projects = ({ repos }: { repos: PartialRepo[] }) => {
    if (!repos?.length) return null;
    return (
        <Section id="projects" className={styles.section}>
            <h3 className="title">Projects on GitHub</h3>
            <div className={styles['card-grid']}>
                {repos.map((repo) => {
                    return <RepoCard key={`repo-${repo.id}`} {...repo} />;
                })}
            </div>
        </Section>
    );
};

export default Projects;
