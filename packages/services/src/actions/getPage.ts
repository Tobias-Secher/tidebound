import { apiClient } from '../apiClient';
import { FetcherBaseArgs } from '../types';
import { Page } from '@repo/api-types';

type Args = {
  slug: string;
} & FetcherBaseArgs;

export function getPage({ slug, signal }: Args) {
  return apiClient
    .get(`pages`, {
      searchParams: {
        where: JSON.stringify({ slug: { equals: slug } }),
        limit: '1',
      },
      signal: signal,
    })
    .json()
    .then((response: any) => response?.docs?.[0] as Page | null);
}
