import { lazy, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { database } from '../../database';
import { objectStores, collectionMenuOptions, collectionType } from '../../config';
import { getCollectionIcon } from '../../selectors';
import { sorting, compareNumber } from '../../utils/helper';
import { databaseInterface } from '../../IndexedDBHandler';

import threeDotIcon from '../../assets/Icons/three-dots.svg';
import './Collection.scss';
import Dialog from '../elements/Dialog';

const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const Repository = lazy(() => import('../Repository'));
const FormDialog = lazy(() => import('../FormDialog'));

const Collection = ({ requestId, setRequestId, setCollectionType }) => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [parentId, setParentId] = useState('');
  const [menuOption, setMenuOption] = useState('');

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
      let fetchedChildren = [];
      const children = await database?.getByIndex(objectStores.repository, 'parentId', parent?.id);
      const requests = await database?.getByIndex(objectStores.request, 'parentId', parent?.id);

      children?.forEach((child) => (child['type'] = 'repository'));
      requests?.forEach((request) => (request['type'] = 'request'));

      if (children?.length > 0) {
        fetchedChildren = await handleInsertAllFoldersAndRequests(children);
      }
      parent.children = [...(requests ?? []), ...fetchedChildren];
      return parent;
    });

    return Promise.all(parentPromises);
  };

  const handleMenuOnClick = (event, id) => {
    const { value } = event;
    switch (value) {
      case collectionMenuOptions?.newProject?.id:
        setParentId(id);
        setMenuOption(value);
        setShowFormDialog(true);
        break;
      case collectionMenuOptions?.newRequest?.id:
        setParentId(id);
        setMenuOption(value);
        setShowFormDialog(true);
        break;
      case collectionMenuOptions?.delete?.id:
        handleDelete(id);
        break;
      default:
        break;
    }
  };

  const handleDelete = async (id) => {
    try {
      await database?.deleteByIndex(objectStores.project, 'parentId', id);
      await database?.deleteByIndex(objectStores.request, 'parentId', id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId, name, description };
      if (menuOption === collectionMenuOptions?.newProject?.id) {
        payload['type'] = 'project';
        await database?.addOne(objectStores.project, payload);
      } else if (menuOption === collectionMenuOptions?.newRequest?.id) {
        payload['type'] = 'request';
        payload['method'] = 'GET';
        await database?.addOne(objectStores.request, payload);
      }
      setParentId('');
      setMenuOption('');
      handleCloseFormDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseFormDialog = () => setShowFormDialog(false);

  const renderMenu = (menuItems, id) => (
    <Menu
      menuButton={<img src={threeDotIcon} alt="more-icon" />}
      menuItems={menuItems}
      dividerIndices={[1, 3, 5]}
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
    <div className="collection">
      {collections?.map((collection, index) => (
        <Accordion
          key={collection?.id ?? index}
          title={collection?.title ?? ''}
          description={collection?.description ?? ''}
          type={collection?.type ?? ''}
          expandIcon={getCollectionIcon(collection?.type ?? '')}
          rightContent={renderMenu(Object.values(collectionMenuOptions), collection?.id)}
          onTriggerOpening={() => setCollectionType(collection?.type ?? '')}
        >
          <Repository
            repositories={renderCollections(collection?.type ?? '')}
            requestId={requestId}
            setRequestId={setRequestId}
          />
        </Accordion>
      ))}
      {showFormDialog && (
        <FormDialog
          open={showFormDialog}
          onSubmit={handleFormOnSubmit}
          onClose={handleCloseFormDialog}
        />
      )}
    </div>
  );
};

export default Collection;
