export default function determineTrend(data, threshold, maxDays = 30) {
    const values = data.map(({value}) => value).reverse().slice(0, maxDays);
    if (values.length < 2 || values[0] >= threshold || values[1] >= threshold) {
        return undefined;
    }
    let days = 1;
    let previous = values[0];
    let current = values[1];
    let falling = current > previous;
    while (previous < threshold && current < threshold && days < values.length) {
        previous = current;
        current = values[days + 1];
        if ((falling && current <= previous) || (!falling && current > previous)) {
            break;
        }
        days += 1;
    }
    return {days, falling};
}