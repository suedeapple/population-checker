'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CountryContentResponseModel } from '@/api/model';
import CountryList from '@/components/CountryList';

type ContinentEntry = {
	id: string;
	name: string;
	slug: string;
	countries: CountryContentResponseModel[];
};

type Props = {
	continents: ContinentEntry[];
};

export default function HomeSearch({ continents }: Props) {
	const [query, setQuery] = useState('');
	const q = query.trim().toLowerCase();

	const filtered = continents
		.map(({ id, name, slug, countries }) => ({
			id, name, slug,
			countries: q ? countries.filter((c) => c.name?.toLowerCase().includes(q)) : countries,
		}))
		.filter(({ countries }) => countries.length > 0);

	return (
		<>
			<div className="search-bar">
				<svg className="search-bar__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
					<circle cx="11" cy="11" r="8" />
					<line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
				<input
					type="search"
					className="search-bar__input"
					placeholder="Search countries…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					autoComplete="off"
					spellCheck={false}
					aria-label="Search countries"
				/>
			</div>

			{q && filtered.length === 0 ? (
				<p className="search-bar__empty">No results for &ldquo;{query}&rdquo;</p>
			) : (
				filtered.map(({ id, name, slug, countries }) => (
					<section key={id} className="continent-group">
						<h2>
							<Link href={`/${slug}`}>{name}</Link>
						</h2>
						<CountryList countries={countries} continentSlug={slug} />
					</section>
				))
			)}
		</>
	);
}
