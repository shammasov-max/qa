export * from './EmptyObject'
export * from './tuples'
export * from './Simplity'

export type Override<Type, NewType extends { [key in keyof Type]?: NewType[key] }> = Omit<Type, keyof NewType> & NewType;
export type Resolve<T> = T extends Function ? T : {[K in keyof T]: T[K]};
