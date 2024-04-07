import React, { Suspense, useEffect, useState } from 'react';

export type ClientRenderProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  withSuspense?: boolean;
};

export const ClientRender: React.FC<ClientRenderProps> = ({
  children,
  fallback = null,
  withSuspense = false,
}) => {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (withSuspense) {
    return didMount ? (
      <Suspense fallback={fallback}>{children}</Suspense>
    ) : null;
  }

  return <>{didMount ? children : fallback}</>;
};

export function withClientRender<P>(
  Component: React.ComponentType<P>,
  clientRenderProps?: Omit<ClientRenderProps, 'children'>
) {
  const { fallback, withSuspense } = clientRenderProps ?? {};

  const WithClientRender: React.FC<P> = (props) => (
    <ClientRender fallback={fallback} withSuspense={withSuspense}>
      <Component {...props} />
    </ClientRender>
  );

  if (Component.displayName) {
    WithClientRender.displayName = `ClientRender_${Component.displayName}`;
  }

  return WithClientRender;
}
