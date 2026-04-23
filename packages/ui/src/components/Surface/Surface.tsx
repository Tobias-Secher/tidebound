import { ComponentPropsWithoutRef, ElementType } from 'react';

type SurfaceOwnProps<T extends ElementType> = {
  as?: T;
};

type SurfaceProps<T extends ElementType> = SurfaceOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof SurfaceOwnProps<T> | 'className'>;

export function Surface<T extends ElementType = 'div'>({ as, children, ...rest }: SurfaceProps<T>) {
  const Wrapper = as ?? 'div';
  return <Wrapper {...rest}>{children}</Wrapper>;
}
