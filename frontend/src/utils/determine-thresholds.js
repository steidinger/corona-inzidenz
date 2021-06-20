const thresholds = [10, 35, 50, 100, 150, 165];

export const MAX_INFO_DAYS = 14;

function countDaysBelow(values, threshold) {
    let count = 0;
    while(count < values.length && values[count] < threshold) {
        count += 1;
    }
    return count;
}

function countDaysAbove(values, threshold) {
    let count = 0;
    while(count < values.length && values[count] > threshold) {
        count += 1;
    }
    return count;
}

export function countDays(data) {
    const values = data.slice(-1 * (MAX_INFO_DAYS + 1)).map(({value}) => value).reverse();
    return thresholds.map(threshold => ({
        daysBelow: countDaysBelow(values, threshold),
        daysAbove: countDaysAbove(values, threshold),
        threshold,
    }));
}

export function findRelevantThresholds(thresholds) {
    const below = thresholds.filter(({daysBelow}) => daysBelow > 0)[0];
    const above = thresholds.filter(({daysAbove}) => daysAbove > 0).reverse()[0];
    return {above, below};
}

export default function determineThresholds(data) {
    return findRelevantThresholds(countDays(data));
}