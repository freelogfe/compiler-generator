const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const compressing = require('compressing');

async function downloadFile(url, dir, name) {
    const fileDir = path.resolve(dir);
    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir);
    }
    const filePath = path.resolve(fileDir, name);
    const writer = fs.createWriteStream(filePath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
    });
}

async function unzipFile(filePath, dir) {
    const fileDir = path.resolve(dir);
    if (!fs.existsSync(fileDir)) {
        fs.mkdirSync(fileDir);
    }
    await compressing.zip.uncompress(filePath, fileDir);
}

async function main() {
    const filePath = await downloadFile('https://cg.freelog.com/?language=JavaScript&color=userGroup', './', 'temp.zip');
    // console.log(filePath, 'filePath');
    await unzipFile(filePath, './gen');

    fs.removeSync(filePath);
}

main();