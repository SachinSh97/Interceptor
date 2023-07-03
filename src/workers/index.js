import IndexedDBWorkerScript from './IndexedDBWorkerScript';

class WebWorkerEnabler {
  constructor(worker) {
    let code = worker?.toString() ?? '';
    code = code?.substring(code?.indexOf('{') + 1, code?.lastIndexOf('}')) ?? '';

    const blob = new Blob([code], { type: 'application/javascript' });
    const workerScript = URL.createObjectURL(blob);
    return new Worker(workerScript, { module: true });
  }
}

const IndexedDBWorker = new WebWorkerEnabler(IndexedDBWorkerScript);

export { IndexedDBWorker };
