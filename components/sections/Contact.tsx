import { createSection } from './Section';
import styles from './Contact.module.css';

const Contact = createSection(
    () => {
        return (
            <>
                <h2 className="title">Contact</h2>
                <div className={styles.container}>
                    <a
                        className={styles.link}
                        href="mailto:vincent@sjogren.dev"
                        target="_blank"
                        title="My email"
                        rel="noreferrer"
                    >
                        vincent@sjogren.dev
                    </a>
                    <a
                        className={styles.link}
                        href="tel:+46700624523"
                        title="My phone number"
                    >
                        +46 700 62 45 23
                    </a>
                </div>
            </>
        );
    },
    { id: 'contact', className: styles.section }
);

export default Contact;
