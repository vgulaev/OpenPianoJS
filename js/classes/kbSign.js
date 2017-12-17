class KBSign {
  // 21 and 108
  constructor() {
    this.kb = [];
    this.sign = "";
    this.count = 0;
  }

  push(msg) {
    var a = this.kb;
    if ("Note" == msg.constructor.name) {
      var key = msg.midiByte;
      if (-1 == key) return;
      a.push(key);
    } else {
      if (144 == msg.data[0]) {
        a.push(msg.data[1]);
      } else if (128 == msg.data[0]) {
        a.splice(a.indexOf(msg.data[1]), 1);
      }
    }
    a.sort();
    this.sign = a.join(',');
    this.count = a.length;
  }

  include(other) {
    if (other.kb.length > this.kb.length) return false;
    var res = true;
    var obj = this;
    return other.kb.every(x => this.kb.includes(x));
  }
}