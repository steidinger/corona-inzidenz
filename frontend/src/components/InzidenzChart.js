import { useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        height: 100,
        paddingTop: theme.spacing(1),
    },
}));

function prepareChartData(county, data) {
    const chartData = ({
        id: county,
        data: data.map(({ date, value }) => ({ x: date, y: value })),
    });
    return [chartData];
}

const xScale = { 
    type: 'time',
    format: '%Y-%m-%d',
    useUTC: false,
    precision: 'day',
}

export default function InzidenzChart({ county, data }) {
    const classes = useStyles();
    const yScale = { type: 'linear', min: 0, max: 'auto' };
    const chartData = useMemo(() => prepareChartData(county, data), [county, data])
    return (
        <div className={classes.container}>
            <ResponsiveLine
                data={chartData}
                xScale={xScale}
                xFormat="time:%Y-%m-%d"
                yScale={yScale}
                enablePoints={false}
                enableGridX={false}
                gridYValues={[50, 100, 150, 200, 250, 300]}
                colors={{scheme: 'category10'}}
                axisLeft={{orient: 'left', tickValues: [50, 100, 150, 200, 250, 300]}}
                axisBottom={{
                    format: '%m/%y',
                    tickValues: 'every 1 months',
                }}
                margin={{left: 30, bottom: 24}}
            />
        </div>
    )
}