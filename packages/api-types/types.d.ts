import { Config } from './src/payload-types';

declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
