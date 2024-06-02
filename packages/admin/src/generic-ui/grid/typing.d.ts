import {
  type AnyAttrType,
  type AttrMeta,
  GenericEntitySlice,
} from "@shammasov/mydux";

declare module "ag-grid-community" {
  interface ColDef<TData = any, TValue = any> {
    attr: AttrMeta<AnyAttrType, TValue>;
    resource: GenericEntitySlice;
    field: keyof TData;
  }
}
