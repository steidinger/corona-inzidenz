import { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Fab, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import InzidenzCard from './components/InzidenzCard';
import SelectCountyDialog from './components/SelectCountyDialog';

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

const STORAGE_KEY = 'coronaInzidenzCountySelection';

function getInitialCounties() {
  try {
    const initial = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(initial)) {
      return [];
    }
    return initial;
  } catch (error) {
    return [];
  }
}

function persistSelectedCounties(selected) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
}

function App() {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [counties, setCounties] = useState(() => getInitialCounties());
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const allCounties = useMemo(() => !data ? [] : data.map(({ name }) => name), [data]);

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
      {counties.map(county => <InzidenzCard key={county} county={county} data={data} />)}
      {dialogOpen &&
        <SelectCountyDialog
          allCounties={allCounties}
          activeCounties={counties}
          onApply={(selected) => {
            setCounties(selected);
            persistSelectedCounties(selected);
            setDialogOpen(false);
          }}
          onCancel={() => setDialogOpen(false)}
        />
      }
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => setDialogOpen(true)}>
        <AddIcon />
      </Fab>
    </>
  );
}

export default App;
