import { lazy, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { database } from '../../database';
import { objectStores, collectionMenuOptions, collectionType } from '../../config';
import { getCollectionIcon } from '../../selectors';
import { sorting, compareNumber } from '../../utils/helper';

import threeDotIcon from '../../assets/Icons/three-dots.svg';
import './Collection.scss';

const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const FolderStructure = lazy(() => import('../Repository'));

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [mockRequests, setMockRequests] = useState([]);
  const [redirectRequests, setRedirectRequests] = useState([]);
  const [cancelRequests, setCancelRequests] = useState([]);
  const [delayRequests, setDelayRequests] = useState([]);

  useEffect(() => {
    handleGetAllCollections();
  }, []);

  // Query all collection in DB
  const handleGetAllCollections = async () => {
    try {
      const collectionData = await database?.getAll(objectStores.collections);
      const sortedCollection = sorting(collectionData, 'sequence', compareNumber);
      const mockCollectionId = sortedCollection?.[0]?.id ?? '';
      const mockProjects = await database?.getByIndex(
        objectStores.project,
        'parentId',
        mockCollectionId,
      );
      const requests = await database?.getByIndex(
        objectStores.request,
        'parentId',
        mockCollectionId,
      );

      requests?.forEach((request) => (request['type'] = 'request'));

      const sortedMockRequests = sorting(mockProjects, 'sequence', compareNumber);
      sortedMockRequests?.forEach((item) => (item['type'] = 'repository'));
      await handleInsertAllFoldersAndRequests(sortedMockRequests);

      setMockRequests([...sortedMockRequests, ...requests]);
      setCollections(sortedCollection);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInsertAllFoldersAndRequests = async (parents) => {
    const parentPromises = parents?.map(async (parent) => {
      const children = await database?.getByIndex(objectStores.repository, 'parentId', parent?.id);
      const requests = await database?.getByIndex(objectStores.request, 'parentId', parent?.id);
      children?.forEach((child) => (child['type'] = 'repository'));
      requests?.forEach((request) => (request['type'] = 'request'));

      let fetchedChildren = [];
      if (children?.length > 0) {
        fetchedChildren = await handleInsertAllFoldersAndRequests(children);
      }
      parent.children = [...(requests ?? []), ...fetchedChildren];
      return parent;
    });

    return Promise.all(parentPromises);
  };

  const handleMenuOnClick = (event, id) => {
    const { value, syntheticEvent } = event;
    switch (value) {
      case 'NEW_PROJECT':
        // handleAddNewProject()
        break;
      default:
        break;
    }
  };

  const renderMenu = (menuItems, id) => (
    <Menu
      menuButton={<img src={threeDotIcon} alt="more-icon" />}
      menuItems={menuItems}
      dividerIndices={[1, 3, 6]}
      onClick={(event) => handleMenuOnClick(event, id)}
    />
  );

  const renderCollections = (type) =>
    ({
      [collectionType.mockRequest]: mockRequests,
      [collectionType.redirectRequest]: redirectRequests,
      [collectionType.cancelRequest]: cancelRequests,
      [collectionType.delayRequest]: delayRequests,
    }[type]);

  return (
    <div className="collection-tab-panel">
      {collections?.map((collection, index) => (
        <Accordion
          key={collection?.id ?? index}
          title={collection?.title ?? ''}
          description={collection?.description ?? ''}
          type={collection?.type ?? ''}
          expandIcon={getCollectionIcon(collection?.type ?? '')}
          rightContent={renderMenu(collectionMenuOptions, collection?.id)}
        >
          <FolderStructure repositories={renderCollections(collection?.type ?? '')} />
        </Accordion>
      ))}
    </div>
  );
};

export default Collection;
