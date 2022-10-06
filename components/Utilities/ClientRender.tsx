import React, { Suspense } from 'react';
import useDidMount from '@hooks/useDidMount';

const ClientRender = ({
    children,
    fallback,
    withSuspense,
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    withSuspense?: boolean;
}) => {
    const didMount = useDidMount();
    return (
        <>
            {!didMount ? (
                withSuspense ? null : (
                    fallback || null
                )
            ) : withSuspense ? (
                <Suspense fallback={fallback}>{children}</Suspense>
            ) : (
                children
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
