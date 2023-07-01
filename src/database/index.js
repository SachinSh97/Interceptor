import { nanoid } from 'nanoid';
import { DATABASE_NAME, DATABASE_VERSION, objectStores } from '../config';
import { collections } from '../resources';

// Singleton Pattern
export default class IndexedDBLibrary {
  constructor() {
    // use the already created instance only.
    if (IndexedDBLibrary.instance) return IndexedDBLibrary.instance;

    this.db = this.openDBConnect();

    IndexedDBLibrary.instance = this;
  }

  openDBConnect() {
    return new Promise((resolve, reject) => {
      if ('indexedDB' in window) {
        const IDBRequest = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

        IDBRequest.onupgradeneeded = (event) => this.initializeDB(event);
        IDBRequest.onsuccess = (event) => resolve(event?.target?.result);
        IDBRequest.onerror = (event) => reject(event?.target?.error);
      } else {
        reject(new Error('IndexedDB is not supported in this browser'));
      }
    });
  }

  // construct initial data
  contructInitialCollectionData() {
    return collections?.map((collection, index) => ({
      id: nanoid(),
      sequence: index,
      title: collection?.title ?? '',
      description: collection?.description ?? '',
      type: collection?.type,
    }));
  }

  initializeDB(event) {
    const db = event?.target?.result;
    //Perform any necessary databse initialization, it will only call when DB not exist or new version exist.
    if (!db?.objectStoreNames?.contains(objectStores.collections)) {
      const transaction = event.target.transaction;

      transaction.oncomplete = () => {
        const collections = this.contructInitialCollectionData();
        this.addAll(objectStores.collections, collections);
      };

      const collectionStore = db?.createObjectStore(objectStores.collections, { keyPath: 'id' });
      collectionStore?.createIndex('type', 'type', { unique: true });
    }

    if (!db?.objectStoreNames?.contains(objectStores.project)) {
      const collectionStore = db?.createObjectStore(objectStores.project, { keyPath: 'id' });
      collectionStore?.createIndex('parentId', 'parentId', { unique: false });
      collectionStore?.createIndex('environmentId', 'environmentId', { unique: false });
    }

    if (!db?.objectStoreNames?.contains(objectStores.repository)) {
      const collectionStore = db?.createObjectStore(objectStores.repository, { keyPath: 'id' });
      collectionStore?.createIndex('parentId', 'parentId', { unique: false });
    }

    if (!db?.objectStoreNames?.contains(objectStores.request)) {
      const collectionStore = db?.createObjectStore(objectStores.request, { keyPath: 'id' });
      collectionStore?.createIndex('parentId', 'parentId', { unique: false });
      collectionStore?.createIndex('responseId', 'responseId', { unique: true });
    }

    if (!db?.objectStoreNames?.contains(objectStores.response)) {
      const collectionStore = db?.createObjectStore(objectStores.response, { keyPath: 'id' });
      collectionStore?.createIndex('parentId', 'parentId', { unique: true });
    }

    if (!db?.objectStoreNames?.contains(objectStores.environment)) {
      const collectionStore = db?.createObjectStore(objectStores.environment, { keyPath: 'id' });
      collectionStore?.createIndex('name', 'name', { unique: true });
    }
  }

  addOne(storeName, data) {
    return this.db.then((db) => {
      return new Promise((resolve, reject) => {
        try {
          const transaction = db?.transaction([storeName], 'readwrite');
          const objectStore = transaction?.objectStore(storeName);

          const request = objectStore?.add(data);

          request.onsuccess = (event) => {
            const key = event?.target?.result;
            resolve(key);
          };
          request.onerror = (event) => {
            reject(event?.target?.error ?? '');
          };
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  addAll(storeName, dataArray) {
    return this.db.then((db) => {
      return new Promise((resolve, reject) => {
        try {
          const keys = [];
          const base = 0;
          const transaction = db?.transaction([storeName], 'readwrite');
          const objectStore = transaction?.objectStore(storeName);

          const processNextData = (index) => {
            // Stop processing if all data entries have been processed
            if (index >= dataArray.length) return;

            const data = dataArray[index];
            const request = objectStore?.add(data);

            request.onsuccess = (event) => {
              const key = event.target.result;
              keys.push(key);
              processNextData(index + 1);
            };

            request.onerror = (event) => {
              reject(event.target.error);
              transaction.abort();
            };
          };

          processNextData(base);

          transaction.oncomplete = () => {
            resolve(keys);
          };

          transaction.onerror = (event) => {
            reject(event?.target?.error);
          };
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getByIndex(storeName, indexName, value) {
    return this.db.then((db) => {
      return new Promise((resolve, reject) => {
        try {
          const transaction = db?.transaction([storeName], 'readonly');
          const objectStore = transaction?.objectStore(storeName);
          let request;

          if (indexName === 'id') {
            request = objectStore?.get(value);
          } else {
            const index = objectStore?.index(indexName);
            const range = IDBKeyRange?.only(value);
            request = index?.getAll(range);
          }

          request.onsuccess = (event) => {
            resolve(event?.target?.result);
          };

          request.onerror = (event) => {
            reject(event?.target?.error);
          };
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  getAll(storeName) {
    return this.db.then((db) => {
      return new Promise((resolve, reject) => {
        try {
          const transaction = db?.transaction([storeName], 'readonly');
          const objectStore = transaction?.objectStore(storeName);
          const request = objectStore?.getAll();

          request.onsuccess = (event) => {
            resolve(event?.target?.result);
          };

          request.onerror = (event) => {
            reject(event?.target?.error);
          };
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  updateByIndex(storeName, indexName, value, updatedData) {}

  deleteByIndex(storeName, indexName, value) {
    return this.db.then((db) => {
      return new Promise((resolve, reject) => {
        try {
          const transaction = db?.transaction([storeName], 'readwrite');
          const objectStore = transaction?.objectStore(storeName);

          if (indexName === 'id') {
            const request = objectStore?.delete(indexName);
            request.onsuccess = () => {
              resolve({ message: `Successfully delete ${value}` });
            };
            request.onerror = (event) => {
              reject(event?.target?.error);
            };
          } else {
            const index = objectStore?.index(indexName);
            const range = IDBKeyRange?.only(value);
            const request = index?.openCursor(range);
            request.onsuccess = (event) => {
              const cursor = event?.target?.result;
              if (cursor) {
                cursor.delete();
                cursor.continue();
              } else {
                resolve();
              }
            };
            request.onerror = (event) => {
              reject(event?.target?.error);
            };
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

const database = new IndexedDBLibrary();

export { database };
