class App {
  constructor() {
    this.grandStaff = new GrandStaff();
    this.mover = new Mover(this.grandStaff);
  }

  load(url) {
    this.grandStaff.load(url)
      .then(() => {
        this.mover.updateStartPoint();
      });
  }
}

window.addEventListener('load', function( event ) {
  app = new App();
  app.load('data/xml/test1.musicxml');
  // app.load('data/xml/Beethoven Symphony No. 5 1 st movement Piano solo.musicxml');
  // app.load('data/xml/BWV 847 Prelude C Minor.musicxml');
  // app.load('data/xml/Canon_in_D_full.musicxml');
  // app.load('data/xml/Chopin_Nocture_opus_9_number2.musicxml');
  // app.load('data/xml/Debussy - Clair de Lune Suite Bergamasque No. 3.musicxml');
  // app.load('data/xml/Jingle_Bells.musicxml');
  // app.load('data/xml/Maksim Mrvica - Croatian Rhapsody.musicxml');
  // app.load('data/xml/Mozart-Fantasia in D Minor K. 397.musicxml');
  // app.load('data/xml/Prelude_in_G_Minor_Op._23_No._5.musicxml');
  // m = new MMover(app);
});

window.addEventListener("keydown", function (event) {
  if (('ArrowRight' == event.key) || ('ArrowLeft' == event.key) || ('ArrowDown' == event.key)) {
    if ('ArrowRight' == event.key) {
      app.mover.next();
    } else if ('ArrowLeft' == event.key) {
      app.mover.prev();
    }
  }
});
