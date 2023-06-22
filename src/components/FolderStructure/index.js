import { lazy, useState } from 'react';
import classNames from 'classnames';

import openFolderIcon from '../../assets/Icons/open-folder.svg';
import threeDotIcon from '../../assets/Icons/three-dots.svg';

import './FolderStructure.scss';

const Tag = lazy(() => import('../elements/Tag'));
const Accordion = lazy(() => import('../elements/Accordion'));

const FolderStructure = ({ folders }) => {
  const [selectedFile, setSelectedFile] = useState('');

  const handleFileOnClick = (event, folder) => {
    event?.stopPropagation();
  };

  const renderTagType = (method) =>
    ({ GET: 'primary', POST: 'success', DELETE: 'danger', PUT: 'secondary', PATCH: 'ternary' }[method?.toUpperCase()] ??
    '');

  return (
    <div className="folder-structure">
      {folders?.map((folder, index) =>
        folder?.type === 'folder' ? (
          <Accordion
            key={folder?.key ?? index}
            title={folder?.title}
            description={folder?.description ?? ''}
            expandIcon={openFolderIcon}
            rightIcon={threeDotIcon}
          >
            <FolderStructure folders={folder?.children} />
          </Accordion>
        ) : (
          <div
            key={folder?.key ?? index}
            className={classNames('folder-structure_file flex align-center justify-between', {
              active: selectedFile === folder?.title,
            })}
            title={folder?.title ?? ''}
            onClick={() => setSelectedFile(folder?.title)}
          >
            <span className="flex flex-column">
              <span className="flex align-center">
                <Tag type={renderTagType(folder?.method ?? '')} content={folder?.method} />
                <span className="title">{folder?.title ?? ''}</span>
              </span>
              <span className="timestamp">21 hours ago</span>
            </span>
            <span className="icon" onClick={(event) => handleFileOnClick(event, folder)}>
              <img src={threeDotIcon} alt="more-icon" />
            </span>
          </div>
        ),
      )}
    </div>
  );
};

export default FolderStructure;
