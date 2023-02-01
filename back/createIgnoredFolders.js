const fs = require('fs');


async function action() {
    const data = "./data";
    if (!fs.existsSync(data)) fs.mkdirSync(data);
    const dataFiles = "./data/files";
    if (!fs.existsSync(dataFiles)) fs.mkdirSync(dataFiles);
    const logs = "./logs";
    if (!fs.existsSync(logs)) fs.mkdirSync(logs);
    const tmp = "./tmp";
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

    console.log("Done");
}

action()