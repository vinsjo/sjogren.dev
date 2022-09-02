import Head from 'next/head';
import Button from '../components/button';
import styles from '../styles/Home.module.css';

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>Vincent Sjögren</title>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			</Head>

			<main className={styles.main}>
				<Button onClick={() => alert('You clicked the button!')}>
					Click Me
				</Button>
			</main>
		</div>
	);
}
