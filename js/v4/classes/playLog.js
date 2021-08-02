import { OwnDB } from './ownDB.js';

export class PlayLog {
  constructor(db) {
    this.db = db;
    this.items = [];
    console.log('Hello');
  }

  readDataFromDB() {
    let transaction = this.db.transaction('SpendTime', 'readwrite');
    let objectStore = transaction.objectStore('SpendTime');

    let cursor = objectStore.openCursor();
    cursor.onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        this.items.push(cursor.value);
        cursor.continue();
      }
    };
    transaction.oncomplete = () => {
      let sorted = this.items.sort((a, b) => {
        return new Date(b.dateTime) - new Date(a.dateTime);
      });
      this.render(sorted);
      console.log(sorted);
      // renderTable();
    };
  }

  render(items) {
    let body = document.querySelector('body');
    body.innerHTML = items.map((e) => `
      <p>
        Name: <span>${e.name}</span>
        From: <span>${e.from}</span>
        To: <span>${e.to}</span>
      </p>
      `).join('\n');
  }
}

window.addEventListener("load", function( event ) {
  let db = (new OwnDB('stat2021')).then((db) => {
    let p = new PlayLog(db);
    p.readDataFromDB();
  });
  // body = document.getElementById('tBody');
  // let owndb = (new OwnDB).then((db) => {
  //   fillReport(db);
  // });
});
