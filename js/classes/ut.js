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

  static getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
