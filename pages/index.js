import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Vincent Sjögren</title>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			</Head>

			<main className={styles.main}></main>
		</div>
	);
}
