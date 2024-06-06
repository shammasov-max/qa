import { $Values } from "utility-types";
import { type ActionReducerMapBuilder } from "@reduxjs/toolkit";
import {
  createAdvancedEntityAdapter,
  EntityState,
} from "./create-advanced-entity-adapter";
import type { ActionPattern } from "redux-saga/effects";
import * as R from "ramda";
import { uniq } from "ramda";
import {
  generateGuid,
  type Resolve,
  Return,
  toAssociativeArray,
  toCamelCase,
} from "@shammasov/utils";

import { CamelCase } from "type-fest";
import type { SliceSelectors } from "@reduxjs/toolkit/src/createSlice.ts";
import {
  type AnyAttributes,
  commonAttrs,
  type EmpheralAttributes,
  type ItemByAttrs,
} from "./attrs.ts";
import { EntityState as EntityStateRaw } from "@reduxjs/toolkit/dist/entities/models";

export type ResourceLang = {
  singular: string;
  some: string;
  plural: string;
  name?: string;
  gender?: "m" | "n" | "f";
};

export type EntityOptions<Attrs extends AnyAttributes, EID extends string,Item extends ItemByAttrs<Attrs> =ItemByAttrs<Attrs> > = {
    nameProp?: keyof Attrs
    langRU: ResourceLang
    generateDefaultItems?: (state?: any, exampleItem?: Item) => Promise<Item[]>,
    extraEntityReducers?:  (builder: ActionReducerMapBuilder<EntityState<Attrs,EID>>) => void
    getItemName?: (item: ItemByAttrs<Attrs>) => string
    selectors?: SliceSelectors<EntityState<Attrs,EID>>
}



export type StateWith<K extends string, T> =
   {
        [x in  K ]: T
    }



export type LinkedAttrsKeys<Attrs extends AnyAttributes> =Extract<keyof Attrs,`${string}Id`>

export type StateWithEntity<E> = E extends EntitySlice<infer Attrs, infer EID>
    ?  StateWith<EID,EntityState<Attrs, EID>>
    : unknown
export type StateWithEntityByEIDAttrs<Attrs extends AnyAttributes,EID extends string = string> = {
    [k in CamelCase<EID>]: ItemByAttrs<Attrs>
}


export const createEntitySlice = <Attrs extends EmpheralAttributes = AnyAttributes ,EID extends string = string>
(EID: EID, attributes: Attrs,{langRU,selectors,...rest}: EntityOptions< Attrs,EID>) => {
    type Item = ItemByAttrs<Attrs>
type RootState = StateWith<CamelCase<EID>, EntityStateRaw<Item, string>>
        const  reducerPath= toCamelCase(EID)
    
        const allAttributes = {...commonAttrs(EID),...attributes}
        const props = {
            langRU,
            EID,
            reducerPath,
            attributes: allAttributes,
            exampleItem: {} as any as Item
        }
        const attributesList:(Attrs[keyof Attrs])[]  = []

        Object.entries(allAttributes).forEach( ([k,p]) => {

        attributesList.push(p as any)
        p.name = k
        p.formField.key = p.name
            p.formField.name = p.name
        p.headerName = p.headerName || p.name
    })

    const defaultGetItemName =  ((item: Item): string => {
        const i = item
        const propName =attributesList[1].name  || 'id'
        if(i)
        return i[propName] as string
        else return 'Не указан'
    }) as any
    const getItemName = rest.getItemName || defaultGetItemName

    const baseSlice = createAdvancedEntityAdapter<Attrs, EID>({
        name: EID,
        reducerPath,
        extraEntityReducers: (builder) => builder,
        attributes: {...allAttributes},
        selectors,
    })
    const selectById = (id: string) => (state: RootState) =>
        state[reducerPath].entities[id] as any as Item


    const selectAll = (state:RootState) =>
        Object.values(state[reducerPath].entities) as Item[]

    const selectEq = (query: Partial<Item>) => (state: any) => {
        const array: Item[] =selectAll(state)
        const items: Item[] = R.filter(R.whereEq<Partial<Item>>(query), array)

        return items
    }
    const    selectEqOne = (query: Partial<Item>) => (state: any): Item => {
        const array: Item[] = selectAll(state)
        const items: Item[] = R.filter(R.whereEq<Partial<Item>>(query), array)

        return items[0]
    }
    const selectMapByNames= (state: RootState) => {
        const list = selectAll(state)
        return list.reduce((map, item) =>{
            const name =getItemName(item)
            map[name] = item
            if(!item[`${EID}Name`])
                item[`${EID}Name`] = name
            return map
        } ,{} as any as Record<string, Item>)

    }
    const selectEntityDigest = (state:RootState) => {
            const list =  selectAll(state)
            const byId = toAssociativeArray('id')(list)
            const byName = selectMapByNames(state)
            const maps: LinkedAttrsKeys<Attrs> = {} as any
            const indexMapByProp = (p: LinkedAttrsKeys<Attrs>) => {
                const map: Record<string, Item[]> = {}
                list.forEach( (item) => {
                    if(!map[item[p.name!]])
                        map[item[p.name!]]= []
                    map[item[p.name!]].push(item)
                })
                return map
            }
            return {
                list, byId, byName,
                byRes: <K extends keyof LinkedAttrsKeys<Attrs>>(key: K)=> {
                    if(!maps[key])
                        maps[key] = indexMapByProp(attributes[key])
                    return linkedId =>
                        maps[key][linkedId] || []

                }
            }
        }


        const match: ActionPattern =  (action: unknown): action is SliceActions<typeof baseSlice> =>
          action!==undefined && action !== null && typeof action === 'object' &&  'type' in action && typeof action.type === 'string' && ( action.type.startsWith(EID+'/') || action.type.startsWith(EID.toLowerCase()+'/'))

        const result = Object.assign(baseSlice, {
            ...props,
            match,

            getPropByName: <K extends keyof ItemByAttrs<Attrs>>(key: K) =>
                attributes[key],
            attributesList: attributesList as   any as $Values<Attrs>[],
            asOptions: (init?: Item[]) => (state: RootState) => {

                const list = init || selectAll(state as any)
                const options = list.map( item => ({
                    value: item.id,
                    label: getItemName(item as any as Item),
                }))
                console.log('asOptions', options)
                return options
            },
          asValueEnum: (list?: Item[]) => (state: RootState) => {

            const workList =list ||  selectAll(state as any)
            const options: Record<string, string> = {}
            workList.map( item => {
                console.log('item',item)
                options[String(item.id)] = String(getItemName(item))
            })
            console.log('asValueEnum', options)
            return options
        },

        getItemName,
        ...rest,
        ...props,
        generateId: ()=> generateGuid() ,
        selectors: {
            selectDistinctFieldValues: <P extends keyof Attrs>(p: P) => (state:RootState): Item[] => {
                const items = selectAll(state)
                return uniq(items.map(i => i[p]).flat()) as any as Item[]

            },
            selectEntityDigest,
            selectMapByNames,
            selectEq,
            selectEqOne,
            selectById,
            selectAll,
            selectAsMap:  (state: StateWithEntityByEIDAttrs<Attrs,EID>):  Record<string, Item>  =>
                state[reducerPath].entities,
            selectEntities:  (state: StateWithEntityByEIDAttrs<Attrs,EID>):  Record<string, Item>  =>
                state[reducerPath]? state[reducerPath].entities : {},
        },

    })

        type Result = typeof result

        return {
            ...result,
            extend: (builder: <Ex>(result: Result) => Ex & Result) => {
                return builder(result)
            }
        }
}

type SliceActions<T> = {
    [K in keyof T]: {type: K; payload: T[K] extends (...args: infer P) => void ? P[0] : never};
}[keyof T]


export {AnyAttributes}
export type ExtractVOByEntitySlice<R extends EntitySlice> = R['exampleItem']

export const toLowerCase = <T extends Uppercase<string>>(str: T): Lowercase<T> =>
    str.toLowerCase() as any as Lowercase<T>

export const toUpperCase = <T extends Lowercase<string>>(str: T): Uppercase<T> =>
    str.toLowerCase() as any as Uppercase<T>


export {
    ItemByAttrs
}

class Clazz<Attrs extends AnyAttributes,EID extends string = string>{
    public create = (rid: EID, props: Attrs, opts: EntityOptions<Attrs, EID>)=> {
        return createEntitySlice(rid,props, opts)
    }
}
export type GenericEntitySlice = Resolve<Return<typeof createEntitySlice>>
export type EntitySlice<Attrs extends AnyAttributes = AnyAttributes,EID extends string = string > = Return<Clazz<Attrs,EID>['create']>
