const path = require('path');
const fs = require('fs');

const fabIcons = require('./fab');
const falIcons = require('./fal');
const farIcons = require('./far');
const fasIcons = require('./fas');

if (process.argv.length < 4) {
  console.log('Wrong format. Use: node index.js path_to_project_dir path_to_output_file');
  return;
}

const projectDirectory = process.argv[2];
const outputFile = process.argv[3];

const allIcons = {
  fab: fabIcons,
  fal: falIcons,
  far: farIcons,
  fas: fasIcons
}

const REGEX = /.*class="(fa[blrs]?) fa-([a-zA-Z0-9-]*).*".*/;

let iconList = {
  fab: {},
  fal: {},
  far: {},
  fas: {}
};

iconList['fab']['windows'] = allIcons['fab']['windows'];
iconList['fab']['apple'] = allIcons['fab']['apple'];

const findIcons = function (dir) {
  const files = fs.readdirSync(dir);

  files.forEach(function (file) {
    if (file.startsWith('.')) return;

    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findIcons(fullPath);
    } else {
      // Find if there is an icon
      if (path.extname(file) === '.html') {

        var lines = require('fs').readFileSync(fullPath, 'utf-8')
          .split('\n')
          .filter(Boolean);

        for (let line of lines) {
          const res = line.match(REGEX);
          if (res) {
            let type = res[1];
            const icon = res[2];
            if (type === 'fa') type = 'far';
            if (icon) iconList[type][icon] = allIcons[type][icon];
          }
        }
      }
    }
  });
};

findIcons(projectDirectory);

fs.copyFileSync('all.js', outputFile);

let data = fs.readFileSync(outputFile, 'utf8');
let result = data.replace(/fabfab/g, `var icons = ${JSON.stringify(iconList.fab)}`);
result = result.replace(/falfal/g, `var icons = ${JSON.stringify(iconList.fal)}`);
result = result.replace(/farfar/g, `var icons = ${JSON.stringify(iconList.far)}`);
result = result.replace(/fasfas/g, `var icons = ${JSON.stringify(iconList.fas)}`);
fs.writeFileSync(outputFile, result);
