
const isBrowser = () =>typeof window !== 'undefined' && typeof window.document !== 'undefined';

/* eslint-disable no-restricted-globals */
const isWebWorker = () =>
    typeof self === 'object' &&
    self.constructor &&
    self.constructor.name === 'DedicatedWorkerGlobalScope';
/* eslint-enable no-restricted-globals */

const isNode = () =>
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;
const   isFrontend = isBrowser
const isBackend = isNode
export {
    isBrowser,
    isWebWorker,
    isNode,
    isBackend,isFrontend

};




export type NodeEnvName = 'development' | 'local' | 'production' | 'test'
export const NODE_ENV = process.env.NODE_ENV || 'local' as any as NodeEnvName