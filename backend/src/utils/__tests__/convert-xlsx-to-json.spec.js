const convertToJson = require('../convert-xlsx-to-json');
const fs = require('fs');
const path = require('path');

describe('convertToJson', () => {
    let json;

    beforeAll(() => {
        const data = fs.readFileSync(path.join(__dirname, './Fallzahlen_Kum_Tab.xlsx'));
        json = convertToJson(data);
    })

    it('should convert local XLSX file', () => {
        expect(json).toBeDefined();
    });

    it('should contain "LK Esslingen"', () => {
        expect(json).toEqual(expect.arrayContaining([expect.objectContaining({name: 'LK Esslingen'})]));
    });

    it('should be stringifyable', () => {
        expect(() => JSON.stringify(json)).not.toThrow();
    })
});