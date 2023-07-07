import { database } from '../index';
import { objectStores } from '../../config';

export const insertRequest = async (payload) => {
  return await database?.addOne(objectStores.request, { ...payload, type: 'request', method: 'GET' });
};

export const fetchRequestList = async (parentId) => {
  return await database?.getByIndex(objectStores.request, 'parentId', parentId);
};

export const deleteRequest = async (id) => {
  return await database?.deleteByIndex(objectStores.request, 'id', id);
};
