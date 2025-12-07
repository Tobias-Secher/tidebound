import { queryOptions } from "@tanstack/react-query";
import {getPage} from "../actions/getPage";

type Args = Partial<Omit<Parameters<typeof getPage>[0], "signal">>;

export default function getPageQuery({ slug }: Args) {
    return queryOptions({
        queryKey: ["getPage", `getPage-${slug}`],
        queryFn: ({signal}) => getPage({ slug: slug!, signal }),
        enabled: Boolean(slug),
    });
}
