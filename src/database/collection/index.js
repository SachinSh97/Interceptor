import { objectStores } from '../../config';
import { collections } from '../../resources';
import { database } from '../index';

// use to construct initial state of collection and insert in indexedDB
export const initializeCollection = async () => {
  const collectionObjects = collections?.map((collection, index) => ({
    sequence: index,
    title: collection?.title ?? '',
    description: collection?.description ?? '',
    type: collection?.type,
    timestamp: new Date().toISOString(),
  }));

  return await database?.addAll(objectStores.collections, collectionObjects);
};

export const fetchCollectionList = async () => {
  await setTimeout(() => console.log('collection created successfully'), 1000);
};
