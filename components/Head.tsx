import React, { useMemo } from 'react';
import { default as NextHead } from 'next/head';
import { isStr } from 'x-is-type';

const defaults = {
  title: 'sjogren.dev',
  faviconURL: '/favicon.svg',
  keywords: [
    'Vincent Sjögren',
    'Vincent',
    'Sjögren',
    'Developer',
    'Front-end',
    'Frontend',
    'Full-stack',
    'Javascript',
    'React',
    'Next.js',
    'Three.js',
    'Stockholm',
  ],
};

const getFaviconMime = (favicon: string) => {
  const ext = favicon.match(/^.*\.(?<ext>jpg|gif|png|ico|svg)$/gi)?.groups?.ext;
  switch (ext?.toLowerCase()) {
    case 'ico':
      return 'image/x-icon';
    case 'svg':
      return 'image/svg+xml';
    default:
      'image/ico';
  }
};

export interface HeadProps {
  keywords?: string[];
  title?: string;
  faviconURL?: string;
  children?: React.ReactNode;
}

const Head = (props: HeadProps) => {
  const keywords = useMemo(() => {
    return (
      !props.keywords
        ? defaults.keywords
        : [...new Set([...defaults.keywords, ...props.keywords])]
    ).join(', ');
  }, [props.keywords]);
  const title = useMemo(
    () => (isStr(props.title) ? props.title : defaults.title),
    [props.title]
  );
  const [favicon, faviconType] = useMemo(() => {
    const favicon = !isStr(props.faviconURL)
      ? defaults.faviconURL
      : props.faviconURL;
    return [favicon, getFaviconMime(favicon)];
  }, [props.faviconURL]);
  return (
    <NextHead>
      <meta name="keywords" content={keywords} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />
      <link rel="icon" type={faviconType} href={favicon} />
      {props.children ?? null}
      <title>{title}</title>
    </NextHead>
  );
};

export default Head;
