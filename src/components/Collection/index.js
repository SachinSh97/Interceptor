import { Suspense, lazy, useEffect, useState } from 'react';

import { insertProject, fetchCollections, insertRequest, deleteProjects, deleteRequests } from '../../database';
import { collectionMenuOptions } from '../../config';
import { getCollectionIcon } from '../../selectors';

import threeDotIcon from '../../assets/Icons/three-dots.svg';
import './Collection.scss';

const Loader = lazy(() => import('../elements/Loader'));
const Menu = lazy(() => import('../elements/Menu'));
const Accordion = lazy(() => import('../elements/Accordion'));
const Projects = lazy(() => import('../Projects'));
const FormDialog = lazy(() => import('../FormDialog'));

const Collection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [parentCollectionId, setParentCollectionId] = useState('');
  const [formDialogType, setFormDialogType] = useState('');
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    handleFetchCollection();
  }, []);

  const handleFetchCollection = () =>
    fetchCollections()
      .then((draftCollections) => setCollections(draftCollections))
      .catch((errorResponse) => console.log(errorResponse))
      .finally(() => setIsLoading(false));

  const handleMenuOnClick = (event, id) => {
    switch (event?.value) {
      case collectionMenuOptions?.newProject?.id:
      case collectionMenuOptions?.newRequest?.id:
        setParentCollectionId(id);
        setFormDialogType(event?.value);
        break;
      case collectionMenuOptions?.delete?.id:
        handleDelete(id);
        break;
      default:
        break;
    }
  };

  const handleDelete = (id) => {
    setIsLoading(true);
    Promise.all([deleteProjects('parentId', id), deleteRequests('parentId', id)])
      .then(() => setRefresh(!refresh))
      .catch((errorResponse) => console.log(errorResponse))
      .finally(() => setIsLoading(false));
  };

  const handleFormOnSubmit = async ({ name, description }) => {
    try {
      const payload = { parentId: parentCollectionId, name, description };
      const insertHandler = formDialogType === collectionMenuOptions?.newProject?.id ? insertProject : insertRequest;
      await insertHandler(payload);
      handleCloseFormDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseFormDialog = () => {
    setParentCollectionId('');
    setFormDialogType('');
    setRefresh(!refresh);
  };

  const renderMenu = (menuItems, id) => (
    <Menu
      menuButton={<img src={threeDotIcon} alt="more-icon" />}
      menuItems={menuItems}
      dividerIndices={[1, 3, 5]}
      onClick={(event) => handleMenuOnClick(event, id)}
    />
  );

  return (
    <Suspense fallback={<Loader />}>
      <div className="collection">
        {isLoading && <Loader />}
        {collections?.map((collection, index) => (
          <Accordion
            key={collection?.id ?? index}
            title={collection?.title ?? ''}
            description={collection?.description ?? ''}
            type={collection?.type ?? ''}
            expandIcon={getCollectionIcon(collection?.type ?? '')}
            rightContent={renderMenu(Object.values(collectionMenuOptions), collection?.id)}
          >
            <Projects parentId={collection?.id ?? ''} reloadProjects={refresh} />
          </Accordion>
        ))}
        <Suspense fallback={<Loader />}>
          {!!formDialogType && (
            <FormDialog type={formDialogType} onSubmit={handleFormOnSubmit} onClose={handleCloseFormDialog} />
          )}
        </Suspense>
      </div>
    </Suspense>
  );
};

export default Collection;
