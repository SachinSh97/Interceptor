import { database } from '..';
import { objectStores } from '../../config';

export const fetchProjectList = async (parentId) => {
  return await database?.getByIndex(objectStores.project, 'parentId', parentId);
};
