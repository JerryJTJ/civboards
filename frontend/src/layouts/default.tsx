import Navbar from "@components/navbar";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col min-h-screen bg-linear-to-b/srgb from-[#faecdb] to-[#ffe5cc] dark:from-[#1a1515] dark:to-[#3d2425] lg:overflow-clip">
			<Navbar />
			<main className="flex items-center py-6 mx-auto justify-items-center">
				{children}
			</main>
		</div>
	);
}

// Colour palettes: https://mycolor.space/
