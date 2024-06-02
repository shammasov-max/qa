import { getContext } from "typed-redux-saga";
import { isBackend, isFrontend, type KeysToTuple } from "@shammasov/utils";

export type Service<K extends string, V extends object> = {
  name: K;
} & V;

export type ServiceInitializer <V extends object = {}, C extends object = {}>
 = {(cfg:C & object) : Promise<V>}

export class ServiceFactory<K extends string = string, V extends object = any, C extends object = {},
    State extends  Object = any> {
    constructor(public name: K, public initializer:ServiceInitializer<V,C>){
    }

    public createService = async <AC extends C>(cfg: AC): Promise<Service<K, V>> => {
        return Object.assign(await this.initializer(cfg),{name: this.name})
    }
}





export const VersionService = new ServiceFactory('version', async (cfg: {VERSION: string})=> ({getVersion: () => cfg.VERSION}))
export const LoggerService = new ServiceFactory('logger', async () => console)
export const RuntimeService = new ServiceFactory('runtime', async () => ({isBackend: isBackend, isFrontend: isFrontend}))
const a = {
b: 4


}
const t = {} as any as KeysToTuple<typeof a>

const l = Object.typedKeys(a)

export const contextBuilder =  <B extends Record<string, ServiceFactory>, A extends object, P extends string = string>(serviceFactoriesMap: B = {} as B, mergedCfg: A = {} as A) => {
    const t = {} as any as KeysToTuple<B>


    const add = <K extends string, V extends object,C extends object>(serivceFactory: ServiceFactory<K, V,C>) =>
        contextBuilder(
            ( {...serviceFactoriesMap, [serivceFactory.name]: serivceFactory} ) as B & {[k in typeof serivceFactory.name]: typeof  serivceFactory}, {} as any as A & C)

    const configure = async <AnyCfg extends A>(cfg: AnyCfg): Promise<
        {    [k in keyof B]:Awaited<ReturnType<B[k]['createService']>>   }>  => {
        const result = {} as any
        await Promise.all(Object.typedKeys(serviceFactoriesMap).map( async (k: keyof typeof serviceFactoriesMap) => {
            //ts-ignore
            const promise = serviceFactoriesMap[k].createService(cfg)
            result[k] = await promise
            return result[k]
        }))
        
        return result as any
    }
    return {
        add,
        configure,
        serviceFactoriesMap,
        mergedCfg,
    }
}


/*
const tuple = [LoggerService(async () => console), RuntimeService(), VersionService()] as const
tuple[2]( {VERSION:'2'})
export const combineSagaContext = <T extends typeof tuple = typeof tuple>(...tuple: T) => {

const resolvedTuple: {[k in keyof T]: T[k]['tsType']} = {} as any
    type R = typeof resolvedTuple[keyof typeof resolvedTuple]
    const contextMapPromises = indexTupleByProperty(resolvedTuple, 'name') as any as MapFromTupleByProperty<R, 'name'>
    const contextMap: {[k in keyof typeof contextMapPromises]: typeof contextMapPromises[k]['tsType']} = {} as any
    return resolvedTuple
}*/
const buildCtxText = async () => {

    const ctx = await contextBuilder()
        .add(LoggerService)
        .add(VersionService)
        .add(RuntimeService)
        .configure({VERSION:'0.1.0'})

}



export function* getFullSagaContext<StoreWithCtx >() {
    type Ctx =StoreWithCtx extends {context:{fullContext: infer C}} ? C : never
    return (yield* getContext<Ctx>('fullContext')) as any as Ctx
}
export type AnyRecord = Record<string, any>
export type FullContextGeneric = {
    [X in keyof AnyRecord]: Service<X, any>
}
export function* getSagaService<K extends string, V extends object, C extends object>(serviceFactory: ServiceFactory<K, V, C>){
    const value = yield* getContext<V>(serviceFactory.name)
    if(value === undefined)
        throw new Error(`The service ${serviceFactory.name} not found in sagacontext`)
    return value as any as V
}
