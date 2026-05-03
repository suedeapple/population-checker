import type { Metadata } from "next";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faArrowTrendDown, faMinus } from "@fortawesome/free-solid-svg-icons";
import { getCountriesForContinent, getContinentPages, getYearsForCountry } from "@/umbraco";
import { toSlug } from "@/lib/utils";
import type { CountryContentResponseModel, YearContentResponseModel } from "@/api/model";
import PopulationChart from "@/components/PopulationChart";

type Props = {
	params: Promise<{ continent: string; country: string }>;
};

function findCountry(countries: CountryContentResponseModel[], slug: string) {
	return countries.find((c) => {
		const segments = toSlug(c.route.path).split("/");
		return segments[segments.length - 1] === slug;
	});
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { continent, country } = await params;
	const countries = await getCountriesForContinent(`/${continent}`);
	const countryData = findCountry(countries, country);
	const name = countryData?.name ?? country;
	return {
		title: name,
		description: `Historical population data for ${name}.`,
	};
}

export async function generateStaticParams() {
	const continents = await getContinentPages();
	const params: { continent: string; country: string }[] = [];

	for (const continent of continents) {
		const countries = await getCountriesForContinent(continent.route.path);
		for (const country of countries) {
			const segments = toSlug(country.route.path).split("/");
			if (segments.length >= 2) {
				params.push({ continent: segments[0], country: segments[segments.length - 1] });
			}
		}
	}

	return params;
}

export default async function CountryPage({ params }: Props) {
	const { continent, country } = await params;

	const [continents, countries, years] = await Promise.all([
		getContinentPages(),
		getCountriesForContinent(`/${continent}`),
		getYearsForCountry(`/${continent}/${country}`),
	]);

	const continentData = continents.find((r) => toSlug(r.route.path) === continent);
	const countryData = findCountry(countries, country);
	const continentName = continentData?.name ?? continent;
	const countryName = countryData?.name ?? country;

	return (
		<>
			<nav className="breadcrumb">
				<a href="/">Home</a>
				{" / "}
				<a href={`/${continent}`}>{continentName}</a>
				{" / "}
				<strong>{countryName}</strong>
			</nav>

			<section className="country-header">
				{countryData?.properties?.iso2Code && (
					<Image
						src={`https://flagcdn.com/w640/${countryData.properties.iso2Code.toLowerCase()}.webp`}
						alt={`${countryName} flag`}
						width={256}
						height={192}
						style={{ height: "auto" }}
						className="country-flag"
					/>
				)}
				<div>
					<h1>{countryName}</h1>
					{countryData?.properties?.capital && (
						<p className="country-capital">{countryData.properties.capital}</p>
					)}
					{countryData?.properties?.description?.markup && (
						<div
							className="country-description"
							dangerouslySetInnerHTML={{ __html: countryData.properties.description.markup }}
						/>
					)}
				</div>
			</section>

			{years.length > 0 && (
				<PopulationChart
					data={[...years]
						.reverse()
						.filter((y) => y.properties?.population != null)
						.map((y) => ({ year: y.name!, population: y.properties!.population! }))}
				/>
			)}

			{years.length === 0 ? (
				<p>No population data found.</p>
			) : (
				<section className="population-table-wrap">
					<div className="population-table-scroll">
						<table className="population-table">
							<thead>
								<tr>
									<th>Year</th>
									<th>Population</th>
									<th className="col-change">Change</th>
									<th>Trend</th>
								</tr>
							</thead>
							<tbody>
								{years.map((year: YearContentResponseModel, i: number) => {
									const pop = year.properties?.population ?? null;
									const prev = years[i + 1]?.properties?.population ?? null;
									const diff = pop !== null && prev !== null ? pop - prev : null;
									const trend =
										diff === null ? null : diff > 0 ? "up" : diff < 0 ? "down" : "flat";
									return (
										<tr key={year.id}>
											<td>{year.name}</td>
											<td>{pop != null ? pop.toLocaleString() : "—"}</td>
											<td className={`population-change ${trend === "up" ? "trend-up" : trend === "down" ? "trend-down" : trend === "flat" ? "trend-flat" : ""}`}>
												{diff !== null
													? (diff > 0 ? "+" : "") + diff.toLocaleString()
													: "—"}
											</td>
											<td className="population-trend">
												{trend === "up" && (
													<FontAwesomeIcon icon={faArrowTrendUp} className="trend-up" />
												)}
												{trend === "down" && (
													<FontAwesomeIcon icon={faArrowTrendDown} className="trend-down" />
												)}
												{trend === "flat" && (
													<FontAwesomeIcon icon={faMinus} className="trend-flat" />
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</section>
			)}
		</>
	);
}
