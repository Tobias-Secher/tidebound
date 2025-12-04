import { useQuery } from "@tanstack/react-query";
import getUserQuery from "../queries/getUserQuery";

export function useGetUser() {
  return useQuery(
    getUserQuery({
      username: "Tobias-Secher",
    })
  );
}
