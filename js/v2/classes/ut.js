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
}
