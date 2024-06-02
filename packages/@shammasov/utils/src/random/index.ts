import { customAlphabet } from "nanoid";
import uuid from "uuid/v4";

//import * as fakerRaw from 'faker'
import { omit, pick, values } from "ramda";
/*
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoId = customAlphabet(alphabet, 6);
export const generateGuid = (length = 6) => nanoId(length)
export const generateEventGuid = (length = 6) => 'E-'+nanoId(length)*/

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
const generator = customAlphabet(alphabet, 5);
export const generateGuid = generator
export const generateEventGuid = generateGuid
export const generateUint64Guid = () =>
  Number('0x' + uuid().split('-').join('').split('').slice(0, 8).join('')).toString()
/*
export const faker = fakerRaw*/
export const generateUTag = (length = 4) => generator(length)
const uniqufy = <F extends Function>(f: F): F => {
    const cache: any = {}
    const call = (...as) => {
        let result = f(...as)
        if (cache[result] !== undefined) {

            cache[result] = cache[result] + 1
            result += String(cache[result])
        } else
            cache[result] = 0

        return result
    }

    return call as any as F
}

const ap = f => uniqufy(f)

const runAp = (obj: any) => {

    if (typeof obj === 'function')
        return ap(obj)
    else if (typeof obj === 'object') {
        return Object.keys(obj).reduce(
            (result: any, k) => ({...result, [k]: runAp(obj[k])}),
            {},
        )
    }

    return obj
}


export const uniqueFaker = <T>(locale: string = 'en', fakerRaw:T): T => {
    const source = omit(['locales'], fakerRaw)
    const result = runAp(source) as any as T
    return result
}

function shuffleMutate(a) {

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
}

export const shuffle = <T>(a: T[]): T [] =>
    shuffleMutate([...a])


export const randomInt = (max: number, min: number = 0) => {
    const range = max - min + 1
    return Math.floor(Math.random() * range) + min
}

export const randomNatural = (max: number = 10) =>
    randomInt(max, 1)

export const takeRandomArray = <T>(array: T[], max: number | undefined = array.length, min: number = 0): T[] => {
    const source = shuffle(array)
    max = typeof max === 'number' ? max : source.length - 1
    const length = Math.min(randomInt(max, min), source.length - 1)
    return source.slice(0, length)
}

const takeRandomFormObject = <T>(
    array: AssociativeArray<T>,
    max: number | undefined = undefined,
    min: number = 0,
): AssociativeArray<T> =>
    pick(takeRandomArray(Object.keys(array), max, min), array)


export const takeRandomElements =
    <T>(source: T[] | utils.AssociativeArray<T>, max: number | undefined = undefined, min: number = 0): T[] =>
        // @ts-ignore
        utils.isArray(source)
            ? takeRandomArray(source, max, min )
            : takeRandomFormObject(source, max, min)

export const randomElement = <T>(source: T[] | utils.AssociativeArray<T>): T => {
    const result = takeRandomElements(source, 1, 1)
    // @ts-ignore
    return utils.isArray(source)
        ? result[0]
        : values(result)[0]
}
