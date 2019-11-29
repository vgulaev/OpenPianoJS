function renderRange(row) {
  return (undefined == row.from ? '0' : row.from ) + ':' + (undefined == row.to ? '0' : row.to)
}

function renderTime(lengthInSec) {
  let s = lengthInSec % 60;
  return Math.floor(lengthInSec / 60) + ':' + (s > 9 ? s : '0' + s);
}

function filter(row) {
  let res = true;
  let q = qName.value;
  if (q.length > 0) {
    res = res && (-1 != row.name.indexOf(q));
  }
  q = qRange.value;
  if (q.length > 0) {
    res = res && (-1 != renderRange(row).indexOf(q));
  }
  console.log(q);
  return res;
}

function renderTable(cursor, index) {
  body.innerHTML = '';
  items
    .filter((x) => filter(x))
    .sort((a, b) => a.day < b.day ? -1 : 0)
    .forEach((x, index) => {
    var el = document.createElement("div");
    el.classList.add('divTableRow');
    let content = `
      <div class="divTableCell">${index}</div>
      <div class="divTableCell">${x.day}</div>
      <div class="divTableCell">${x.name}</div>
      <div class="divTableCell">${renderRange(x)}</div>
      <div class="divTableCell">${renderTime(x.lengthInSec)}</div>`;
    el.innerHTML = content;
    body.append(el);
  });
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

function initListener() {
  ['qName', 'qRange'].forEach((el) => {
    el = document.getElementById(el);
    el.addEventListener('keyup', () => {
      renderTable();
    });
  });
}

window.addEventListener("load", function( event ) {
  items = [];
  body = document.getElementById('tBody');
  qName = document.getElementById('qName');
  qRange = document.getElementById('qRange');
  initListener();
  let owndb = (new OwnDB).then((db) => {
    fillReport(db);
  });
});
