import { unstable_cache } from 'next/cache';
import { apiClient } from '../apiClient';
import { FetcherBaseArgs } from '../types';
import { Header, CACHE_TAGS } from '@repo/api-types';

type Args = FetcherBaseArgs;

export async function getHeader({ signal }: Args = {}) {
  const cachedFn = unstable_cache(
    async () => {
      return apiClient
        .get('globals/header', {
          searchParams: {
            depth: '2',
          },
          signal: signal,
        })
        .json<Header | null>();
    },
    [CACHE_TAGS.header.all],
    { tags: [CACHE_TAGS.header.all] },
  );

  return cachedFn();
}
