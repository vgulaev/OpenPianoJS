class App {
  constructor() {
    this.grandStaff = new GrandStaff();
  }

  async load(url) {
    this.grandStaff.load(url)
  }
}

window.addEventListener("load", async function( event ) {
  app = new App();
  app.load('data/xml/test.musicxml');
});
