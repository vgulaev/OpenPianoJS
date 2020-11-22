class App {
  constructor() {
    this.grandStaff = new GrandStaff();
  }

  async load(url) {
    this.grandStaff.load(url)
  }
}

window.addEventListener('load', async function( event ) {
  app = new App();
  app.load('data/xml/test1.musicxml');
});

// mousestate = {
//   state: 'stop',
// };

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

// window.addEventListener("keydown", function (event) {
//   //  && ('root' == event.srcElement.id)
//   function move(dx) {
//     let x = parseInt(app.grandStaff.sheet.use.getAttribute('x'));
//     app.grandStaff.sheet.use.setAttribute('x', x + dx);
//     setTimeout(() => move(dx), 100);
//   }
//   if (('ArrowRight' == event.key) || ('ArrowLeft' == event.key)) {
//     if ('ArrowRight' == event.key) {
//       move(1);
//     } else {
//       move(-1);
//     }
//   }
// });
