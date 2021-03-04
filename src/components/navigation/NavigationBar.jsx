import React, { useState } from 'react'
import routes from '../../routes/routes';
import { Redirect, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@material-ui/core';
import { StyleSheet, css } from 'aphrodite';
import logo from '../../resources/logo.png';

const styles = StyleSheet.create({
  root: {
    flexGrow: 1,
  },
  bar: {
    background: '#0269a4',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1.5px',
    borderColor: '#80D8F7',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  logo: {
    width: '3.5vh',
    height: '3.5vh',
  },
});

function NavigationBar() {
  const [path, setPath] = useState(useLocation().pathname);

  const redirectToPath = () => {
    return (
      <Redirect to={path} push />
    );
  };

  return (
    <div className={css(styles.root)}>
      {redirectToPath()}
      <AppBar position='static'>
        <Toolbar className={css(styles.bar)}>
          <IconButton disabled className={css(styles.menuButton)} color='inherit'>
            <img className={css(styles.logo)} src={logo} alt='Logo' />
          </IconButton>
          <Typography variant='h6' color='inherit' className={css(styles.grow)}>
            Coderpad
          </Typography>
          <Button color='inherit' onClick={() => setPath(routes['sourceCode'])}>Source Code</Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default NavigationBar;
