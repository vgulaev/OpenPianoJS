class Ut {
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

  static innerHTML(xml, tagName) {
    let e = xml.querySelector(tagName);
    if (null == e) return null;
    return e.innerHTML;
  }

  static parseInt(xml, tagName) {
    let i = Ut.innerHTML(xml, tagName);
    return (null == i ? null : parseInt(i));
  }

  static clefOffset(clef) {
    let res = {x: 32}
    if (1 == clef.number) {
      if (-1 != ['G0', 'G-1', 'G8'].indexOf(clef.toS()))
        res.y = 128;
      if (-1 != ['F0', '8F', 'F8'].indexOf(clef.toS()))
        res.y = 101;
    } else {
      if (-1 != ['F0', '8F', 'F8'].indexOf(clef.toS()))
        res.y = 259;
      if (-1 != ['G0', '8G', 'G8'].indexOf(clef.toS()))
        res.y = 286;
    }
    return res;
  }
}
