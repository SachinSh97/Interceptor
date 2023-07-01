import { collectionType } from '../config';

export const collections = [
  {
    type: collectionType.mockRequest,
    title: 'Mock Request',
    description: 'Mock Response of any XHR/Fetch request',
  },
  {
    type: collectionType.apiTester,
    title: 'API Tester',
    description: 'Test API endpoint of any XHR/Fetch request',
  },
  {
    type: collectionType.redirectRequest,
    title: 'Redirect Request',
    description: 'Redirect a matching pattern to another URL',
  },
  {
    type: collectionType.delayRequest,
    title: 'Delay Request',
    description: 'Introduce a lag or delay to the response from specific URLs',
  },
  {
    type: collectionType.cancelRequest,
    title: 'Cancel Request',
    description: 'Block URLs by specifying keywords or entire URL',
  },
];
