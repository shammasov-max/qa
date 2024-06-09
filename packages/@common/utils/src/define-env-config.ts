import { NODE_ENV, NodeEnvName } from "./environment";
import { EmptyObject } from "./types";

export type EnvConfigVarValue = string | number | boolean | Object;
export type EnvConfig <T extends Record<string, EnvConfigVarValue> = EmptyObject> = T

export type EnvConfigMap<T extends Record<string, EnvConfigVarValue> = EmptyObject> = {
    [k in NodeEnvName]: T
}


const emptyEnvConfig: EnvConfigMap = {
    local:{},
    development: {},
    production:{},
    test:{}
}

let _envCfg = emptyEnvConfig
export const defineEnvConfig = <T extends {[s in string]: string | number | boolean} = {[s in string]: string | number | boolean}>(envCfg: EnvConfigMap<T> = _envCfg as any as EnvConfigMap<T>) => {
    _envCfg = envCfg
    const addVar =  <S extends string, V extends EnvConfigVarValue>(name: S, {development,local,production,test}: {
        [k in NodeEnvName]: EnvConfigVarValue
    })  => {
        return defineEnvConfig({
            local: {...envCfg.local, [name]: local},
test:{...envCfg.test, [name]: test},
            development: {...envCfg.development, [name]: development},
            production: {...envCfg.production, [name]: production}
        })
    }
    const currentEnv = envCfg[NODE_ENV as any as NodeEnvName ] as any as T
    return {
        addConsts: <C extends Record<string, EnvConfigVarValue>>(constConfig:C) => {
            return defineEnvConfig({
                test: {
                    ...envCfg.test,
                    ...constConfig,
                },
                local: {
                    ...envCfg.local,
                    ...constConfig,
                },
                production: {
                    ...envCfg.production,
                    ...constConfig,
                },
                development: {
                    ...envCfg.development,
                    ...constConfig,
                }
            })
        },
        addSingleConstant: <S extends string, V extends EnvConfigVarValue>(name: S, value: V)  => {
            return addVar(name,{
                development: value,
                local: value,
                production: value,
                test: value,
            })
        },
        addVar,
        getVar: <N extends keyof T & string>(name: N) => {
            if(currentEnv[name] === undefined)
                throw new Error('EnvVar '+ name + ' is not definedS')
            return currentEnv[name]
        },
        getString: <N extends keyof T & string>(name: N, envName:NodeEnvName = currentEnv) => {
            if(_envCfg[envName][name] === undefined)
                throw new Error('EnvVar '+ name + ' is not definedS')
            return String(currentEnv[name])
        },
        getBoolean: <N extends keyof T & string>(name: N) => {
            if(currentEnv[name] === undefined)
                throw new Error('EnvVar '+ name + ' is not definedS')
            return Boolean(currentEnv[name])
        },
        ...currentEnv
    }
}
