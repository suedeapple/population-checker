import { getCountriesForContinent, getContinentPages } from "@/umbraco";
import { toSlug } from "@/lib/utils";
import HomeSearch from "@/components/HomeSearch";

export default async function HomePage() {
	const continents = await getContinentPages();

	const continentData = await Promise.all(
		continents.map(async (continent) => {
			const slug = toSlug(continent.route.path);
			const countries = await getCountriesForContinent(continent.route.path);
			return { id: continent.id!, name: continent.name!, slug, countries };
		}),
	);

	return <HomeSearch continents={continentData} />;
}
