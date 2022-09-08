import React from 'react';
import { tern } from '@utils/misc';

const RenderIf = (props: {
	children: React.ReactNode;
	condition: boolean | ((...args: any[]) => boolean);
	fallback?: React.ReactNode | null;
}) => {
	return <>{tern(props.children, props.fallback || null, props.condition)}</>;
};

export default RenderIf;
