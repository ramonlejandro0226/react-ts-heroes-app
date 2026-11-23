import { useQuery } from "@tanstack/react-query";
import { searchHeroAction } from "../actions/search-hero.action";

interface Props {
  name?: string;
  team?: string;
  category?: string;
  universe?: string;
  status?: string;
  strength?: string;
}

export const useSearchHero = ({
  name,
  team,
  category,
  universe,
  status,
  strength,
}: Props) => {
  return useQuery({
    queryKey: ["search", { name, team, category, universe, status, strength }],
    queryFn: () =>
      searchHeroAction({ name, team, category, universe, status, strength }),
    staleTime: 1000 * 60 * 5,
  });
};
