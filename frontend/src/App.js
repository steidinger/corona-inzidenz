import {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Fab, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import InzidenzCard from './components/InzidenzCard';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  }
}));

function App() {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const url = 'https://serverless-corona-inzidenz-269004290177-dev.s3.eu-central-1.amazonaws.com/data.json';
    fetch(url)
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => setError(error));
  }, []);
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>Corona Inzidenz</Typography>
        </Toolbar>
      </AppBar>
      {error ?? <Typography variant="body1">{error}</Typography>}
      <InzidenzCard county="LK Esslingen" data={data} />
      <InzidenzCard county="SK Stuttgart" data={data} />
      <InzidenzCard county="LK Schwarzwald-Baar-Kreis" data={data} />
      <Fab color="primary" aria-label="add" className={classes.fab}>
        <AddIcon />
      </Fab>
    </>
  );
}

export default App;
