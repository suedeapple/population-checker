import { getSettings } from "@/umbraco";

export default async function Footer() {
	const settings = await getSettings();

	return (
		<footer className="site-footer">
			<div className="site-footer__inner">
				<p>© {new Date().getFullYear()} {settings?.properties?.siteName}</p>
				{settings?.properties?.disclaimer && (
					<p>{settings.properties.disclaimer}</p>
				)}
			</div>
		</footer>
	);
}
