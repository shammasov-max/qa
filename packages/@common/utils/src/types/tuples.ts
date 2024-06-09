import * as R from "ramda";

export type TupleIndices<T extends readonly any[]> = Extract<
  keyof T,
  `${number}`
> extends `${infer N extends number}`
  ? N
  : never;

export type TupleOnlyIndices<T extends readonly any[]> =
    Extract<keyof T, number>

export type TupleToUnionWithProp<Tuple extends readonly Record<P, string>[],P extends keyof Tuple[0]> = {
    [S in TupleOnlyIndices<Tuple>]:
    Tuple[S] extends { [M in P]: infer A}
        ? A extends string
            ? { [K in A]: Tuple[S] }
            : never
        : never
}[TupleIndices<Tuple>]

export type UnionToIntersection<Union> = (
    // `extends unknown` is always going to be the case and is used to convert the
    // `Union` into a [distributive conditional
    // type](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types).
    Union extends unknown
        // The union type is used as the only argument to a function since the union
        // of function arguments is an intersection.
        ? (distributedUnion: Union) => void
        // This won't happen.
        : never
    // Infer the `Intersection` type since TypeScript represents the positional
    // arguments of unions of functions as an intersection of the union.
    ) extends ((mergedIntersection: infer Intersection) => void)
    // The `& Union` is to allow indexing by the resulting type
    ? Intersection & Union
    : never;

export type MapFromTupleByProperty<Tuple extends readonly Record<P, string>[],P extends keyof Tuple[0]> =
    UnionToIntersection<TupleToUnionWithProp<Tuple,P>>
export type IndexTupleByProperty<P extends string> = (property: P) =>
    <Tuple extends readonly Record<P, string>[]>(tuple: Tuple) =>
        UnionToIntersection<TupleToUnionWithProp<Tuple,P>>

export const indexTupleByProperty = <
    Tuple extends readonly  Record<P, string>[],
    P extends keyof Tuple[0]>( tuple: Tuple, property: P) =>
    R.indexBy(R.prop(property), tuple) as any as  UnionToIntersection<TupleToUnionWithProp<Tuple,P>>

type Expand<T> = { [K in keyof T]: T[K] extends {[x: string]: any} ? Expand<T[K]> : T[K] }


// Converts union to overloaded function
type UnionToOvlds<U> = UnionToIntersection<
    U extends any ? (f: U) => void : never
>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;

type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;

// Finally me)
export type UnionToTuple<T, A extends unknown[] = []> = IsUnion<T> extends true
                                                 ? UnionToTuple<Exclude<T, PopUnion<T>>, [PopUnion<T>, ...A]>
                                                 : [T, ...A];
export type KeysToTuple<T extends object> =  UnionToTuple<keyof T> extends string[] ?UnionToTuple<keyof T> : readonly [string]
interface Person {
    name: string;
    age: number;
    surname: string;
    children: number;
}

type Result = UnionToTuple<keyof Person>; // ["name", "age", "surname", "children"]

const func = <T,>(): UnionToTuple<keyof T> => null as any;

const result = func<Person>(); // ["name", "age", "surname", "children"]

export type Length<T extends readonly any[]> = T["length"]
type PersonKeysTuple = KeysToTuple<Person>
let t :Length<PersonKeysTuple> =4
