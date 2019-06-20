class KBSign {
  // 21 and 108
  constructor() {
    this.kb = new Set();
  }

  push(msg) {
    if ("Note" == msg.constructor.name) {
      var key = msg.midiByte;
      if (-1 == key) return;
      this.kb.add(key);
    } else {
      if (144 == msg.data[0] && 0 < msg.data[2] ) {
        this.kb.add(msg.data[1]);
      } else if (0 == msg.data[2] || 128 == msg.data[0]) {
        this.kb.delete(msg.data[1]);
      }
    }
  }

  has(kb) {
    for (let e of kb) {
      if (!this.kb.has(e)) return false;
    }
    return true;
  }

  remove(kb) {
    for (let e of kb) {
      this.kb.delete(e);
    }
  }
}