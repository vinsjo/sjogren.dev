import React, { Suspense } from 'react';
import useDidMount from '@hooks/useDidMount';

type Props = {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    withSuspense?: boolean;
};

const ClientRender = ({
    children,
    fallback = null,
    withSuspense = false,
}: Props) => {
    const didMount = useDidMount();
    return !withSuspense ? (
        <>{!didMount ? fallback : children}</>
    ) : (
        <>
            {!didMount ? null : (
                <Suspense fallback={fallback}>{children}</Suspense>
            )}
        </>
    );
};

export function clientRender<P, T extends JSX.Element>(
    Component: (props: P) => T,
    fallback?: React.ReactNode
) {
    // eslint-disable-next-line react/display-name
    return (props: P) => {
        return (
            <ClientRender fallback={fallback}>
                <Component {...props} />
            </ClientRender>
        );
    };
}

export default ClientRender;
