import {includes} from 'lodash';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Testing = 'testing',
}

const currentEnv = process.env.REACT_APP_ENVIRONMENT ?? process.env.NODE_ENV;

let nodeEnv = currentEnv?.trim().toLowerCase() as Environment;

if (!includes(Object.values(Environment), nodeEnv)) {
  nodeEnv = Environment.Development;
}

export const appEnv: Environment = nodeEnv;
