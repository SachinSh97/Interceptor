/* eslint-disable */
import { database } from '../../database';

const workerCode = () => {
  self.onmessage = (event) => {
    const { eventType = '', data = '' } = event?.data ?? {};
    switch (eventType) {
      case 'initialize-indexedDB':
        database?.openDBConnect();
        break;
      case 'update-collection':
        break;
      default:
        break;
    }
  };
};

export default workerCode;
