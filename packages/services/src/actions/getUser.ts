import { apiClient } from "../apiClient";
import { FetcherBaseArgs } from "../types";

type Args = {
    username: string;
} & FetcherBaseArgs
export default function getUser({ username, signal }: Args) {
    return apiClient.get(`users/${username}`, {
        signal: signal,
    }).json();
}