class App {
  constructor() {
    // this.grandStaff = new GrandStaff();
    // this.mover = new Mover(this.grandStaff);
  }

  load(url) {
    // this.grandStaff.load(url)
    //   .then(() => {
    //     this.mover.updateStartPoint();
    //   });
  }
}

window.addEventListener('load', function( event ) {
  app = new App();
  app.load('data/xml/test1.musicxml');
});
