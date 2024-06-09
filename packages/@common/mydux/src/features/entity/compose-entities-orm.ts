import {
  combineReducers,
  PayloadAction,
  UnknownAction,
} from "@reduxjs/toolkit";
import {
  indexTupleByProperty,
  MapFromTupleByProperty,
  toCamelCase,
} from "@common/utils";
import {AnyAttributes, type EntitySlice} from "./createEntitySlice";
import { CamelCase } from "type-fest";
type Entry<O, K extends keyof O> = [K, O[K]]
type Entries<O> = Entry<O, keyof O>[]
// oh boy don't do this
type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

// TS4.0+
type Push<T extends any[], V> = [...T, V];

// TS4.1+
type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
    true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>

type abc = 'a' | 'b' | 'c';
type t = TuplifyUnion<abc>;
export const composeEntitiesOrm = <EMap extends Record<string, EntitySlice<AnyAttributes>>> (entitiesMap:EMap) => {
  /*const entitiesMap = indexTupleByProperty(
    tuple,
  ) as any as MapFromTupleByProperty<T>;
*/
  type AnyORMEntity = EMap[keyof EMap];
  const tuple = [] as any as TuplifyUnion<AnyORMEntity>
  const reducersMap = {} as any as {
    [K in keyof typeof entitiesMap as `${CamelCase<
      string & K
    >}`]: (typeof entitiesMap)[K]["reducer"];
  };
  Object.typedKeys(entitiesMap).forEach(
    (k: any) =>{

        const reducer = entitiesMap[k]["reducer"]
        reducersMap[toCamelCase(k)] = reducer
        tuple.push(entitiesMap[k])
    }
  );

  const entityTypeNames = Object.keys(entitiesMap);

  type EntityTypeNameTuple = typeof entityTypeNames;
  type EntityTypeName = keyof typeof entitiesMap;

  const entitysList = tuple;
  const ormEntitiesReducer = combineReducers(reducersMap);
  type ORMState = ReturnType<typeof ormEntitiesReducer>;
  const selectORMState = (state: any) => state as any as ORMState;
  return Object.assign({},
    entitiesMap, {
        entitiesMap,
        EntityTypeName: "" as any as EntityTypeName,
        tuple,
        selectORMState,
        ormEntitiesReducer,
        exampleORMState: {} as any as ORMState,
        reducersMap,
        match: (action: UnknownAction): boolean =>
            entitysList.some((entity) => entity.match(action)),
        getResourceByAction: (action: PayloadAction) =>
            entitysList.find((entity) => entity.match(action)),
        getEntityByTypeName: <N extends EntityTypeName>(name: N) =>
            entitiesMap[name],
      }
  );
};


const getExampleORM = () => composeEntitiesOrm({}as any as EntitySlice)
const exampleOrm = {} as any as  ReturnType<typeof getExampleORM>
export type GenericORM =typeof exampleOrm
//const a ={} as GenericORM
//a.tuple[0].getItemName
