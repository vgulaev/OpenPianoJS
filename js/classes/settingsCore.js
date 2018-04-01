class SettingsCore {
  constructor() {
    this.hash = {};
    this._fileName = 0;
    this._temp = 60;
    this._staff = 0;
    this.parseFromHash();
  }

  parseFromHash() {
    try {
      var s = eval('(' + document.location.hash.substring(1) + ')');
      //JSON.parse(document.location.hash.substring(1));
      if (undefined != s["t"]) {
        this.temp = parseInt(s["t"]);
      }
      if (undefined != s["f"]) {
        this.fileName = parseInt(s["f"]);
      }
      if (undefined != s["s"]) {
        this.staff = parseInt(s["s"]);
      }
    } catch (e) {
      console.log("parseFromHash");
    }
  }

  updateHash(key, value) {
    this.hash[key] = value;
    document.location.hash = JSON.stringify(this.hash).split('"').join('');
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

  set staff( value ) {
    this._staff = value;
    this.updateHash("s", value);
  }

  get staff() {
    return this._staff;
  }
}
