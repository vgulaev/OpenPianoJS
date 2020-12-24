const fs = require('fs');

files = [];

function feadFolder(path) {
  let list = fs.readdirSync(path);
  files = files.concat(list.filter((e) => fs.statSync(path + e).isFile()).map(e => `${path}${e}`))
  list
    .filter((e) => fs.statSync(path + e).isDirectory())
    .forEach((e) => feadFolder(`${path}${e}/`));
}

function getJSList() {
 feadFolder('./v4/');
 fs.writeFileSync('./scripts.js', `var scripts = [${files.map(e => `'${e}'`).join(', \n')}];`);
 console.log(files);
}

getJSList();

console.log('hl');
