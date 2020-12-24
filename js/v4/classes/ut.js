export class Ut {
  static get(theUrl, random) {
    let url = theUrl;
    if (true == random) url += '?' + Math.random();
    return new Promise((resolve, reject) => {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) resolve(xmlHttp.responseText);
      }
      xmlHttp.open("GET", url, true);
      xmlHttp.send();
    });
  }

  static iterateChildren(node, callBack) {
    if (0 == node.childElementCount) return;
    for (let childNode of node.children) {
      callBack.apply(this, [childNode]);
      Ut.iterateChildren(childNode, callBack);
    }
  }

  static parseChildren(o, xml) {
    for (let c of xml.children) {
      if (0 == c.childElementCount) {
        if ('' == c.innerHTML) {
          o[c.tagName] = true
        } else {
          let i = parseInt(c.innerHTML);
          if (isNaN(i)) {
            o[c.tagName] = c.innerHTML;
          } else {
            o[c.tagName] = i;
          }
        }
      } else {
        o[c.tagName] = {};
        this.parseChildren(o[c.tagName], c);
      }
    }
  }

  static clefOffset(clef) {
    let res = {x: 32}
    if (1 == clef.number) {
      if (-1 != clef.toS().indexOf('G'))
        res.y = 128;
      if (-1 != clef.toS().indexOf('F'))
        res.y = 101;
    } else {
      if (-1 != clef.toS().indexOf('F'))
        res.y = 259;
      if (-1 != clef.toS().indexOf('G'))
        res.y = 286;
    }
    return res;
  }
}
