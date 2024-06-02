import withHooks from "./withHooks";
import { useParams } from "react-router";

export const withParams = <
  ParamsOrKey extends string | Record<string, string | undefined> = string
>() =>
  withHooks((props) => ({
    ...useParams<ParamsOrKey>(),
    ...props,
  }));
