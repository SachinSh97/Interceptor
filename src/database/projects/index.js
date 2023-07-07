import { database } from '..';
import { objectStores } from '../../config';
import { sorting, compareTimestamp } from '../../utils/helper';

export const insertProject = async (payload) => {
  return await database?.addOne(objectStores.project, { ...payload, type: 'project' });
};

export const fetchProjectList = async (parentId) => {
  let projects = await database?.getByIndex(objectStores.project, 'parentId', parentId);
  projects = sorting(projects, 'timestamp', compareTimestamp);
  return projects;
};

export const deleteProjects = async (indexName, indexValue) => {
  return await database?.deleteByIndex(objectStores.project, indexName, indexValue);
};
