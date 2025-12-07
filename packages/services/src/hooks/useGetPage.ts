import { useQuery } from "@tanstack/react-query";
import getPageQuery from "../queries/getPageQuery";

type UseGetPageArgs = {
  slug?: string;
};

export function useGetPage({ slug }: UseGetPageArgs) {
  return useQuery(
    getPageQuery({
      slug,
    })
  );
}
