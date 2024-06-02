import { Slice } from "@reduxjs/toolkit";

export * from "./buildBaseStore";
export * from './saga-services-context'
export * from './HistoryService'
export * from './prepare-persistent'
export * from './bootstrapAction'
export type StateWithSlice<S extends Slice> = {
    [k in  S['reducerPath']]: ReturnType<Slice['reducer']>
}
