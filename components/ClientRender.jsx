import useDidMount from '../hooks/useDidMount';

const ClientRender = ({ children }) => {
	const didMount = useDidMount();
	return !didMount ? null : <>{children}</>;
};

export default ClientRender;
