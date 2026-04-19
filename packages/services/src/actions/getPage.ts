import { apiClient } from '../apiClient';
import { FetcherBaseArgs } from '../types';
import { Page, PaginatedResponse, CACHE_TAGS } from '@repo/api-types';

type Args = {
  slug: string;
} & FetcherBaseArgs;

export async function getPage({ slug, signal }: Args) {
  const response = await apiClient
    .get('pages', {
      searchParams: {
        'where[slug][equals]': slug,
        limit: '1',
      },
      signal,
      next: {
        tags: [CACHE_TAGS.pages.all, CACHE_TAGS.pages.page(slug)],
      },
    })
    .json<PaginatedResponse<Page>>();

  return response.docs[0] ?? null;
}
