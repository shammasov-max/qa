import withHooks from "./withHooks";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

export const withNavigate = withHooks((props) => {
  return {
    navigate: useNavigate(),
    location: useLocation(),
    ...props,
  };
});
