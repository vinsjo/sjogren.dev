import { createSection } from './Section';
import { Link, IconLink } from '@/components/links';

import { PageSection } from '@/stores/sectionsStore';

import styles from './Contact.module.css';

export const Contact = createSection(
  () => {
    return (
      <>
        <h2 className="title">Contact</h2>
        <div className={styles.container}>
          <div className={styles['contact-details']}>
            <Link
              className={styles.link}
              href="mailto:vincent@sjogren.dev"
              target="_blank"
              title="Send me an email"
            >
              vincent@sjogren.dev
            </Link>
            <Link
              className={styles.link}
              href="tel:+46700624523"
              title="Call me"
            >
              +46 700 62 45 23
            </Link>
          </div>
          <div className={styles.social}>
            <IconLink
              href="https://github.com/vinsjo"
              target="_blank"
              title="Follow me on GitHub"
              src="/assets/icons/github.svg"
            />
            <IconLink
              href="https://www.linkedin.com/in/vincent-sj%C3%B6gren-547681159"
              target="_blank"
              title="Add me to your LinkedIn network"
              src="/assets/icons/linkedin.svg"
            />
          </div>
        </div>
      </>
    );
  },
  { id: PageSection.Contact, className: styles.section }
);
