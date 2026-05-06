import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { getSettings } from "@/umbraco";

export default async function Header() {
	const settings = await getSettings();
	return (
		<header className="site-header">
			<div className="site-header__inner">
				<Link href="/" className="site-header__logo">
					<FontAwesomeIcon icon={faGlobe} className="site-header__logo-icon" />
					{settings?.properties?.siteName ?? "World Population"}
				</Link>
			</div>
		</header>
	);
}
