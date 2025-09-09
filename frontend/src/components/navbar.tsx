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
import { link as linkStyles } from "@heroui/theme";
import { useAuth0 } from "@auth0/auth0-react";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";
import { SvgIcon } from "@/components/icons";
import LoginButton from "./authorization/LoginButton";
import LogoutButton from "./authorization/LogoutButton";
import Profile from "./authorization/ProfileIcon";

export default function Navbar() {
	const { isAuthenticated, isLoading } = useAuth0();
	// const searchInput = (
	// 	<Input
	// 		aria-label="Search"
	// 		classNames={{
	// 			inputWrapper: "bg-default-100",
	// 			input: "text-sm",
	// 		}}
	// 		endContent={
	// 			<Kbd className="hidden lg:inline-block" keys={["command"]}>
	// 				K
	// 			</Kbd>
	// 		}
	// 		labelPlacement="outside"
	// 		placeholder="Search..."
	// 		startContent={
	// 			<SearchIcon className="text-base pointer-events-none shrink-0 text-default-400" />
	// 		}
	// 		type="search"
	// 	/>
	// );

	return (
		<HeroUINavbar maxWidth="xl" position="sticky">
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
				<div className="justify-start hidden gap-4 ml-2 lg:flex">
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
				className="hidden sm:flex basis-1/5 sm:basis-full"
				justify="end"
			>
				{isAuthenticated ? (
					<>
						<NavbarItem className="hidden lg:flex">
							<Skeleton isLoaded={!isLoading}>
								<Profile />
							</Skeleton>
						</NavbarItem>
						<NavbarItem className="hidden lg:flex">
							<Skeleton isLoaded={!isLoading}>
								<LogoutButton />
							</Skeleton>
						</NavbarItem>
					</>
				) : (
					<NavbarItem className="hidden lg:flex">
						<Skeleton isLoaded={!isLoading}>
							<LoginButton />
						</Skeleton>
					</NavbarItem>
				)}
				<NavbarItem className="hidden gap-2 sm:flex">
					<Link
						isExternal
						href={siteConfig.links.github}
						title="GitHub"
					>
						<GithubIcon className="text-default-500" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
				{/* <NavbarItem className="hidden lg:flex">
					{searchInput}
				</NavbarItem> */}
			</NavbarContent>

			{/* For mobile view */}
			<NavbarContent className="pl-4 sm:hidden basis-1" justify="end">
				<Link isExternal href={siteConfig.links.github}>
					<GithubIcon className="text-default-500" />
				</Link>
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				{/* {searchInput} */}
				<div className="flex flex-col gap-2 mx-4 mt-2">
					{siteConfig.navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
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
				</div>
			</NavbarMenu>
		</HeroUINavbar>
	);
}
