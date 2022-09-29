import React from 'react';
import { tern } from '@utils/misc';

const RenderIf = (props: {
	children: React.ReactNode;
	condition: unknown;
	fallback?: React.ReactNode | null;
}) => {
	return <>{!!props.condition ? props.children : props.fallback ?? null}</>;
};

export default RenderIf;
