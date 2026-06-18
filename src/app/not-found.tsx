import Link from "next/link";
import "./globals.css";

export default function GlobalNotFound() {
	return (
		<html lang="en">
			<body className="bg-sapphire-deep text-linen flex min-h-screen items-center justify-center antialiased">
				<main className="text-center">
					<h1 className="text-champagne mb-4 text-7xl font-light tracking-tight">404</h1>
					<h2 className="mb-6 text-2xl">Page Not Found</h2>
					<p className="text-linen-warm mb-10">
						The page you are looking for does not exist.
					</p>
					<Link
						href="/"
						className="bg-champagne text-sapphire-deep hover:bg-champagne-light focus:ring-champagne focus:ring-offset-sapphire-deep inline-flex h-12 items-center justify-center px-8 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
					>
						Return to Home
					</Link>
				</main>
			</body>
		</html>
	);
}
