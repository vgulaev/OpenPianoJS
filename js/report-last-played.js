function renderRange(row) {
  return (undefined == row.from ? '0' : row.from ) + ':' + (undefined == row.to ? '0' : row.to)
}

function zero(m) {
  return (m > 9 ? m : '0' + m);
}

function renderTime(lengthInSec) {
  let m = lengthInSec % 3600;
  let s = lengthInSec % 60;
  return Math.floor(lengthInSec / 3600) + ':' + zero(Math.floor(m / 60)) + ':' + zero(s);
}

function renderTable(cursor, index) {
  let data = {};
  items.forEach((row) => {
    let key = [row.name].join('-');
    if (!(key in data)) {
      data[key] = {'date': row.day, 'total': 0}
    } else {
      if (data[key]['date'] < row.day) {
        data[key]['date'] = row.day;
      }
      data[key]['total'] += row.lengthInSec;
    }
  });
  Object
    .keys(data)
    .sort()
    .forEach((x, index) => {
      var el = document.createElement("div");
      el.classList.add('divTableRow');
      let content = `
        <div class="divTableCell">${index}</div>
        <div class="divTableCell">${x}</div>
        <div class="divTableCell">${data[x]['date']}</div>
        <div class="divTableCell">${renderTime(data[x]['total'])}</div>`;
      el.innerHTML = content;
      body.append(el);
    });
  // body.innerHTML = '';
  // items
  //   .filter((x) => filter(x))
  //   .sort((a, b) => a.day < b.day ? -1 : 0)
  //   .forEach((x, index) => {
  //   var el = document.createElement("div");
  //   el.classList.add('divTableRow');
  //   let content = `
  //     <div class="divTableCell">${index}</div>
  //     <div class="divTableCell">${x.name}</div>
  //     <div class="divTableCell">${renderRange(x)}</div>
  //     <div class="divTableCell">${x.day}</div>`;
  //     // <div class="divTableCell">${renderTime(x.lengthInSec)}</div>`;
  //   el.innerHTML = content;
  //   body.append(el);
  // });
}

function fillReport(db) {
  let index = 0;

  let transaction = db.db.transaction('sheetsTiming', 'readwrite');
  let objectStore = transaction.objectStore('sheetsTiming');

  let cursor = objectStore.openCursor();
  cursor.onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor) {
      items.push(cursor.value);
      cursor.continue();
    }
  };
  transaction.oncomplete = function() {
    renderTable();
  };
}

window.addEventListener("load", function( event ) {
  items = [];
  body = document.getElementById('tBody');
  let owndb = (new OwnDB).then((db) => {
    fillReport(db);
  });
});
