import {
  ActionReducerMapBuilder,
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState as EntityStateRaw,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";
import { clone, compose, equals, map, mergeRight } from "ramda";
import { isArray, isFunction } from "@shammasov/utils";

import { preparePersistent } from "../../base/prepare-persistent";
import { bootstrapAction } from "../../base/bootstrapAction";
import type { SliceSelectors } from "@reduxjs/toolkit/src/createSlice.ts";
import type { AnyAttributes, ItemByAttrs } from "./attrs.ts";

export type EntityState<
  Attrs extends AnyAttributes = AnyAttributes,
  EID extends string = string
> = EntityStateRaw<ItemByAttrs<Attrs, EID>, string>;


export const createAdvancedEntityAdapter = <Attrs extends AnyAttributes, EID extends string,Item extends ItemByAttrs<Attrs, EID> =  ItemByAttrs<Attrs,EID> , RPath extends string = string>(
    {name, attributes, extraEntityReducers, reducerPath, selectors}: {name: EID, reducerPath: RPath, attributes: Attrs, selectors?:SliceSelectors<EntityState<Item,string>>, extraEntityReducers: (builder: ActionReducerMapBuilder<EntityState<Attrs, EID>>) => void}
) => {
    if(!selectors) selectors={}
    const defaults: Partial<Item> = {} as any
    Object.values(attributes).forEach(
        f => defaults[f.name as any as keyof typeof defaults] = isFunction(f.default) ? f.default() : f.default as any
    )

    const entityAdapter = createEntityAdapter<Item, string>({

        selectId: item =>
            item.id as any as string,
        sortComparer: (a,b) => b.addedAtTS - a.addedAtTS,
    });

    const entitySelectors = entityAdapter.getSelectors((state: any) => state[name as any] as EntityState<Attrs, EID>)

    const withDefaults = mergeRight(defaults)
    const initialState = entityAdapter.getInitialState();
   // const {selectId,sortComparer,getInitialState,getSelectors,...restAdapter} = entityAdapter

    const prepareAddedWithDefaults = <Item>(item: Item) => {
        const defaultObject:Partial<Item> = {}
        for (const [k, v] of Object.entries(defaults)) {
            if(isFunction(v)) {
                defaultObject[k]= v(item)
            } else {
                defaultObject[k] = clone(v)
            }
        }

        return {...defaultObject,...item}

    }
    const prepareManyAddedWithDefaults = <Item>(items: Item[] | Record<string, Item>): Item[] | Record<string, Item> =>
        (isArray(items)
            ? items.map( item => withDefaults(item as any))
            : map(withDefaults, items)) as any
    const prepareSimple = <A>() => (payload: A) =>
        ({payload})
    const patchedCreator = createAction(name+'/patched', preparePersistent<Update<Item, string>>())
    const acts = {
       // addOne2: createAction<Readonly<Item>>(name+'/addOne'),
        added: createAction(name+'/added',compose(preparePersistent<Item>(),prepareAddedWithDefaults)),
        manyAdded: createAction(
            name+'/manyAdded',
            compose(preparePersistent< Item[]>(),prepareManyAddedWithDefaults)),
        patched: Object.assign((patch: {id: string} & Partial<Item>, original: Partial<Item> = {}) => {
                const changes: Partial<Item> = {

                }

                let diffFlag = false
                for (const [key, value] of Object.entries(patch)) {
                    if (!equals(patch[key], original[key])) {
                        changes[key] = patch[key]
                        diffFlag = true
                    }
                }

                return diffFlag
                    // @ts-ignore
                    ? patchCreator({id, changes})
                    : undefined
            },
                patchedCreator

        ),
        updated: createAction(name+'/updated',
            preparePersistent<Update<Item, string>>()),
        allSet: createAction(name+'/allSet', prepareSimple<Item[]>()),
        removed: createAction(name+'/removed', preparePersistent<string>()),
        removedMany: createAction(name+'/removedMany', preparePersistent<string[]>())
    }

    const entitySlice = createSlice({
        name,
        initialState,
        reducers: {
        },

        extraReducers: builder => {
                builder
                    .addCase(bootstrapAction, (state, action)=> {
                        const map = action.payload[reducerPath]
                        const result =  entityAdapter.setAll(state, map.entities)
                    })
                    .addCase(acts.added, (state, action: PayloadAction<Readonly<Item>>) => {
                       const result = entityAdapter.addOne(state, action.payload)
                    })
                    .addCase(acts.manyAdded,(state, action: PayloadAction<Readonly<Item[]>>) => {
                       const result = entityAdapter.addMany(state, action.payload)
                    })
                    .addCase(acts.allSet,(state, action: PayloadAction<Readonly<Item[] | Record<string, Item>>>) => {
                        const result =  entityAdapter.setAll(state, action.payload)
                    })
                    .addCase(acts.removed,(state, action: PayloadAction<string>) => {
                       const result = entityAdapter.removeOne(state, action.payload)
                    })
                    .addCase(acts.removedMany,(state, action: PayloadAction<string[]>) => {
                        const result = entityAdapter.removeMany(state, action.payload)
                    })
                    .addCase(acts.updated,(state, action: PayloadAction<Update<Item, string>>) => {
                        const result = entityAdapter.updateOne(state, action.payload)
                    })
                    .addCase(acts.patched,(state, action: PayloadAction<Update<Item, string>>) => {
                        const result = entityAdapter.updateOne(state, action.payload)
                    })
            if(extraEntityReducers)
                extraEntityReducers(builder)
        },
        selectors: selectors,
    });


    const {actions, ...restSlice} = entitySlice

    return {

        ...restSlice,

        entitySelectors,
        actions: acts,
    }
};
