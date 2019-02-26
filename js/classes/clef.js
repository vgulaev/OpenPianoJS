let clefStruct = {
  'G2:F4': {
    1: 'G2',
    2: 'F4'
  },
  'F4:F4': {
    1: 'F4',
    2: 'F4'
  }};

class Clef {
  static get(key) {
    return clefStruct[key];
  }

  static checkClef(xmlData, currentClef) {
    let clef = xmlData.getElementsByTagName('clef');
    if (0 == clef.length) return currentClef;
    let key = currentClef.key.split(':');
    for (e of clef) {
      let i = parseInt(e.getAttribute('number'));
      let sign = e.querySelector('sign').innerHTML;
      let line = e.querySelector('line').innerHTML;
      key[i - 1] = sign + line;
    }

    return clefStruct[key.join(':')];
  }
}

for (e of Object.keys(clefStruct)) {
  clefStruct[e]['key'] = e;
}

// console.log(clefStruct);