import { getRoot as mobxEasyGetRoot, getEnv as mobxEasyGetEnv } from "mobx-easy";
import RootStore from "../stores/root-store";
import { RootEnvironment } from "./create-store";

export const getRoot = (): RootStore => mobxEasyGetRoot<RootStore>();
export const getEnv = (): RootEnvironment => mobxEasyGetEnv<RootEnvironment>();
