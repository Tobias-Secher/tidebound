import { apiClient } from "../apiClient";
import { FetcherBaseArgs } from "../types";
import {Page} from '@repo/api-types'

type Args = {
    slug: string;
} & FetcherBaseArgs

export function getPage({ slug, signal }: Args) {
    return apiClient.get<Page>(`pages/slug/${slug}`, {
        signal: signal,
    }).json();
}
