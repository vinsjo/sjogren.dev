import Head from 'next/head';
import ClientRender from '../components/ClientRender';
import BlobScene from '../components/Three/BlobScene';
import styles from '../styles/Home.module.css';

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<meta
					name="keywords"
					content="Vincent Sjögren, Vincent, Sjögren, Developer, Front-end, Frontend, Javascript, React, Three.js, Stockholm"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
				/>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<title>sjogren.dev nextjs test</title>
			</Head>

			<main className={styles.main}>
				<ClientRender>
					<BlobScene />
				</ClientRender>
			</main>
		</div>
	);
}
