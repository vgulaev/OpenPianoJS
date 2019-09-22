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
}
