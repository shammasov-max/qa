import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { MyDuxEvent } from "../features/dispatcher";
import { bootstrapAction } from "../base";

export const SSE_REDUX_EVENT = "SSE_REDUX_EVENT";
export enum SSEReadyStatesEnum { 
    CONNECTING, 
    OPEN,
    CLOSED,
    INITIALIZING = -1
}
const initialState = {
    connectionURL: '/api/sse/connect',
    bootstraped: false,
    isConnected: false,
    sseReadyState: SSEReadyStatesEnum.CONNECTING as any as SSEReadyStatesEnum,
    error: undefined as any,
    pushingEvents: [] as PayloadAction<MyDuxEvent<any, any>>[],
    completedPushes: [] as PayloadAction<MyDuxEvent>[],
    failedPushes: [] as   PayloadAction<{action:MyDuxEvent, error: any}>[]
}

export type ConnectionState = typeof initialState & Partial<Creds>

export type Creds = {password: string, email: string}
export const connectionSlice = createSlice({
    name:'connection',
    initialState: initialState as ConnectionState ,
    reducers: {
        connectionURLUpdated: (state, action: PayloadAction<string>) => {
            state.connectionURL = action.payload
        },

        findConnectionRequested: (state, action: PayloadAction)=>{
            return {
                ...state,
                error: undefined,
                bootstraped: false,
                isConnected:false,

                sseReadyState: SSEReadyStatesEnum.CONNECTING,
            }
        },
        disconnectRequested: (state, action:PayloadAction<void>) => {

        },
        connected: (state, action) => {
            state.isConnected = true
            state.bootstraped = false
            state.sseReadyState = SSEReadyStatesEnum.OPEN
        },
        disconnected: (state, action: PayloadAction<void>) => {
            state.isConnected = false
            state.bootstraped = false
            state.sseReadyState = SSEReadyStatesEnum.CLOSED
        },
        serverPushed: (state, action: PayloadAction<MyDuxEvent>) => {
            return state
        },
        error: (state,action: PayloadAction<any>) => {
            state.error = action.payload
            state.bootstraped = false
            state.sseReadyState = SSEReadyStatesEnum.CLOSED
        },
        clientPushStarted:(state, action: PayloadAction<MyDuxEvent>) => {
            state.pushingEvents.push(action)
        },
        clientPushFailed:(state, action: PayloadAction<{action: MyDuxEvent, error: any}>) => {
            state.failedPushes.push(action)
        },
        clientPushSuccess:(state, action: PayloadAction<MyDuxEvent>) => {
            state.completedPushes.push(action)
        },
    },
    extraReducers: builder => {
      builder.addCase(bootstrapAction, (state, action) =>{
          disposePreloader()
          return  {...state, bootstraped : true,...action.payload.sse}
      })
    },
    selectors:{
        selectIsLoading: (state) => state.sseReadyState === SSEReadyStatesEnum.CONNECTING ||state.sseReadyState === SSEReadyStatesEnum.INITIALIZING || (
            state.sseReadyState === SSEReadyStatesEnum.OPEN &&
            state.bootstraped === false
        ) ,
        selectIsClosed: (state) => state.sseReadyState === SSEReadyStatesEnum.CLOSED && state.error===undefined,
        selectIsFailed: (state) => state.sseReadyState === SSEReadyStatesEnum.CLOSED && state.error,
        selectIsBootstraped: (state) => state.bootstraped,
        selectConnection: (state) => state as ConnectionState,
    }
})

export const disposePreloader = () => {
    const preloader = document.getElementById('preloader')
    if(preloader && preloader.parentElement) {
        preloader.parentElement.removeChild(preloader)
        preloader.remove()
    }
}
