import { nanoid } from 'nanoid';

import { successCode, errorCodes, objectStores } from '../config';

import { initializeCollection, fetchCollections, fetchCollectionRequestsAndFolders } from './collection';
import { fetchProjectList, insertProject, deleteProjects } from './projects';
import { fetchRespositoryList, insertRepository, deleteRepository } from './repository';
import { fetchRequestList, insertRequest, deleteRequests } from './requests';

// Singleton Pattern
export default class IndexedDBLibrary {
  constructor() {
    // use the already created instance only.
    if (IndexedDBLibrary.instance) return IndexedDBLibrary.instance;

    this.db = null;

    IndexedDBLibrary.instance = this;
  }

  openDBConnect(dbName, dbVersion) {
    return new Promise((resolve, reject) => {
      try {
        if ('indexedDB' in window) {
          const IDBRequest = indexedDB.open(dbName, dbVersion);

          IDBRequest.onupgradeneeded = (event) => {
            this.db = event?.target?.result;
            this.initializeDB(event);
          };

          IDBRequest.onsuccess = (event) => {
            this.db = event?.target?.result;
            resolve({ code: successCode.indexedDBInitiatedSuccessfully });
          };

          IDBRequest.onerror = (event) => {
            throw new Error(event?.target?.errorCode);
          };
        } else {
          throw new Error(errorCodes.indexedDBNotSupported);
        }
      } catch (error) {
        reject({ code: error?.message ?? errorCodes?.somethingWentWrong });
      }
    });
  }

  initializeDB(event) {
    const db = event?.target?.result;
    //Perform any necessary databse initialization, it will only call when DB not exist or new version exist.
    if (!db?.objectStoreNames?.contains(objectStores.collections)) {
      const transaction = event.target.transaction;

      transaction.oncomplete = () => {
        initializeCollection();
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
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db?.transaction([storeName], 'readwrite');
        const objectStore = transaction?.objectStore(storeName);

        const payload = { id: nanoid(), timestamp: new Date().toISOString(), ...data };
        const request = objectStore?.add(payload);

        request.onsuccess = () => {
          resolve(payload);
        };

        request.onerror = (event) => {
          reject(event?.target?.error ?? '');
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  addAll(storeName, dataArray) {
    return new Promise((resolve, reject) => {
      try {
        const base = 0;
        const response = [];
        const transaction = this.db?.transaction([storeName], 'readwrite');
        const objectStore = transaction?.objectStore(storeName);

        const processNextData = (index) => {
          // Stop processing if all data entries have been processed
          if (index >= dataArray.length) return;

          const timestamp = new Date().toISOString();
          const payload = { id: nanoid(), timestamp: `${timestamp.slice(0, -1)}.${index}Z`, ...dataArray?.[index] };
          const request = objectStore?.add(payload);

          request.onsuccess = () => {
            response.push(payload);
            processNextData(index + 1);
          };

          request.onerror = (event) => {
            reject(event.target.error);
            transaction.abort();
          };
        };

        processNextData(base);

        transaction.oncomplete = () => {
          resolve(response);
        };

        transaction.onerror = (event) => {
          reject(event?.target?.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  getByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db?.transaction([storeName], 'readonly');
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
  }

  getAll(storeName) {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db?.transaction([storeName], 'readonly');
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
  }

  deleteByIndex(storeName, indexName, value) {
    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db?.transaction([storeName], 'readwrite');
        const objectStore = transaction?.objectStore(storeName);

        if (indexName === 'id') {
          const request = objectStore?.delete(value);
          request.onsuccess = (event) => {
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
  }
}

const database = new IndexedDBLibrary();

export {
  database,
  fetchProjectList,
  fetchRespositoryList,
  fetchRequestList,
  insertProject,
  insertRepository,
  insertRequest,
  deleteProjects,
  deleteRepository,
  deleteRequests,
  fetchCollections,
  fetchCollectionRequestsAndFolders,
};
