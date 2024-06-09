import { ServiceFactory } from "@common/mydux";
import { useStore } from "react-redux";
import type { EnhancedStore } from "@reduxjs/toolkit";

export const useSagaService = <
  K extends string,
  V extends object,
  C extends object
>(
  serviceFactory: ServiceFactory<K, V, C>
) => {
  const store: EnhancedStore & { context: { [k in K]: V } } = useStore() as any;
  return store.context[serviceFactory.name];
};
