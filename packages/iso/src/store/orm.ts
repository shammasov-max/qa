import {USERS,PROJECTS,ISSUES,TOPICS,COMMENTS,} from "./entities";
import {
  composeEntitiesOrm,
  GenericEntitySlice,
  ServiceFactory,
  toLowerCase,
} from "@shammasov/mydux";
import { useSelector } from "react-redux";
import "@shammasov/utils";
import { Simplify } from "@shammasov/utils";

const xyz = { x: 1, y: 2, z: 3 } as const;


export const orm = composeEntitiesOrm({USERS,PROJECTS,ISSUES,TOPICS,COMMENTS})


export const ENTITIES_LIST = [   USERS,PROJECTS,ISSUES,TOPICS,COMMENTS] as const//orm.tuple
export type AnyEntitySlice = typeof ENTITIES_LIST[number]
export const ENTITIES_MAP = orm.entitiesMap
export const ENTITY_TYPE_NAMES = [...ENTITIES_LIST.map(s => s.EID)] as const

export const getEntityByTypeName = orm.getEntityByTypeName

export type ORM = typeof orm
export type ORMS = Simplify<ORM>
const orms = {} as any as ORMS


export type AnyEntityType = ORM['EntityTypeName']
export type EntityTypeName = ORM['EntityTypeName']
export type ItemByEntity<E extends GenericEntitySlice> = E['exampleItem']
export type AttrsByEntity<E extends GenericEntitySlice> = E['attributes']
export const getEntityByEID = <EID extends keyof typeof ENTITIES_MAP>(eid: EID): typeof ENTITIES_MAP[EID] =>
    ENTITIES_MAP[eid]
export type ORMState = ORM['exampleORMState']
const s = {} as any as ORMState
//s.brands.ids[0]
export type DigestMaps =  {
    [K in (keyof typeof ENTITIES_MAP) & string as Lowercase<K> ]: ReturnType<ORM['entitiesMap'][Uppercase<K>]['selectors']['selectEntityDigest']>
}



export const selectDigest = (state: ORMState, ...rest: any[]) => {
    const all: DigestMaps = {
    } as any

    ENTITY_TYPE_NAMES.forEach((e: AnyEntityType) => {
        all[toLowerCase(e)] = ENTITIES_MAP[e].selectors.selectEntityDigest(state) as any
    })
    return {
        ...all,
        getLinkedResByName: <E extends AnyEntityType>(refEID: E, name: string) =>
            all[toLowerCase(refEID)].byName[name],
        getLinkedResById: <E extends AnyEntityType>(refEID: E, id: string) =>
            all[toLowerCase(refEID)].byId[id]
    }
}

export type Digest = ReturnType<typeof selectDigest>


export const useORMState = () => useSelector((state: any) => state as ORMState)


export const ORMService = new ServiceFactory('orm', async () => orm)
