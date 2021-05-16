import {countDays, findRelevantThresholds} from './determine-thresholds';

describe('countDays', () => {
    it('should return number of consecutive days below each threshold', () => {
        const data = [
            {value: 170, date: '2020-12-19'}, 
            {value: 156, date: '2020-12-20'}, 
            {value: 157, date: '2020-12-21'}, 
            {value: 160, date: '2020-12-22'}, 
            {value: 158, date: '2020-12-23'}, 
            {value: 161, date: '2020-12-24'}, 
            {value: 149, date: '2020-12-24'}, 
        ];
        expect(countDays(data)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({threshold: 100, daysBelow: 0}),
                expect.objectContaining({threshold: 150, daysBelow: 1}),
                expect.objectContaining({threshold: 165, daysBelow: 6}),
            ]));
    });
    it('should return number of consecutive days above each threshold', () => {
        const data = [
            {value: 170, date: '2020-12-19'}, 
            {value: 156, date: '2020-12-20'}, 
            {value: 145, date: '2020-12-21'}, 
            {value: 160, date: '2020-12-22'}, 
            {value: 158, date: '2020-12-23'}, 
            {value: 168, date: '2020-12-24'}, 
            {value: 170, date: '2020-12-24'}, 
        ];
        expect(countDays(data)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({threshold: 100, daysAbove: 7}),
                expect.objectContaining({threshold: 150, daysAbove: 4}),
                expect.objectContaining({threshold: 165, daysAbove: 2}),
            ]));
    });
});

describe('findRelevantThresholds', () => {
    it('should return the lowest threshold with daysBelow > 0', () => {
        expect(findRelevantThresholds([
            {threshold: 100, daysBelow: 0}, 
            {threshold: 150, daysBelow: 1}, 
            {threshold: 165, daysBelow: 5},
        ]))
            .toEqual(expect.objectContaining({below: expect.objectContaining({threshold: 150, daysBelow: 1})}));
    });
    
    it('should return undefined for "below" if there is no threshold with daysBelow > 0', () => {
        expect(findRelevantThresholds([
            {threshold: 100, daysBelow: 0}, 
            {threshold: 150, daysBelow: 0}, 
            {threshold: 165, daysBelow: 0},
        ]))
            .toEqual(expect.objectContaining({below: undefined}));
    });

    it('should return the largest threshold with daysAbove > 0', () => {
        expect(findRelevantThresholds([
            {threshold: 100, daysAbove: 8}, 
            {threshold: 150, daysAbove: 5}, 
            {threshold: 165, daysAbove: 0},
        ]))
            .toEqual(expect.objectContaining({above: expect.objectContaining({threshold: 150, daysAbove: 5})}));
    });

    it('should return undefined for "above" if there is no threshold with daysAbove > 1', () => {
        expect(findRelevantThresholds([
            {threshold: 100, daysAbove: 0}, 
            {threshold: 150, daysAbove: 0}, 
            {threshold: 165, daysAbove: 0},
        ]))
            .toEqual(expect.objectContaining({above: undefined}));
    });
});
