class App {
  constructor() {
  }

  init() {
    this.grandStaff = new GrandStaff();
  }
}

window.addEventListener("load", async function( event ) {
  app = new App();
  app.init();
  console.log(app);
});
