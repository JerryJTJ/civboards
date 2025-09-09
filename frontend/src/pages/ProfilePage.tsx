import { Skeleton } from "@heroui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { ProfileSchema } from "@civboards/schemas";
import * as z from "zod";
import { Avatar } from "@heroui/avatar";
import { addToast } from "@heroui/toast";

import ProfileStatsTable from "@/components/Profile/ProfileStatsTable";
import ProfileLeaderboardTable from "@/components/Profile/ProfileLeaderboardTable";
import DefaultLayout from "@/layouts/default";
import { getProfile } from "@/api/users";

export default function ProfilePage() {
	const params = useParams();

	const username = useMemo(() => params.username, [params]);

	const { data, isPending, error } = useQuery({
		queryKey: ["profiles", username],
		queryFn: async (): Promise<
			z.infer<typeof ProfileSchema> | undefined
		> => {
			if (username) {
				const profile = await getProfile(username);
				return profile;
			}
		},
	});

	return (
		<DefaultLayout>
			{!error ? (
				<div className="flex flex-col items-center gap-5">
					<Avatar
						isBordered
						className="w-30 h-30 text-large"
						name={username}
						src="https://imgur.com/VB73J90.png"
					/>
					<Skeleton className="rounded-xl" isLoaded={!isPending}>
						<p className="text-xl font-semibold">
							{data?.username}
						</p>
					</Skeleton>

					<div className="flex flex-row justify-center gap-10 pt-10">
						<Skeleton className="rounded-xl" isLoaded={!isPending}>
							<Card isBlurred>
								<CardHeader className="self-center justify-center px-20 ">
									<b className="pt-2 text-base">Overview</b>
								</CardHeader>
								<CardBody>
									{data && (
										<ProfileStatsTable
											played={data.played}
											finished={data.finished}
											wins={data.won}
										/>
									)}
								</CardBody>
							</Card>
						</Skeleton>
						<Skeleton className="rounded-xl" isLoaded={!isPending}>
							<Card isBlurred>
								<CardHeader className="justify-center px-20">
									<b className="pt-2 text-base">
										Civilizations Played
									</b>
								</CardHeader>
								<CardBody>
									{data && (
										<ProfileLeaderboardTable
											items={data.civs}
										/>
									)}
								</CardBody>
							</Card>
						</Skeleton>
						<Skeleton className="rounded-xl" isLoaded={!isPending}>
							<Card isBlurred>
								<CardHeader className="justify-center px-20">
									<b className="pt-2 text-base">
										Top Leaders
									</b>
								</CardHeader>
								<CardBody>
									{data && (
										<ProfileLeaderboardTable
											items={data.leaders}
										/>
									)}
								</CardBody>
							</Card>
						</Skeleton>
					</div>
					{/* <Card>
						<CardBody className="self-end">
							<p className="text-xs italic ">
								Stats are based on finished games only
							</p>
						</CardBody>
					</Card> */}
				</div>
			) : (
				<Card>
					<CardHeader className="self-center justify-center p-3">
						<b className="text-base">ERROR</b>
					</CardHeader>
					<CardBody className="items-center p-3">
						Player {username} has played no games yet!
					</CardBody>
				</Card>
			)}
		</DefaultLayout>
	);
}
