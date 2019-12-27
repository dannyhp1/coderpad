import React from 'react'
import { makeStyles, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';
import logo from '../resources/logo.png'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingBottom: 2.5,
  },
  logo: {
    width: '3.5vh',
    height: '3.5vh'
  },
  bar: {
    background: '#0269a4',
    borderBottomStyle: 'solid',
    borderBottomWidth: '2.5px',
    borderColor: '#013F64'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    fontFamily: 'Roboto',
    flexGrow: 1,
  },
}));

const redirectToSource = () => {
  window.location.assign('https://github.com/dannyhp1/coderpad')
}

export default function Header() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position='static' className={classes.bar}>
        <Toolbar>
          <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu' onClick={redirectToSource}>
            <img className={classes.logo} src={logo} alt='Logo' />
          </IconButton>
          <Typography variant='h5' className={classes.title}>
            Coderpad
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}