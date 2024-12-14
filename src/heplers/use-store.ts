import { useContext } from "react";
import { StoreContext } from "./store-context";
import RootStore from "../stores/root-store";

export const useStore = (): RootStore => {
  return useContext(StoreContext);
}
