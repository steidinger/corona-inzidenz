import {useMemo} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import InzidenzChart from './InzidenzChart';
import determineThresholds from '../utils/determine-thresholds';

const useStyles = makeStyles((theme) => ({
    card: {
      margin: theme.spacing(2),
    },
    content: {
        display: 'grid',
        gridTemplateAreas: `
                            'county county         county'
                            'today  changeAbsolute threshold-above'
                            'today  changePercent  threshold-below'
                            'date   date           date'
                            `,
        gridTemplateColumns: '80px 50px 1fr',
    },
    mainValue: {
        textAlign: 'left',
        alignSelf: 'center',
        lineHeight: 1.0,
        gridArea: 'today',
    },
    changeAbsolute: {
        textAlign: 'right',
        gridArea: 'changeAbsolute',
    },
    changePercent: {
        textAlign: 'right',
        gridArea: 'changePercent',
    },
    countyName: {
        textAlign: 'left',
        gridArea: 'county',
    },
    date: {
        marginTop: theme.spacing(2),
        textAlign: 'right',
        gridArea: 'date',
    },
    thresholdAbove: {
        textAlign: 'right',
        gridArea: 'threshold-above',
    },
    thresholdBelow: {
        textAlign: 'right',
        gridArea: 'threshold-below',
    },
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
        inzidenz: countyData.inzidenz,
        inzidenzToday: {
            value:new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(inzidenzToday.value),
            date: inzidenzToday.date,
        }, 
        change: new Intl.NumberFormat('de-DE', {signDisplay: 'always', maximumFractionDigits: 0}).format(change), 
        changePercent: new Intl.NumberFormat('de-DE', {signDisplay: 'always', maximumFractionDigits: 1}).format(changePercent),
        thresholds: determineThresholds(countyData.inzidenz),
    };
}

function ThresholdInfo({threshold, below, days, className}) {
    const info = [
        days > 7 ? '>7' : days,
        days === 1 ? 'Tag' : 'Tage',
        below ? 'unter' : 'über',
        threshold
    ].join(' ');
    return <Typography variant="body1" className={className}>{info}</Typography>
}

export default function InzidenzCard({county, data}) {
    const classes = useStyles();
    const countyData = useMemo(() => findCounty(data, county), [data, county]);
    const {inzidenzToday, change, changePercent, inzidenz, thresholds} = countyData ?? {};
    return (
      <Card className={classes.card}>
        {inzidenz && <InzidenzChart county={county} data={inzidenz} />}
        <CardContent className={classes.content}>
            <Typography variant="body1" className={classes.countyName}>{county}</Typography>
            <Typography variant="h4" className={classes.mainValue}>{inzidenzToday?.value ?? <Skeleton />}</Typography>
            <Typography variant="body1" className={classes.changeAbsolute}>{change}</Typography>
            <Typography variant="body1" className={classes.changePercent}>{changePercent}%</Typography>
            <Typography variant="caption" className={classes.date}>Stand: {inzidenzToday?.date ?? <Skeleton />}</Typography>
            {thresholds?.below && <ThresholdInfo className={classes.thresholdBelow} threshold={thresholds.below.threshold} days={thresholds.below.daysBelow} below />}
            {thresholds?.above && <ThresholdInfo className={classes.thresholdAbove} threshold={thresholds.above.threshold} days={thresholds.above.daysAbove} />}
        </CardContent>
      </Card>
    )
  }
  