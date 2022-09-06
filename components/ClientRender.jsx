import { useState, useEffect } from 'react';

const ClientRender = ({ children }) => {
	const [didMount, setDidMount] = useState(false);
	useEffect(() => {
		setDidMount(true);
	}, []);
	return !didMount ? null : <>{children}</>;
};

export default ClientRender;
