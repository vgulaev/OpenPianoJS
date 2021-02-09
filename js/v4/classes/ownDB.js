export class OwnDB {
  constructor(nameDB) {
    this.dbName = nameDB;
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      }
      this.request = window.indexedDB.open(nameDB, 1);

      this.request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this);
      };

      this.request.onupgradeneeded = (event) => {
        var db = event.target.result;
        var objectStore = db.createObjectStore('SpendTime', {autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        resolve(this);
      };
    })
  }

  transaction(name) {
    return this.db.transaction(name, 'readwrite');
  }

  store(name) {
    return this.transaction(name).objectStore(name);
  }
}
