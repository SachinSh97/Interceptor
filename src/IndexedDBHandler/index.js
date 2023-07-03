import { IndexedDBWorker } from '../workers';

const messageHandlers = new Map();

const handleOnMessage = (event) => {
  const { eventType, response, errorResponse } = event.data;
  if (messageHandlers.has(eventType)) {
    const { resolve, reject } = messageHandlers.get(eventType);
    errorResponse ? reject(errorResponse) : resolve(response);
    messageHandlers.delete(eventType);
  }
};

export const databaseInterface = (eventType, payload) => {
  return new Promise((resolve, reject) => {
    IndexedDBWorker.onmessage = handleOnMessage;
    messageHandlers.set(eventType, { resolve, reject });
    IndexedDBWorker.postMessage({ eventType, payload });
  });
};

export const initializeIndexedDB = async () => {
  return await databaseInterface('initialize-indexedDB');
};
