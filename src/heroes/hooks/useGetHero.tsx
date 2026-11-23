import { useQuery } from "@tanstack/react-query";

import { getHeroAction } from "../actions/get-hero.action";

export const useGetHero = (idSlug: string) => {
  return useQuery({
    queryKey: ["hero", idSlug],
    queryFn: () => getHeroAction(idSlug),
    enabled: Boolean(idSlug?.trim()),
    staleTime: 1000 * 60 * 5,
    retry: false
  });
};
