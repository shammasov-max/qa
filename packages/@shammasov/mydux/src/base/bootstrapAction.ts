import { createAction } from "@reduxjs/toolkit";

export type BootstrapAction = ReturnType<typeof bootstrapAction>;
export const bootstrapAction = createAction<any>('bootstrap')
