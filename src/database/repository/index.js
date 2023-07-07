import { database } from '..';
import { objectStores } from '../../config';

export const insertRepository = async (payload) => {
  return await database?.addOne(objectStores.repository, { ...payload, type: 'repository' });
};

export const fetchRespositoryList = async (parentId) => {
  return await database?.getByIndex(objectStores.repository, 'parentId', parentId);
};

export const deleteRepository = async (id) => {
  const repositoriesId = [id];
  await fetchRespositoryList(id);
  return await database?.deleteByIndex(objectStores.repository, 'id', id);
};
