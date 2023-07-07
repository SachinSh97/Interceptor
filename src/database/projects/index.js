import { database } from '..';
import { objectStores } from '../../config';

export const insertProject = async (payload) => {
  return await database?.addOne(objectStores.project, { ...payload, type: 'project' });
};

export const fetchProjectList = async (parentId) => {
  return await database?.getByIndex(objectStores.project, 'parentId', parentId);
};

export const deleteProject = async (id) => {
  return await database?.deleteByIndex(objectStores.project, 'id', id);
};
