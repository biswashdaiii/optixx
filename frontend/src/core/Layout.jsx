import React from 'react';
import Menu from './Menu';
import { Box } from '@mui/material';

const Layout = ({
  title = 'Title',
  description = 'Description',
  className,
  children,
}) => (
  <Box>
    <Menu />
    <Box className={className}>
      {children}
    </Box>
  </Box>
);

export default Layout;