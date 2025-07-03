import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex flex-col max-h-screen overflow-hidden">
			<Navbar />
			<main className="container w-screen px-6 pt-10 mx-auto justify-items-center">
				{children}
			</main>
		</div>
	);
}
