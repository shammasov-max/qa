import {useSelector} from 'react-redux';
import {createSlice} from "@reduxjs/toolkit";

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        busy: false
    },
    reducers: {
        busy: (state) => {
            state.busy = true
        },
        unbusy: (state) => {
            state.busy = false
        },
    }
})

export type UIState = ReturnType<typeof uiSlice.reducer>
export default () => {
    const state: UIState = useSelector(uiSlice.selectSlice)
    return state
}
