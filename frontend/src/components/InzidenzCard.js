import {useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Grid, Typography } from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    card: {
      margin: theme.spacing(2),
      padding: theme.spacing(1),
    },
    mainValue: {
        textAlign: 'center',
    }
  }));
  
function findCounty(data, county) {
    if (!data) {
        return null;
    }
    const countyData = data.find(({name}) => name === county);
    if (!countyData || !Array.isArray(countyData.inzidenz)) {
        return {
            inzidenzToday: {
                value: 'n/a',
                date: '--',
            }
        }
    }
    const inzidenzToday = countyData.inzidenz.slice(-1)[0];
    const inzidenzYesterday = countyData.inzidenz.slice(-2)[0];
    const change = inzidenzToday.value - inzidenzYesterday.value;
    const changePercent = Math.round(change * 100 / inzidenzYesterday.value);
    return {
        inzidenzToday: {
            value:new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(inzidenzToday.value),
            date: inzidenzToday.date,
        }, 
        change: new Intl.NumberFormat('de-DE', {signDisplay: 'always', maximumFractionDigits: 0}).format(change), 
        changePercent: new Intl.NumberFormat('de-DE', {signDisplay: 'always', maximumFractionDigits: 1}).format(changePercent)
    };
}

export default function InzidenzCard({county, data}) {
    const classes = useStyles();
    const countyData = useMemo(() => findCounty(data, county), [data, county]);
    const {inzidenzToday, change, changePercent} = countyData ?? {};
    return (
      <Card className={classes.card}>
        <Typography variant="caption">{county}</Typography>
        <Typography variant="h1" className={classes.mainValue}>{inzidenzToday?.value ?? <Skeleton />}</Typography>
        <Grid container justify="space-between">
            <Grid item>
                <Typography variant="body1">{change}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">{changePercent}%</Typography>
            </Grid>
        </Grid>
        <Typography variant="caption">Stand: {inzidenzToday?.date ?? <Skeleton />}</Typography>
      </Card>
    )
  }
  