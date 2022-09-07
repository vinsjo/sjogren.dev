import React from 'react';
import Link from 'next/link';

const NotFound = () => {
	return (
		<>
			<h1>404 - Page Not Found</h1>
			<Link href="/">
				<a>Go back home</a>
			</Link>
		</>
	);
};

export default NotFound;
