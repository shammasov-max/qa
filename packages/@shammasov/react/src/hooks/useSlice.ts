import { type Slice, type WithSlice } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useSelector } from "react-redux";
import type { Reducer } from "redux";

type SliceLike<ReducerPath extends string, State> = {
  reducerPath: ReducerPath;
  reducer: Reducer<State>;
};
export const useSlice = <
    ReducerPath extends string = string,
    State = any,

>(slice: SliceLike<ReducerPath,State>) => {
    const state = (useSelector as TypedUseSelectorHook<WithSlice<Slice<State,any,any,ReducerPath>>>)(state => state[slice.reducerPath])

    return state
}
