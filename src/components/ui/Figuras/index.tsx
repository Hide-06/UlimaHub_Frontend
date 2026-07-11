import type { ComponentProps } from 'react';
import './Figuras.css';

const STARCLASSES: Record<number, string> = {
  6: 'estrella',
  5: 'estrella5',
  12: 'estrella12',
};
type FigureProps = ComponentProps<'div'>;
export const Star = ({
  nPointed,
  ...props
}: { nPointed: number } & FigureProps) => {
  const className = STARCLASSES[nPointed] ?? '';
  return <div className={'figure ' + className} {...props}></div>;
};
export const Penatagono = () => <div className="figure pentagono"></div>;
export const Hexagono = () => <div className="figure hexagono"></div>;
export const Octagono = () => <div className="figure octagono"></div>;
