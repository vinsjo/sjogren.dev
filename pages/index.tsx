import Head from 'next/head';
import React, { useState } from 'react';
import { classNames } from '@utils/client';
import BlobScene from '@components/Three/Blob/BlobScene';
import styles from '../styles/Home.module.css';
import { tern } from '@utils/misc';
import { ClientRender } from '@components/Utilities';

const Home = () => {
	const [loaded, setLoaded] = useState(false);
	return (
		<>
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
				<title>sjogren.dev</title>
			</Head>

			<main className={styles.main}>
				<div
					className={classNames(
						styles.container,
						tern(styles.loaded, null, loaded)
					)}
				>
					<div className={styles['caption-container']}>
						<h1 className={styles.caption}>
							<a
								href="mailto:vincent@sjogren.dev"
								target="_blank"
								title="Contact Me"
								rel="noreferrer"
							>
								vincent@sjogren.dev
							</a>
						</h1>
					</div>
					<ClientRender>
						<BlobScene
							className={styles['blob-scene']}
							onLoad={() => setLoaded(true)}
						/>
					</ClientRender>
				</div>
			</main>
		</>
	);
};

export default Home;
