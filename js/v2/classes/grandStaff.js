class GrandStaff {
  constructor() {
    this.root = document.getElementById('GrandStaff');
    this.header = new GrandStaffHeader(this);
    this.body = new GrandStaffBody(this);
  }

  async load(url) {
    this.sheet = new Sheet(this);
    this.sheet.load(url);
  }
}
