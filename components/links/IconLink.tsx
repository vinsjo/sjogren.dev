import Link, { type LinkProps } from './Link';
import { classNames } from '@utils/react';
import Image from 'next/image';
import styles from './IconLink.module.css';
import { useState } from 'react';

export type IconLinkProps = LinkProps & {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
};

const IconLink = ({
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
            className={classNames(
                styles.link,
                error ? styles.error : null,
                className
            )}
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

export default IconLink;
