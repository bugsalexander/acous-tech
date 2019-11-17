const fs = require('fs');

const file = JSON.parse(fs.readFileSync('./emojis.json', 'utf-8'));

const obj = {keys: [], values: []};

for (let i = 0; i < file.names.length; i += 1) {
  obj.keys.push(file.names[i]);
  obj.values.push(file.values[i]);
}

fs.writeFileSync('./mojis.json', JSON.stringify(obj, null, 2));