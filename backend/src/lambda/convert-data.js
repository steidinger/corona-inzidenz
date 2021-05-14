const logger = require('../utils/logger');
const downloadBinary = require('../utils/download-binary');
const convertToJson = require('../utils/convert-xlsx-to-json');
const upload = require('../utils/upload-to-s3');

async function handler() {
    try {
        const originalData = await downloadBinary(process.env.DATA_URL);
        const data = convertToJson(originalData);
        await upload(data);
        return {
            statusCode: 200
        };
    } catch (error) {
        logger.error('Could not download and convert RKI data' + error);
        return {
            statusCode: 500
        };
    }
}

module.exports = {
    handler
};