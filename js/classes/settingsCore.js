class SettingsCore {
  constructor() {
    this.hash = {};
    this._fileName = 0;
    this._temp = 60;
    this.staff = 0;
    this.parseFromHash();
  }

  parseFromHash() {
    try {
      var s = JSON.parse(document.location.hash.substring(1));
      if (undefined != s["t"]) {
        this.temp = parseInt(s["t"]);
      }
      if (undefined != s["f"]) {
        this.fileName = parseInt(s["f"]);
      }
    } catch (e) {
      console.log("parseFromHash");
    }
  }

  updateHash(key, value) {
    this.hash[key] = value;
    document.location.hash = JSON.stringify(this.hash);
  }

  set temp( value ) {
    this._temp = value;
    this.updateHash("t", value);
  }

  get temp() {
    return this._temp;
  }

  set fileName( value ) {
    this._fileName = value;
    this.updateHash("f", value);
  }

  get fileName() {
    return this._fileName;
  }
}
