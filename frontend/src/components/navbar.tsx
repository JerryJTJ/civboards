import { Link } from "@heroui/link";
import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
} from "@heroui/navbar";
import { Skeleton } from "@heroui/skeleton";
import { Divider } from "@heroui/divider";
import { link as linkStyles } from "@heroui/theme";
import { useAuth0 } from "@auth0/auth0-react";
import clsx from "clsx";
import { useMemo } from "react";

import LoginButton from "./authorization/LoginButton";
import LogoutButton from "./authorization/LogoutButton";
import ProfileIcon from "./authorization/ProfileIcon";
import SearchBar from "./SearchBar";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
import { SvgIcon } from "@/components/icons";

export default function Navbar() {
	const { isAuthenticated, isLoading } = useAuth0();

	const profileContent = useMemo(() => {
		return (
			<>
				{" "}
				{isAuthenticated ? (
					<>
						<NavbarItem className="flex">
							<Skeleton className="rounded-3xl" isLoaded={!isLoading}>
								<ProfileIcon />
							</Skeleton>
						</NavbarItem>
						<NavbarItem className="flex">
							<Skeleton className="rounded-xl" isLoaded={!isLoading}>
								<LogoutButton />
							</Skeleton>
						</NavbarItem>
					</>
				) : (
					<NavbarItem className="flex">
						<Skeleton className="rounded-xl" isLoaded={!isLoading}>
							<LoginButton />
						</Skeleton>
					</NavbarItem>
				)}
			</>
		);
	}, [isAuthenticated, isLoading]);

	return (
		<HeroUINavbar
			className="shadow-md border-b-1 border-default-foreground/20"
			height={"5rem"}
			maxWidth="xl"
			position="sticky"
		>
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand className="gap-3 max-w-fit">
					<Link
						className="flex items-center justify-start gap-1"
						color="foreground"
						href="/"
					>
						<SvgIcon />
					</Link>
				</NavbarBrand>
				<div className="justify-start hidden gap-4 ml-2 md:flex">
					{siteConfig.navItems.map((item) => (
						<NavbarItem key={item.href}>
							<Link
								className={clsx(
									linkStyles({ color: "foreground" }),
									"data-[active=true]:text-primary data-[active=true]:font-medium font-serif font-semibold text-shadow-lg"
								)}
								color="foreground"
								href={item.href}
							>
								{item.label.toLocaleUpperCase()}
							</Link>
						</NavbarItem>
					))}
				</div>
			</NavbarContent>

			<NavbarContent
				className="hidden md:flex basis-1/5 sm:basis-full"
				justify="end"
			>
				<NavbarItem>
					<SearchBar />
				</NavbarItem>
				{profileContent}

				<NavbarItem className="hidden gap-2 sm:flex">
					<Link isExternal href={siteConfig.links.github} title="GitHub">
						<GithubIcon className="text-default-500" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
			</NavbarContent>

			{/* For mobile view */}
			<NavbarContent className="pl-4 md:hidden basis-1" justify="end">
				{profileContent}
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				<div className="flex flex-col gap-2 mx-4 mt-2">
					<p className="text-small text-primary">Pages</p>
					{siteConfig.navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item.label}-${index.toString()}`}>
							<Link
								color="foreground"
								// color={
								// 	index === 2
								// 		? "primary"
								// 		: index ===
								// 			  siteConfig.navMenuItems.length - 1
								// 			? "danger"
								// 			: "foreground"
								// }
								href={item.href}
								size="lg"
							>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}

					<Divider className="my-4" />
					<div className="flex items-center justify-center space-x-4 text-small">
						{" "}
						<SearchBar />
					</div>
					<Divider className="my-4" />
					<div className="flex items-center justify-center space-x-4 text-small">
						<ThemeSwitch />
						{/* <Divider orientation="vertical" /> */}
						<Link isExternal href={siteConfig.links.github}>
							<GithubIcon className="text-default-500" />
						</Link>
					</div>
				</div>
			</NavbarMenu>
		</HeroUINavbar>
	);
}
