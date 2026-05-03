import { getContent20, getContentItemByPath20 } from "@/api/content/content";
import {
	ContinentContentResponseModel,
	CountryContentResponseModel,
	SettingsContentResponseModel,
	YearContentResponseModel,
	PagedIApiContentResponseModel,
} from "@/api/model";

export async function getPage<T>(
	path: string,
	culture: string,
): Promise<T | undefined> {
	try {
		const response = await getContentItemByPath20(
			path.replace(/^\//, ""),
			{},
			{
				// stale-while-revalidate: serves cached data while revalidating in background.
				// If revalidation fails (e.g. Umbraco offline), stale data is kept unaltered.
				// https://nextjs.org/docs/app/guides/caching#data-cache
				next: {
					revalidate: 3600,
					tags: ["content"],
				},
				headers: {
					"Accept-Language": culture, // tells Umbraco which variant to return
				},
			},
		);

		if (response.status === 200) return response.data as T;
		if (response.status === 404) return undefined; // Return undefined for 404

		console.error(
			"Failed to load",
			path,
			"culture:",
			culture,
			"status:",
			response.status,
		);
		return undefined;
	} catch (error) {
		console.error("Error fetching page", path, "culture:", culture, error);
		return undefined;
	}
}

export async function getContinentPages(): Promise<
	ContinentContentResponseModel[]
> {
	const response = await getContent20(
		{
			filter: [`contentType:continent`],
			sort: ["sortOrder:asc"],
			take: 100,
		},
		{
			next: { tags: ["content"] },
		},
	);

	if (response.status === 200) {
		const data: PagedIApiContentResponseModel =
			response.data as PagedIApiContentResponseModel;
		return data.items.map((item) => item as ContinentContentResponseModel);
	} else {
		console.error("Error status", response.status);
		console.error("Error fetching continent content", response.data);
		return [];
	}
}

export async function getCountriesForContinent(
	continentPath: string,
): Promise<CountryContentResponseModel[]> {
	const response = await getContent20(
		{ fetch: `children:${continentPath}`, filter: ["contentType:country"], sort: ["name:asc"], take: 80 },
		{ next: { tags: ["content"] } },
	);

	if (response.status === 200) {
		const data = response.data as PagedIApiContentResponseModel;
		return data.items.map((item) => item as CountryContentResponseModel);
	}
	console.error("Error fetching countries for", continentPath, response.status);
	return [];
}

export async function getSettings(): Promise<SettingsContentResponseModel | undefined> {
	const response = await getContent20(
		{ filter: ["contentType:settings"], take: 1 },
		{ next: { tags: ["content"] } },
	);

	if (response.status === 200) {
		const data = response.data as PagedIApiContentResponseModel;
		return data.items[0] as SettingsContentResponseModel | undefined;
	}
	console.error("Error fetching settings", response.status);
	return undefined;
}

export async function getYearsForCountry(
	countryPath: string,
): Promise<YearContentResponseModel[]> {
	const response = await getContent20(
		{
			fetch: `children:${countryPath}`,
            take: 30,
			filter: ["contentType:year"],
			sort: ["name:desc"],
		},
		{ next: { tags: ["content"] } },
	);

	if (response.status === 200) {
		const data = response.data as PagedIApiContentResponseModel;
		return data.items.map((item) => item as YearContentResponseModel);
	}
	console.error("Error fetching years for", countryPath, response.status);
	return [];
}