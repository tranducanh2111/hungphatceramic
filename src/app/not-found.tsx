import Link from "next/link";
import "./globals.css";

export default function GlobalNotFound() {
	return (
		<html lang="en">
			<body className="bg-sapphire-deep flex min-h-screen items-center justify-center text-linen antialiased">
				<main className="text-center">
					<h1 className="mb-4 text-7xl text-champagne font-light tracking-tight">404</h1>
					<h2 className="mb-6 text-2xl">Page Not Found</h2>
					<p className="mb-10 text-linen-warm">The page you are looking for does not exist.</p>
					<Link
						href="/"
						className="inline-flex h-12 items-center justify-center bg-champagne px-8 text-sm font-medium text-sapphire-deep transition-colors hover:bg-champagne-light focus:outline-none focus:ring-2 focus:ring-champagne focus:ring-offset-2 focus:ring-offset-sapphire-deep"
					>
						Return to Home
					</Link>
				</main>
			</body>
		</html>
	);
}
