import React from 'react';
import useDidMount from '@hooks/useDidMount';
import RenderIf from './RenderIf';

const ClientRender = (props: { children: React.ReactNode }) => {
	const didMount = useDidMount();
	return <RenderIf condition={didMount}>{props.children}</RenderIf>;
};

export default ClientRender;
