import { apiClient } from '../apiClient';
import { FetcherBaseArgs } from '../types';
import { User } from '@repo/api-types';

type Args = {
  username: string;
} & FetcherBaseArgs;

export function getUser({ username, signal }: Args) {
  return apiClient
    .get(`users/${username}`, { signal })
    .json<User | null>();
}
