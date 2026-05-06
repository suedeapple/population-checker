import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/reset.scss";
import "../styles/globals.scss";

config.autoAddCss = false;
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const viewport = {
	width: "device-width",
	initialScale: 1.0,
	maximumScale: 1.0,
	userScalable: false,
};

export const metadata: Metadata = {
	title: {
		default: "Population Checker",
		template: "%s | Population Checker",
	},
	description: "Population data for countries around the world.",
	icons: {
		icon: "/favicon.svg",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className}>
			<body>
				<Header />
				<main className="page site-content">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
