const fetch = require('node-fetch');
const logger = require('./logger');

async function downloadBinary(url) {
    logger.debug(`Starting download from ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    return response.buffer();    
}

module.exports = downloadBinary;