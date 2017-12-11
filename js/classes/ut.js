class Ut {
  static getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
