import { Skeleton } from "@heroui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { ProfileSchema } from "@civboards/schemas";
import * as z from "zod";
import { Avatar } from "@heroui/avatar";
import { Tabs, Tab } from "@heroui/tabs";

import ProfileStatsTable from "@/components/Profile/ProfileStatsTable";
import ProfileLeaderboardTable from "@/components/Profile/ProfileLeaderboardTable";
import DefaultLayout from "@/layouts/default";
import { getGamesByPlayer, getGamesByUploader, getProfile } from "@/api/users";
import GamesTable from "@/components/games/GamesTable";

export default function ProfilePage() {
	const params = useParams();
	const username = useMemo(
		() => params.username?.toLocaleLowerCase(),
		[params]
	);

	// APIs
	const profile = useQuery({
		queryKey: ["profiles", username],
		queryFn: async (): Promise<
			z.infer<typeof ProfileSchema> | undefined
		> => {
			if (username) {
				return await getProfile(username);
			}
		},
	});
	const games = useQuery({
		queryKey: ["games", username],
		queryFn: async () => {
			if (username) {
				return await getGamesByPlayer(username);
			}
		},
	});
	const uploaded = useQuery({
		queryKey: ["uploaded", username],
		queryFn: async () => {
			if (username) return getGamesByUploader(username);
		},
	});

	return (
		<DefaultLayout>
			<div className="flex flex-col items-center gap-5 overflow-y-scroll">
				<Avatar
					isBordered
					className="w-20 h-20 mt-2 text-large"
					name={username}
					src="https://imgur.com/VB73J90.png"
				/>
				<Skeleton className="rounded-xl" isLoaded={!profile.isPending}>
					<p className="text-xl font-semibold">{username}</p>
				</Skeleton>
				<Tabs aria-label="Options" color="primary">
					<Tab key="overview" title="Overview">
						<div className="flex flex-col justify-center gap-10 pt-10 sm:flex-row">
							{!profile.error ? (
								<>
									{" "}
									<Skeleton
										className="rounded-xl"
										isLoaded={!profile.isPending}
									>
										<Card
											isBlurred
											aria-label="Player Overview"
										>
											<CardHeader className="self-center justify-center px-20 ">
												<b className="pt-2 text-base">
													Overview
												</b>
											</CardHeader>
											<CardBody>
												{profile.data && (
													<ProfileStatsTable
														finished={
															profile.data
																.finished
														}
														played={
															profile.data.played
														}
														wins={profile.data.won}
													/>
												)}
											</CardBody>
											<CardFooter>
												<p className="px-4 text-xs italic">
													Win percentages use finished
													games only
												</p>
											</CardFooter>
										</Card>
									</Skeleton>
									<Skeleton
										className="rounded-xl"
										isLoaded={!profile.isPending}
									>
										<Card isBlurred>
											<CardHeader className="justify-center px-20">
												<b className="pt-2 text-base">
													Civilizations Played
												</b>
											</CardHeader>
											<CardBody>
												{profile.data && (
													<ProfileLeaderboardTable
														items={
															profile.data.civs
														}
													/>
												)}
											</CardBody>
										</Card>
									</Skeleton>
									<Skeleton
										className="rounded-xl"
										isLoaded={!profile.isPending}
									>
										<Card isBlurred>
											<CardHeader className="justify-center px-20">
												<b className="pt-2 text-base">
													Top Leaders
												</b>
											</CardHeader>
											<CardBody>
												{profile.data && (
													<ProfileLeaderboardTable
														items={
															profile.data.leaders
														}
													/>
												)}
											</CardBody>
										</Card>
									</Skeleton>
								</>
							) : (
								<Card isBlurred>
									<CardHeader className="justify-center px-20 pt-5">
										<b className="pt-2 text-base">
											No games found!
										</b>
									</CardHeader>
									<CardBody className="justify-center px-10 py-10">
										Upload and play some games to get stats!
									</CardBody>
								</Card>
							)}
						</div>
					</Tab>
					<Tab key="games" title="Joined">
						<Skeleton
							className="rounded-xl"
							isLoaded={!games.isPending && !profile.isPending}
						>
							{" "}
							{games.data && (
								<GamesTable
									games={games.data}
									refetch={games.refetch}
								/>
							)}
						</Skeleton>
					</Tab>
					<Tab key="uploaded" title="Uploaded">
						<Skeleton
							className="rounded-xl"
							isLoaded={!uploaded.isPending && !profile.isPending}
						>
							{" "}
							{uploaded.data && (
								<GamesTable
									games={uploaded.data}
									refetch={uploaded.refetch}
								/>
							)}
						</Skeleton>
					</Tab>
				</Tabs>
			</div>

			{/* // (
			// 	<Card>
			// 		<CardHeader className="self-center justify-center p-3">
			// 			<b className="text-base">ERROR</b>
			// 		</CardHeader>
			// 		<CardBody className="items-center p-3">
			// 			Player {username} has played no games yet!
			// 		</CardBody>
			// 	</Card>
			// ) */}
		</DefaultLayout>
	);
}
