import { type PartialRepo } from '@/utils/api/github-api';

import { RepoCard } from '@/components/cards/RepoCard';

import { PageSection } from './constants';

import { createSection } from './Section';
import styles from './Projects.module.css';

interface ProjectsProps {
  repos?: PartialRepo[];
}

export const Projects = createSection(
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
  { id: PageSection.Projects, className: styles.section }
);
