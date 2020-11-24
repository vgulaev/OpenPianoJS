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
  // app.load('data/xml/Canon_in_D_full.musicxml');
  // app.load('data/xml/Beethoven Symphony No. 5 1 st movement Piano solo.musicxml');
  // app.load('data/xml/Chopin_Nocture_opus_9_number2.musicxml');
  // app.load('data/xml/Prelude_in_G_Minor_Op._23_No._5.musicxml');
  // app.load('data/xml/Maksim Mrvica - Croatian Rhapsody.musicxml');
  // app.load('data/xml/Debussy - Clair de Lune Suite Bergamasque No. 3.musicxml');
  // app.load('data/xml/BWV 847 Prelude C Minor.musicxml');
  // m = new MMover(app);
});

// window.addEventListener('mousedown', async function( event ) {
//     mousestate.state = 'move';
//     mousestate.base = event;
//     mousestate.use = app.grandStaff.sheet.use;

//     console.log(event);
// });

// window.addEventListener('mousemove', async function( event ) {
//     if ('move' != mousestate.state) return;
//     dx = event.clientX - mousestate.base.clientX;
//     app.grandStaff.sheet.use.setAttribute('x', 10 + dx);
//     // console.log(event);
// });
window.addEventListener("keydown", function (event) {
  if (('ArrowRight' == event.key) || ('ArrowLeft' == event.key) || ('ArrowDown' == event.key)) {
    if ('ArrowRight' == event.key) {
      app.mover.nextSmooth();
    } else if ('ArrowLeft' == event.key) {
      app.mover.prev();
    } else {
      m.dx = 0;
    }
  }
});
