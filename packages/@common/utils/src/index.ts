import type { KeysToTuple } from "./sha";
import * as sha from "./sha";
import { generateGuid } from "./random/index";

export { toAssociativeArray, isArray, toIndexedArray } from "./array";
export * from "./sha";
export {defineEnvConfig}                           from  './define-env-config'
export *                                           from './define-env-config'
export {
    sha,
}
export {generateGuid}
export function isFunction(functionToCheck: unknown): functionToCheck is Function {
    return (!!functionToCheck) && {}.toString.call(functionToCheck) === '[object Function]';
}
export type Return< F > =  F extends {(...params:  infer I ): infer O} ? O : never

declare var Object: Omit<ObjectConstructor, 'keys' | 'entries'>  &  {
    /**
     * Returns the names of the enumerable string
     * properties and methods of an object.
     * @param obj Object that contains the
     *     properties and methods. This can be an
     *     object that you created or an existing
     *     Document Object Model (DOM) object.
     */
    keys<O extends any[]>(obj: O): Array<keyof O>;
    keys<O extends Record<Readonly<string>, any>>(obj: O): Array<keyof O>;
    keys(obj: object): string[];

    /**
     * Returns an array of key/values of the
     * enumerable properties of an object
     * @param obj Object that contains the
     *     properties and methods. This can be an
     *     object that you created or an existing
     *     Document Object Model (DOM) object.
     */
    entries<T extends { [K: Readonly<string>]: any }>(obj: T): Array<[keyof T, T[keyof T]]>
    entries<T extends object>(obj: { [s: string]: T } | ArrayLike<T>): [string, T[keyof T]][];
    entries<T>(obj: { [s: string]: T } | ArrayLike<T>): [string, T][];
    entries(obj: {}): [string, any][];
};


export * from './getGlobal'
declare global {
    interface ObjectConstructor {
        typedKeys<T extends object>(obj: T): KeysToTuple<T>
    }
}
Object.typedKeys = Object.keys as any
