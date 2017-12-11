class KBSign {
  // 21 and 108
  constructor() {
    this.kb = [];
    this.sign = "";
    this.count = 0;
  }

  push(msg) {
    var a = this.kb;
    if (144 == msg.data[0]) {
      a.push(msg.data[1]);
    } else if (128 == msg.data[0]) {
      a.splice(a.indexOf(msg.data[1]), 1);
    }
    a.sort();
    this.sign = a.join(',');
    this.count = a.length;
  }
}