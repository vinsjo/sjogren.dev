import type { HTMLProps } from 'react';

export type LinkProps = HTMLProps<HTMLAnchorElement>;

const Link = ({ children, target, rel, ...props }: LinkProps) => {
  return (
    <a
      target={target}
      rel={target === '_blank' ? 'noreferrer' : rel}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
