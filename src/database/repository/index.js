import { database } from '..';
import { objectStores } from '../../config';
import { sorting, compareTimestamp } from '../../utils/helper';
import { deleteRequests } from '../requests';

export const insertRepository = async (payload) => {
  return await database?.addOne(objectStores.repository, { ...payload, type: 'repository' });
};

export const fetchRespositoryList = async (parentId) => {
  let repositories = await database?.getByIndex(objectStores.repository, 'parentId', parentId);
  repositories = sorting(repositories, 'timestamp', compareTimestamp);
  return repositories;
};

export const deleteRepository = async (indexName, indexValue) => {
  const deletedRepositories = await database?.deleteByIndex(objectStores.repository, indexName, indexValue);
  const promises = deletedRepositories?.map((repositoryId) => deleteRequests('parentId', repositoryId));
  await Promise.all(promises);
  return deletedRepositories;
};
