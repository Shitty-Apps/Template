import { getRoot as mobxEasyGetRoot, getEnv as mobxEasyGetEnv } from 'mobx-easy';
import { RootEnvironment } from './create-store';
import RootStore from '../stores/root-store';

export const getRoot = (): RootStore => mobxEasyGetRoot<RootStore>();
export const getEnv = (): RootEnvironment => mobxEasyGetEnv<RootEnvironment>();
