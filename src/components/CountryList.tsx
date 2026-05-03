import Link from "next/link";
import Image from "next/image";
import type { CountryContentResponseModel } from "@/api/model";
import { toSlug } from "@/lib/utils";

type Props = {
	countries: CountryContentResponseModel[];
	continentSlug: string;
};

export default function CountryList({ countries, continentSlug }: Props) {
	return (
		<ul className="country-flag-list">
			{countries.map((country) => {
				const countrySlug = toSlug(country.route.path).split("/").pop()!;
				const iso2 = country.properties?.iso2Code?.toLowerCase();

				return (
					<li key={country.id}>
						<Link href={`/${continentSlug}/${countrySlug}`} className="country-flag-link">
							{iso2 && (
								<Image
									src={`https://flagcdn.com/w80/${iso2}.webp`}
									alt={`${country.name} flag`}
									width={40}
									height={25}
									style={{ objectFit: "cover" }}
								/>
							)}
							<span>{country.name}</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
