export const DATABASE_NAME = 'client-agent';

export const DATABASE_VERSION = 1;

export const prefix = 'CA';

export const objectStores = {
  collections: 'collections',
  project: 'project',
  repository: 'repository',
  request: 'request',
  response: 'response',
  environment: 'environment',
};

export const collectionType = {
  mockRequest: 'MOCK_REQUEST',
  apiTester: 'API_TESTER',
  redirectRequest: 'REDIRECT_REQUEST',
  cancelRequest: 'CANCEL_REQUEST',
  delayRequest: 'DELAY_REQUEST',
};

export const requestMenuOptions = [
  { id: 'ENABLE', label: 'Enable' },
  { id: 'RENAME', label: 'Rename' },
  { id: 'COPY', label: 'Copy' },
  { id: 'DELETE', label: 'Delete' },
];

export const repositoryMenuOptions = {
  enableAll: { id: 'ENABLE_ALL', label: 'Enable All' },
  newFolder: { id: 'NEW_FOLDER', label: 'New Folder' },
  newRequest: { id: 'NEW_REQUEST', label: 'New Request' },
  rename: { id: 'RENAME', label: 'Rename' },
  copy: { id: 'COPY', label: 'Copy' },
  paste: { id: 'PASTE', label: 'Paste' },
  delete: { id: 'DELETE', label: 'Delete' },
};

export const collectionMenuOptions = {
  enableAll: { id: 'ENABLE_ALL', label: 'Enable All', disabled: true },
  setEnvironment: { id: 'SET_ENVIRONMENT', label: 'Set Environment', disabled: true },
  newProject: { id: 'NEW_PROJECT', label: 'New Project' },
  newRequest: { id: 'NEW_REQUEST', label: 'New Request' },
  // copy: { id: 'COPY', label: 'Copy', disabled: true },
  // paste: { id: 'PASTE', label: 'Paste', disabled: true },
  delete: { id: 'DELETE_ALL', label: 'Delete All' },
};

export const methodType = [
  { value: 'GET', label: 'Get - Read' },
  { value: 'PUT', label: 'Put - Update' },
  { value: 'POST', label: 'Post - Create' },
  { value: 'DELETE', label: 'Delete - Delete' },
  { value: 'PATCH', label: 'Patch - Partially Update' },
];

export const httpStatusType = [
  {
    label: '1xx Informational',
    options: [
      { value: '100', label: '100 - Continue' },
      { value: '101', label: '101 - Switching Protocols' },
      { value: '102', label: '102 - Processing' },
      { value: '103', label: '103 - Early Hits' },
    ],
  },
  {
    label: '2xx Success',
    options: [
      { value: '200', label: '200 - OK' },
      { value: '201', label: '201 - Created' },
      { value: '202', label: '202 - Accepted' },
      { value: '204', label: '204 - No Content' },
      { value: '206', label: '206 - Partial Content' },
    ],
  },
  {
    label: '3xx Redirection',
    options: [
      { value: '300', label: '300 - Multiple Choices' },
      { value: '301', label: '301 - Moved Permanently' },
      { value: '302', label: '302 - Found' },
      { value: '304', label: '304 - Not Modified' },
      { value: '307', label: '307 - Temporary Redirect' },
      { value: '308', label: '308 - Permanent Redirect' },
    ],
  },
  {
    label: '4xx Client Errors',
    options: [
      { value: '400', label: '400 - Bad Request' },
      { value: '401', label: '401 - Unauthorized' },
      { value: '403', label: '403 - Forbidden' },
      { value: '404', label: '404 - Not Found' },
      { value: '405', label: '405 - Method Not Allowed' },
      { value: '409', label: '409 - Conflict' },
      { value: '412', label: '412 - Precondition Failed' },
      { value: '413', label: '413 - Payload Too Large' },
      { value: '415', label: '415 - Unsupported Media Type' },
      { value: '429', label: '429 - Too Many Requests' },
      { value: '451', label: '451 - Unavailable For Legal Reasons' },
    ],
  },
  {
    label: '5xx Server Errors',
    options: [
      { value: '500', label: '500 - Internal Server Error' },
      { value: '501', label: '501 - Not Implemented' },
      { value: '502', label: '502 - Bad Gateway' },
      { value: '503', label: '503 - Service Unavailable' },
      { value: '504', label: '504 - Gateway Timeout' },
      { value: '505', label: '505 - HTTP Version Not Supported' },
    ],
  },
];

export const contentTypes = [
  { value: 'application/json', label: 'application/json' },
  { value: 'application/x-www-form-urlencoded', label: 'application/x-www-form-urlencoded' },
  { value: 'application/xhtml+xml', label: 'application/xhtml+xml' },
  { value: 'application/xml', label: 'application/xml' },
  { value: 'application/pdf', label: 'application/pdf' },
  { value: 'multipart/form-data', label: 'multipart/form-data' },
  { value: 'text/css', label: 'text/css' },
  { value: 'text/csv', label: 'text/csv' },
  { value: 'text/html', label: 'text/html' },
  { value: 'text/json', label: 'text/json' },
  { value: 'text/plain', label: 'text/plain' },
  { value: 'text/xml', label: 'text/xml' },
];

export const charsetTypes = [
  { value: 'UTF-8', label: 'UTF-8' },
  { value: 'UTF-16', label: 'UTF-16' },
  { value: 'ISO-8859-1', label: 'ISO-8859-1' },
  { value: 'ISO-8859-2', label: 'ISO-8859-2' },
];

export const sampleHeader = `{
  'X-Foo-Bar': 'Hello World',
}`;

export const sampleResponse = `{
  identity: {
    id: 'b06cd03f-413a-b94b-35e155444d70',
    login: 'Bat-Man',
  },
  permissions: {
    roles: ['superhero'],
  },
}`;

export const defaultTargetUrl = 'https://www.google.com';
