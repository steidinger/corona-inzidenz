const aws = require("aws-sdk");

async function upload(data) {
    const s3 = new aws.S3();
    const bucketName = process.env.DATA_S3_BUCKET;
    const fileName = process.env.DATA_FILE;

    return s3.putObject({
        Body: JSON.stringify(data),
        Bucket: bucketName,
        Key: fileName,
    }).promise();
}

module.exports = upload;