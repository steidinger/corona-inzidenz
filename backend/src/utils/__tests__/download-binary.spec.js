const downloadBinary = require('../download-binary');
const {Buffer} = require('buffer');

describe('downloadBinary', () => {
    it('should throw an error if URL is invalid', async () => {
        await expect(downloadBinary('http://localhost/garbage')).rejects.toThrow();
    });

    it('should return a Buffer for a valid URL', async () => {
        const rkiUrl = 'https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Daten/Fallzahlen_Kum_Tab.xlsx?__blob=publicationFile';
        await expect(downloadBinary(rkiUrl)).resolves.toEqual(expect.any(Buffer));
    });
});