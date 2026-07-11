import {
  NavLink as RouterLink,
  type NavLinkProps as RouterLinkProps,
} from 'react-router';
import { NavLink, type NavLinkProps } from '@mantine/core';

type Props = NavLinkProps & RouterLinkProps;
export const Link = (props: Props) => {
  return <NavLink component={RouterLink} variant='filled' {...props}></NavLink>;
};
