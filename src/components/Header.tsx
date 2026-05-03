import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/umbraco";

export default async function Header() {
	const settings = await getSettings();
	return (
		<header className="site-header">
			<div className="site-header__inner">
				<Link href="/" className="site-header__logo">
					<Image
						src="/globe-logo.svg"
						alt=""
						width={40}
						height={40}
						className="site-header__logo-icon"
					/>
					{settings?.properties?.siteName ?? "World Population"}
				</Link>
			</div>
		</header>
	);
}
