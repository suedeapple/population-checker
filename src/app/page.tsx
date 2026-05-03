import Link from "next/link";
import { getCountriesForContinent, getContinentPages } from "@/umbraco";
import { toSlug } from "@/lib/utils";
import CountryList from "@/components/CountryList";

export default async function HomePage() {
	const continents = await getContinentPages();

	const continentData = await Promise.all(
		continents.map(async (continent) => {
			const slug = toSlug(continent.route.path);
			const countries = await getCountriesForContinent(continent.route.path);
			return { continent, slug, countries };
		}),
	);

	return (
		<>
			{continentData.map(({ continent, slug, countries }) => (
				<section key={continent.id} className="continent-group">
					<h2>
						<Link href={`/${slug}`}>{continent.name}</Link>
					</h2>
					<CountryList countries={countries} continentSlug={slug} />
				</section>
			))}
		</>
	);
}
