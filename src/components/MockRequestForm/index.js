import { lazy, Suspense, useState } from 'react';
import classNames from 'classnames';

import {
  sampleHeader,
  sampleResponse,
  methodType,
  httpStatusType,
  contentTypes,
  charsetTypes,
} from '../../config';

import './MockRequestForm.scss';

const Loader = lazy(() => import('../elements/Loader'));
const TextField = lazy(() => import('../elements/TextField'));
const Button = lazy(() => import('../elements/Button'));
const Select = lazy(() => import('../elements/Select'));

const MockRequestForm = () => {
  const [requestUrl, setRequestUrl] = useState('https://www.google.com');
  const [method, setMethod] = useState(methodType?.[0] ?? {});
  const [httpStatus, setHttpStatus] = useState(httpStatusType?.[1]?.options?.[0] ?? {});
  const [contentType, setContentType] = useState(contentTypes?.[0] ?? {});
  const [charset, setCharset] = useState(charsetTypes?.[0] ?? '');
  const [headers, setHeaders] = useState('');
  const [response, setResponse] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'requestUrl':
        setRequestUrl(value);
        break;
      case 'method':
        setMethod(value);
        break;
      case 'httpStatus':
        setHttpStatus(value);
        break;
      case 'contentType':
        setContentType(value);
        break;
      case 'charset':
        setCharset(value);
        break;
      case 'headers':
        setHeaders(value);
        break;
      case 'response':
        setResponse(value);
        break;
      default:
        break;
    }
    setIsSaved(false);
  };

  const handleOnBlur = (event) => {
    try {
      const { name, value } = event.target;
      switch (name) {
        case 'headers':
          const parsedHeaders = JSON.parse(value);
          const formatedHeaders = JSON.stringify(parsedHeaders, null, 2);
          setHeaders(formatedHeaders);
          break;
        case 'response':
          const parsedResponse = JSON.parse(value);
          const formatedResponse = JSON.stringify(parsedResponse, null, 2);
          setResponse(formatedResponse);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveOnClick = () => {
    setIsSaved(true);
  };

  const getOptionLabel = (option) => (
    <span className="flex align-center">
      <span className={classNames('dot', option?.value)} />
      <span className="label">{option?.label}</span>
    </span>
  );

  return (
    <Suspense fallback={<Loader />}>
      <div className="request-form flex flex-column">
        <div className="request-form_form-field flex ">
          <TextField
            name="requestUrl"
            label="Request Url"
            isRequired={true}
            fullWidth={true}
            value={requestUrl}
            onChange={handleOnChange}
          />
          <Button
            className="creat-btn"
            content={`Save ${!isSaved ? '*' : ''}`}
            onClick={handleSaveOnClick}
          />
        </div>
        <div className="flex align-center">
          <div className="request-form_form-field flex-1">
            <Select
              name="method"
              label="Method"
              helperText="Method of the HTTP response you'll receive."
              isRequired={true}
              options={methodType}
              getOptionLabel={getOptionLabel}
              value={method}
              isMenuOpen={true}
              onChange={handleOnChange}
            />
          </div>
          <div className="request-form_form-field flex-1">
            <Select
              name="httpStatus"
              label="HTTP Status"
              helperText="HTTP Code of the HTTP response you'll receive."
              isRequired={true}
              options={httpStatusType}
              value={httpStatus}
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div className="flex align-center">
          <div className="request-form_form-field flex-1">
            <Select
              name="contentType"
              label="Response Content Type"
              placeholder="Select (or create your own)"
              helperText="Content-Type header that will be sent with the response."
              isRequired={true}
              options={contentTypes}
              value={contentType}
              onChange={handleOnChange}
            />
          </div>
          <div className="request-form_form-field flex-1">
            <Select
              name="charset"
              label="Charset"
              helperText="Charset used to encode/decode your payload."
              isRequired={true}
              options={charsetTypes}
              value={charset}
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div className="request-form_form-field">
          <TextField
            name="headers"
            label="HTTP Headers"
            type="textarea"
            rows={5}
            placeholder={sampleHeader}
            helperText="Customize the HTTP headers sent in the response. Define the headers as a JSON object."
            value={headers}
            onBlur={handleOnBlur}
            onChange={handleOnChange}
          />
        </div>
        <div className="request-form_form-field">
          <TextField
            name="response"
            label="HTTP Response Body"
            type="textarea"
            rows={10}
            placeholder={sampleResponse}
            value={response}
            onChange={handleOnChange}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default MockRequestForm;
