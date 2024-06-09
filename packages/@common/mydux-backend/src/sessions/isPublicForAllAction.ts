import { MyDuxEvent } from "@common/mydux";

export const isPublicForAllAction = (action: MyDuxEvent<any, any>) => {
  const result = action && action.meta && action.meta.isPublicForAll === true;

  return result;
};
