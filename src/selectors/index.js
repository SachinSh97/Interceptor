import { collectionType } from '../config';

import mockRequestIcon from '../assets/Icons/mock-request.svg';
import redirectRequestIcon from '../assets/Icons/redirect-request.svg';
import cancelRequestIcon from '../assets/Icons/cancel-request.svg';
import delayRequestIcon from '../assets/Icons/delay-request.svg';

export const getRequestColor = (method) =>
  ({ GET: 'primary', POST: 'success', DELETE: 'danger', PUT: 'secondary', PATCH: 'ternary' }[
    method?.toUpperCase()
  ] ?? '');

export const getCollectionIcon = (type) =>
  ({
    [collectionType.mockRequest]: mockRequestIcon,
    [collectionType.redirectRequest]: redirectRequestIcon,
    [collectionType.delayRequest]: delayRequestIcon,
    [collectionType.cancelRequest]: cancelRequestIcon,
  }[type] ?? '');
