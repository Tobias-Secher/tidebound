import { queryOptions } from "@tanstack/react-query";
import getUser from "../actions/getUser";

type Args = Partial<Omit<Parameters<typeof getUser>[0], "signal">>;

export default function getUserQuery({ username }: Args) {
    return queryOptions({
        queryKey: ["getUser", `getUser-${username}`],
        queryFn: ({signal}) => getUser({ username: username!, signal }),
        enabled: Boolean(username),
    });
}