import { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { makeStyles } from '@material-ui/core/styles';

export const PERIODS = [
    {id: 'ALL', name: 'Gesamtchart', limit: data => data, axis: {format: '%m/%y', tickValues: 'every 1 month'}},
    {id: '8w', name: '8 Wochen', limit: data => data.slice(-56), axis: {format: '%d.%m', tickValues: 'every 2 weeks'}},
    {id: '4w', name: '4 Wochen', limit: data => data.slice(-28), axis: {format: '%d.%m', tickValues: 'every 1 week'}},
    {id: '14d', name: '14 Tage', limit: data => data.slice(-14), axis: {format: '%d.%m', tickValues: 'every 3 days'}},
];

export const DEFAULT_PERIOD = PERIODS[1];

const useStyles = makeStyles((theme) => ({
    container: {
        height: 100,
        paddingTop: theme.spacing(1),
    },
}));

function prepareChartData(county, data, period) {
    const chartData = ({
        id: county,
        data: period.limit(data).map(({ date, value }) => ({ x: date, y: value })),
    });
    return [chartData];
}

const xScale = { 
    type: 'time',
    format: '%Y-%m-%d',
    useUTC: false,
    precision: 'day',
}

export default function InzidenzChart({ county, data, period = DEFAULT_PERIOD }) {
    const classes = useStyles();
    const yScale = { type: 'linear', min: 0, max: 'auto' };
    const chartData = useMemo(() => prepareChartData(county, data, period), [county, data, period])
    return (
        <div className={classes.container}>
            <ResponsiveLine
                data={chartData}
                xScale={xScale}
                xFormat="time:%Y-%m-%d"
                yScale={yScale}
                enablePoints={false}
                enableGridX={false}
                gridYValues={[10, 50, 100, 150, 200, 250, 300]}
                colors={{scheme: 'category10'}}
                axisLeft={{orient: 'left', tickValues: [10, 50, 100, 150, 200, 250, 300]}}
                axisBottom={period.axis}
                margin={{left: 30, bottom: 24}}
            />
        </div>
    )
}