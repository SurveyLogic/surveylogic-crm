import { UNSAFE_DataRouterContext } from "react-router-dom";
import { useContext } from "react";

export const useDataRouterContext = () => {
  const dataRouterContext = useContext(UNSAFE_DataRouterContext);
  if (!dataRouterContext) {
    throw new Error("useDataRouterContext must be used within a data router");
  }
  return dataRouterContext;
};
