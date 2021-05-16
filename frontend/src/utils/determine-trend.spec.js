import determineTrend from './determine-trend';

describe('determineTrend', () => {
    it('should return "falling" and 3 for 99, 98, 90', () => {
        const data = [{value: 99}, {value: 98}, {value: 90}];
        expect(determineTrend(data, 100)).toEqual({falling: true, days: 3});
    });

    it('should return "rising" and 3 for 90, 98, 99', () => {
        const data = [{value: 90}, {value: 98}, {value: 99}];
        expect(determineTrend(data, 100)).toEqual({falling: false, days: 3});
    });

    it('should return "falling" and 2 for 90, 98, 99, 95', () => {
        const data = [{value: 90}, {value: 98}, {value: 99}, {value: 95}];
        expect(determineTrend(data, 100)).toEqual({falling: true, days: 1});
    });
})