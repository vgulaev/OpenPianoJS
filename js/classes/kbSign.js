class KBSign {
  // 21 and 108
  constructor() {
    this.kb = [];
    this.queue = [];
    this.sign = "";
    this.count = 0;
  }

  push(msg) {
    var a = this.kb;
    if ("Note" == msg.constructor.name) {
      var key = msg.midiByte;
      if (-1 == key) return;
      if (-1 == a.indexOf(key)) a.push(key);
    } else {
      if (144 == msg.data[0]) {
        a.push(msg.data[1]);
        this.queue.push(msg.data[1]);
      } else if (128 == msg.data[0]) {
        if (this.queue.length == a.length) {
          this.queue.shift();
        }
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

  last(count) {
    var a = this.queue;
    var l = a.length;
    if (count > l) return "";
    return a.slice(l - count, l).sort().join(',')
  }

  pop(count) {
    for (var i = 0; i < count; i ++ ) this.queue.pop();
  }
}