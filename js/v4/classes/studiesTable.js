import { OwnDB } from './ownDB.js';

const mm = month => month > 9 ? month.toString() : `0${month}`

const yyyyMMDD = date => [date.getFullYear(), mm(date.getMonth() + 1), mm(date.getDate())].join('-')

const stringComparatorByField = field => ((a, b) => {
  if (a[field] < b[field]) {
    return -1
  }
  if (a[field] > b[field]) {
    return 1
  }
  return 0
})

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
    };
  }

  regroup(items) {
    const result = {}
    items.forEach(e => {
      const dateKey = yyyyMMDD(e.dateTime)
      if (!result[dateKey]) {
        result[dateKey] = {
          timeLength: 0,
          date: dateKey,
          items: {}
        }
      }
      if (!result[dateKey]?.items?.[e.name]) {
        result[dateKey].items[e.name] = {
          timeLength: 0
        }
      }
      result[dateKey].items[e.name].timeLength += e.timeLength
      result[dateKey].timeLength += e.timeLength
    })
    return Object.entries(result).map(([k, v]) => v).sort(stringComparatorByField('date')).reverse()
  }

  renderItems(items) {
    return Object.entries(items).map(([name, { timeLength }]) => ({
      name, timeLength
    })).sort(stringComparatorByField('name'))
    .map(e => `
      <div>${e.name}</div>
      <div>${(e.timeLength / 1000 / 60).toFixed(0)} min</div>
    `).join('\n')
  }

  render(items) {
    let body = document.querySelector('body')
    const regrouped = this.regroup(items)
    const newBody = regrouped
      .map(e => `
          <div style="border-top: 1px solid black; margin-top: 10px;">${e.date}</div>
          <div style="border-top: 1px solid black; margin-top: 10px;">
            <div style="display: grid; grid-template-columns: 3fr 1fr;">
              ${this.renderItems(e.items)}
            </div>
          </div>
          <div style="border-top: 1px solid black; margin-top: 10px;">${(e.timeLength / 1000 / 60).toFixed(0)} min</div>
      `).join('\n')

    body.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 3fr 1fr;">
        <div>Date</div>
        <div>Pieces</div>
        <div>Time spend</div>
        ${newBody}
      </div>`
  }
}

window.addEventListener("load", function( event ) {
  let db = (new OwnDB('stat2021')).then((db) => {
    let p = new PlayLog(db);
    p.readDataFromDB();
  });
});
