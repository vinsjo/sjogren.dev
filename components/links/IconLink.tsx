import { useState } from 'react';
import clsx from 'clsx';
import { Link, type LinkProps } from './Link';
import Image from 'next/image';

import styles from './IconLink.module.css';

export type IconLinkProps = LinkProps & {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export const IconLink = ({
  children,
  src,
  alt,
  width,
  height,
  className,
  ...props
}: IconLinkProps) => {
  const [error, setError] = useState(false);
  return (
    <Link
      className={clsx(styles.link, error && styles.error, className)}
      {...props}
    >
      {!src ? (
        children
      ) : (
        <Image
          className={styles.img}
          src={src}
          width={width || 32}
          height={height || 32}
          alt={alt || props.title || src}
          onError={() => setError(true)}
        />
      )}
    </Link>
  );
};
