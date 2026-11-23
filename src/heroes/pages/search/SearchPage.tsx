import { CustomJumbotron } from "@/components/custom/CustomJumbotron";
import { HeroStats } from "@/heroes/components/HeroStats";
import { SearchControls } from "./ui/SearchControls";
import { CustomBreadcrumbs } from "@/components/custom/CustomBreadcrumbs";
import { HeroGrid } from "@/heroes/components/HeroGrid";
import { useSearchHero } from "@/heroes/hooks/useSearchHero";
import { useSearchParams } from "react-router";

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const { data: hero = [] } = useSearchHero({
    name: searchParams.get("name") || undefined,
    team: searchParams.get("team") || undefined,
    category: searchParams.get("category") || undefined,
    universe: searchParams.get("universe") || undefined,
    status: searchParams.get("status") || undefined,
    strength: searchParams.get("strength") ?? undefined,
  });

  return (
    <>
      <CustomJumbotron
        title="Busquedas de SuperHeroes"
        descriptio="Descubre, explora y administra super heroes y villanos"
      />

      <CustomBreadcrumbs
        currentPage="Buscador de héroes"
        // breadcrumbs={[
        //   { label: 'Home1', to: '/' },
        //   { label: 'Home2', to: '/' },
        //   { label: 'Home3', to: '/' },
        // ]}
      />

      {/* Stats Dashboard */}
      <HeroStats />

      {/* Filter and search */}
      <SearchControls />

      <HeroGrid heroes={hero} />
    </>
  );
};

export default SearchPage;
