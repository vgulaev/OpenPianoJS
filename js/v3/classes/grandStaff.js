class GrandStaff {
  constructor() {
    this.root = document.getElementById('GrandStaff');
    this.header = new GrandStaffHeader(this);
    this.body = new GrandStaffBody(this);
    this.sheet = new Sheet(this);
  }

  load(url) {
    return new Promise((resolve, reject) => {
      this.sheet.load(url)
        .then(() => resolve());
    });
  }
}
