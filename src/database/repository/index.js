import { database } from '..';
import { objectStores } from '../../config';

export const fetchRespositoryList = async (parentId) => {
  return await database?.getByIndex(objectStores.repository, 'parentId', parentId);
};
