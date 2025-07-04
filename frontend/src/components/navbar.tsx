import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import {
	Navbar as HeroUINavbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuToggle,
	NavbarMenu,
	NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
	TwitterIcon,
	GithubIcon,
	DiscordIcon,
	HeartFilledIcon,
	SearchIcon,
} from "@/components/icons";
import { Logo, SvgIcon } from "@/components/icons";

export const Navbar = () => {
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
	// 			<SearchIcon className="flex-shrink-0 text-base pointer-events-none text-default-400" />
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
				<NavbarItem className="hidden lg:flex">
					{/* {searchInput} */}
				</NavbarItem>
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
								color={
									index === 2
										? "primary"
										: index ===
											  siteConfig.navMenuItems.length - 1
											? "danger"
											: "foreground"
								}
								href="#"
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
};
