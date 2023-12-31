import { database } from '../index';
import { fetchProjectList } from '../projects';
import { fetchRespositoryList } from '../repository';
import { fetchRequestList } from '../requests';
import { objectStores } from '../../config';
import { collections } from '../../resources';
import { sorting, compareTimestamp } from '../../utils/helper';

// use to construct initial state of collection and insert in indexedDB
export const initializeCollection = async () => {
  const collectionObjects = collections?.map((collection) => ({
    title: collection?.title ?? '',
    description: collection?.description ?? '',
    type: collection?.type,
  }));

  return await database?.addAll(objectStores.collections, collectionObjects);
};

export const fetchCollections = async () => {
  let collections = await database?.getAll(objectStores.collections);
  collections = sorting(collections, 'timestamp', compareTimestamp);
  return collections;
};

export const fetchCollectionRequestsAndFolders = async (collectionId) => {
  const requests = await fetchRequestList(collectionId);
  const projects = await fetchProjectList(collectionId);

  await handleInsertAllFoldersAndRequests(projects);

  return [...projects, ...requests];
};

export const deleteCollectionData = async (collectionId) => {};

/** Helpers Functions **/
const handleInsertAllFoldersAndRequests = async (parents) => {
  const parentPromises = parents?.map(async (parent) => {
    let fetchedChildren = [];
    const children = await fetchRespositoryList(parent?.id);
    const requests = await fetchRequestList(parent?.id);

    if (children?.length > 0) {
      fetchedChildren = await handleInsertAllFoldersAndRequests(children);
    }
    parent.children = [...(requests ?? []), ...fetchedChildren];
    return parent;
  });

  return Promise.all(parentPromises);
};
