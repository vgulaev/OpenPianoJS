class Stats {
  static pressKey() {
    var n = performance.now();
    if ((n - Stats.lastPressedTime) < 10000) {
      Stats.spendTime += (n - Stats.lastPressedTime);
    }
    Stats.keyCount += 1;
    Stats.saveState();
    Stats.lastPressedTime = n;
  }

  static read(key, defs, type) {
    var r = localStorage.getItem(key);
    if (null == r) {
      r = defs;
    } else {
      if ("float" == type) {
        r = parseFloat(r);
      } else if ("int" == type) {
        r = parseInt(r);
      }
    }
    return r;
  }

  static loadState() {
    var d = new Date();
    Stats.dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    Stats.lastPressedTime = Stats.read("lastPressedTime", performance.now(), "float");
    Stats.spendTime = Stats.read(Stats.dateKey + "-ms", 0, "float");
    Stats.keyCount = Stats.read(Stats.dateKey + "-k", 0, "int");
  }

  static saveState() {
    localStorage.setItem(Stats.dateKey + "-ms", Stats.spendTime);
    localStorage.setItem(Stats.dateKey + "-k", Stats.keyCount);
  }

  static info() {
    var s = Math.floor(Stats.spendTime / 1000) % 60;
    var m = Math.floor(Stats.spendTime / 1000 / 60);
    return `${m}m ${s}s`;
  }
}

Stats.loadState();
