import { unstable_cache } from 'next/cache';
import { apiClient } from '../apiClient';
import { FetcherBaseArgs } from '../types';
import { Page, CACHE_TAGS } from '@repo/api-types';

type Args = {
  slug: string;
} & FetcherBaseArgs;

export async function getPage({ slug, signal }: Args) {
  // const cachedFn = unstable_cache(
  //   async () => {
  return apiClient
    .get(`pages`, {
      searchParams: {
        'where[slug][equals]': slug,
        limit: '1',
      },
      signal: signal,
    })
    .json()
    .then((response: any) => response?.docs?.[0] as Page | null);
  //   },
  //   [CACHE_TAGS.pages.page(slug)],
  //   { tags: [CACHE_TAGS.pages.all, CACHE_TAGS.pages.page(slug)] },
  // );

  // return cachedFn();
}
