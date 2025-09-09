import { Skeleton } from "@heroui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ProfileSchema } from "@civboards/schemas";
import * as z from "zod";
import { Avatar } from "@heroui/avatar";
import { addToast } from "@heroui/toast";

import ProfileStatsTable from "@/components/Profile/ProfileStatsTable";
import ProfileLeaderboardTable from "@/components/Profile/ProfileLeaderboardTable";
import DefaultLayout from "@/layouts/default";
import { getProfile } from "@/api/users";
import { AxiosError } from "axios";

export default function ProfilePage() {
	const params = useParams();

	const username = useMemo(() => params.username, [params]);

	const { data, isPending, error } = useQuery({
		queryKey: ["profiles", username],
		queryFn: async (): Promise<
			z.infer<typeof ProfileSchema> | undefined
		> => {
			if (username) {
				try {
					const profile = await getProfile(username);

					return profile;
				} catch (error: any) {
					console.log(error);
					if (!data)
						addToast({
							title: "Error",
							color: "danger",
							description: "Could not load profile info",
							timeout: 3000,
							shouldShowTimeoutProgress: true,
						});
				}
			}
		},
	});

	return (
		<DefaultLayout>
			{!error && (
				<div className="flex flex-col items-center gap-5">
					<Avatar
						isBordered
						className="w-30 h-30 text-large"
						name={username}
						src="https://imgur.com/VB73J90.png"
					/>
					<p className="text-xl font-semibold">{data?.username}</p>

					<div className="flex flex-row justify-center gap-10 pt-15">
						<Skeleton className="rounded-xl" isLoaded={!isPending}>
							<Card>
								<CardHeader className="self-center justify-center px-20 ">
									<b className="pt-2 text-base">OVERVIEW</b>
								</CardHeader>
								<CardBody>
									{data && (
										<ProfileStatsTable
											played={data.played}
											won={data.won}
										/>
									)}
								</CardBody>
							</Card>
						</Skeleton>
						<Skeleton className="rounded-xl" isLoaded={!isPending}>
							<Card>
								<CardHeader className="justify-center px-20">
									<b className="text-base">
										TOP CIVILIZATIONS
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
							<Card>
								<CardHeader className="justify-center px-20">
									<b className="text-base">TOP LEADERS</b>
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
				</div>
			)}
		</DefaultLayout>
	);
}
