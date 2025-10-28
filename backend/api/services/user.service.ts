import { TablesInsert } from "../../interfaces/supabase";
import {
	getAllUsers,
	getUserByName,
	insertUser,
} from "../repositories/user.repository";

export async function doesUserExist(name: string): Promise<boolean> {
	const userByName = await getUserByName(name);

	return !(userByName === null);
}

export async function createUsers(
	players: Array<{
		leaderId: number;
		name: string;
		isHuman: boolean;
	}>
) {
	const promises = players.map(async (player) => {
		// prevent no-name players (ai)
		if (!player) return;

		const exist = await doesUserExist(player.name.toLocaleLowerCase());
		if (exist) return;
		await insertUser({
			name: player.name.toLocaleLowerCase(),
		} as TablesInsert<"user">);
	});

	await Promise.all(promises);
}

export async function fetchAllUsers() {
	return await getAllUsers();

	// const usersArr = new Array<string>();
	// users.forEach((user) => {
	// 	usersArr.push(user.name);
	// });
}
