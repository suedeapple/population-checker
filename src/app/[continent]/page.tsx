import type { Metadata } from "next";
import Link from "next/link";
import { getCountriesForContinent, getContinentPages } from "@/umbraco";
import { toSlug } from "@/lib/utils";
import { notFound } from "next/navigation";
import CountryList from "@/components/CountryList";

type Props = {
	params: Promise<{ continent: string }>;
};

async function getContinentName(slug: string) {
	const continents = await getContinentPages();
	return continents.find((r) => toSlug(r.route.path) === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { continent } = await params;
	const continentData = await getContinentName(continent);
	const name = continentData?.name ?? continent;
	return {
		title: name,
		description: `Population data for countries in ${name}.`,
	};
}

export async function generateStaticParams() {
	const continents = await getContinentPages();
	return continents.map((continent) => ({
		continent: toSlug(continent.route.path),
	}));
}

export default async function ContinentPage({ params }: Props) {
	const { continent } = await params;

	const [continentData, countries] = await Promise.all([
		getContinentName(continent),
		getCountriesForContinent(`/${continent}`),
	]);

	if (countries.length === 0) notFound();

	const continentName = continentData?.name ?? continent;

	return (
		<>
			<nav className="breadcrumb">
				<Link href="/">Home</Link>
				{" / "}
				<strong>{continentName}</strong>
			</nav>

			<h1>{continentName}</h1>

			<CountryList countries={countries} continentSlug={continent} />
		</>
	);
}
