const fs = require('fs');

async function readFileExample(){
    try {
        const data = await fs.readFile('myfile.txt', 'utf8');
    } catch (error) {
        console.error("Error", error)
    }
}

readFileExample();

const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile);

async function readWithPromisify(){
    try {
        const data = await readFileAsync('myfile.txt', 'utf8');
        console.log(data);
    } catch (error) {
        console.error("Error reading file:", error);
    }
}

readWithPromisify();
