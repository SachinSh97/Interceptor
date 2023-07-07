import { database } from '../index';
import { objectStores } from '../../config';
import { sorting, compareTimestamp } from '../../utils/helper';

export const insertRequest = async (payload) => {
  return await database?.addOne(objectStores.request, { ...payload, type: 'request', method: 'GET' });
};

export const fetchRequestList = async (parentId) => {
  let requests = await database?.getByIndex(objectStores.request, 'parentId', parentId);
  requests = sorting(requests, 'timestamp', compareTimestamp);
  return requests;
};

export const deleteRequests = async (indexName, indexValue) => {
  return await database?.deleteByIndex(objectStores.request, indexName, indexValue);
};
