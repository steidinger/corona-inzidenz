import { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, CircularProgress, Fab, FormControl, Grid, InputLabel, MenuItem, Select, Toolbar, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RefreshIcon from '@material-ui/icons/Refresh';
import InzidenzCard from './components/InzidenzCard';
import SelectCountyDialog from './components/SelectCountyDialog';
import { DEFAULT_PERIOD, PERIODS } from './components/InzidenzChart';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  refresh: {
    color: theme.palette.primary.contrastText,
  },
  chartPeriod: {
    color: theme.palette.primary.contrastText,
  },
  chartPeriodLabel: {
    color: theme.palette.primary.contrastText,
  },
  chartPeriodSelect: {
    color: theme.palette.primary.contrastText,
  },
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
  const [reloadFlag, setReloadFlag] = useState(true);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [counties, setCounties] = useState(() => getInitialCounties());
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [chartPeriod, setChartPeriod] = useState(DEFAULT_PERIOD);

  const allCounties = useMemo(() => !data ? [] : data.map(({ name }) => name), [data]);

  useEffect(() => {
    const url = 'https://serverless-corona-inzidenz-269004290177-dev.s3.eu-central-1.amazonaws.com/data.json';
    if (reloadFlag) {
      setLoading(true);
      fetch(url)
        .then(response => response.json())
        .then(json => {
          setData(json);
          setLoading(false);
          setReloadFlag(false);
        })
        .catch(error => {
          setLoading(false);
          setReloadFlag(false);
          setError('Daten konnten nicht geladen werden:' + error); 
        });
    }
  }, [reloadFlag]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>Corona Inzidenz</Typography>
          {/* <FormControl className={classes.chartPeriod}>
            <InputLabel id="chart-period-label" className={classes.chartPeriodLabel}>Chartzeitraum</InputLabel> */}
            <Select 
              labelId="chart-period-label" 
              className={classes.chartPeriodSelect}
              value={chartPeriod} 
              onChange={event => setChartPeriod(event.target.value)}
            >
              {PERIODS.map(period => 
                <MenuItem key={period.name} value={period}>{period.name}</MenuItem>
              )}
            </Select>
          {/* </FormControl> */}
          {loading ? <CircularProgress className={classes.refresh} /> : <Button onClick={() => setReloadFlag(true)}><RefreshIcon className={classes.refresh}/></Button>}
        </Toolbar>
      </AppBar>
      {error ?? <Typography variant="body1">{error}</Typography>}
      <Grid container>
        {counties.map(county => 
          <Grid item xs={12} sm={6} md={4}  xl={2} key={county} >
            <InzidenzCard county={county} data={data} chartPeriod={chartPeriod} />
          </Grid>)}
      </Grid>
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
      <Fab color="primary" aria-label="Kreis auswählen" className={classes.fab} onClick={() => setDialogOpen(true)}>
        <AddIcon />
      </Fab>
    </>
  );
}

export default App;
