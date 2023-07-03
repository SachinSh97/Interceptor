import { database } from '../index';
import { objectStores } from '../../config';

export const fetchRequestList = async (parentId) => {
  return await database?.getByIndex(objectStores?.request, 'parentId', parentId);
};
