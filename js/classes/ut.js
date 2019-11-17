class Ut {
  static async get(url, callback) {
    await new Promise( resolve => {
      var myRequest = new XMLHttpRequest();
      myRequest.open("get", url);
      myRequest.onload = function () {
        callback.call(this);
        resolve("Ok");
      };
      myRequest.send();
    });
  }

  static get20(theUrl) {
    return new Promise((resolve, reject) => {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) resolve(xmlHttp.responseText);
      }
      xmlHttp.open("GET", theUrl, true);
      xmlHttp.send();
    });
  }

  static getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static max(numArray) {
    return Math.max.apply(null, numArray);
  }

  static min(numArray) {
    return Math.min.apply(null, numArray);
  }

  static loadjs(src) {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');
      let loaded;
      script.src = src;
      script.async = false;

      script.onreadystatechange = script.onload = function() {
        if (!loaded) {
          resolve();
        }
        loaded = true;
      };

      document.head.appendChild(script);
    });
  }

  static rnd(x) {
    return Math.floor(Math.random() * x);
  }

  static l0(x) {
    return x < 10 ? '0' + x : x;
  }

  static getDateYYMMDDHHSS() {
    let d = new Date();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();
    let yy = d.getFullYear();
    let hh = d.getHours();
    let mi = d.getMinutes();
    let r = [yy, mm, dd, hh, mi].map(e => Ut.l0(e));
    return r[0] + '-' + r[1] + '-' + r[2] + ' ' + r[3] + ':' + r[4];
  }
}
