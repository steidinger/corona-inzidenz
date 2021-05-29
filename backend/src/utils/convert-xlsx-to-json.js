const { DateTime } = require("luxon");
const XLSX = require("xlsx");
const logger = require('./logger');

const InzidenzSheetName = 'LK_7-Tage-Inzidenz (fixiert)';

function convertToJson(excelFile) {
    const headerRow = 4;
    const landkreisColumn = 'B';
    const firstDataColumn = 'D';
    logger.debug('Parsing XLSX data');
    const book = XLSX.read(excelFile, { cellDates: true });
    const sheet = book.Sheets[InzidenzSheetName];

    function toDate(cell) {
        if (!cell) {
            return null;
        }
        if (cell.t === 's') {
            const s = cell.v;
            if (s.indexOf('.') !== -1) {
                return DateTime.fromFormat(s, 'dd.MM.yyyy').toISODate();
            }
            if (s.indexOf('/') !== -1) {
                return DateTime.fromFormat(s, 'M/d/yy').toISODate();
            }
            return s;
        }
        if (cell.t === 'd') {
            return cell.v.toISOString().substring(0, 10);
        }
        return cell.v;
    }

    function getAvailableDates() {
        logger.debug('Checking available dates');
        const dates = [];
        let colIndex = XLSX.utils.decode_col(firstDataColumn);
        let data = sheet[XLSX.utils.encode_cell({ r: headerRow, c: colIndex })];
        while (data && data.v) {
            dates.push({ column: colIndex, date: toDate(data) });
            colIndex += 1;
            data = sheet[XLSX.utils.encode_cell({ r: headerRow, c: colIndex })]
        }
        logger.debug(`found ${dates.length} dates. Latest date is ${dates[dates.length -1].date}`);
        return dates;
    }

    function getAvailableCounties() {
        logger.debug('Converting data for counties');
        const counties = [];
        let row = headerRow + 1;
        let c = XLSX.utils.decode_col(landkreisColumn);
        let data = sheet[XLSX.utils.encode_cell({ r: row, c })];
        while (data && data.v) {
            counties.push({
                name: data.v,
                inzidenz: dates.map(({ column, date }) => ({
                    value: sheet[XLSX.utils.encode_cell({ r: row, c: column })]?.v,
                    date,
                })),
            });
            row += 1;
            data = sheet[XLSX.utils.encode_cell({ r: row, c })];
        }
        logger.debug(`Found ${counties.length} counties.`)
        return counties;
    }

    const dates = getAvailableDates();
    const counties = getAvailableCounties();
    return counties;
}

module.exports = convertToJson;