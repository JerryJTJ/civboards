import { TablesInsert } from "../../interfaces/supabase";
import {
	getAllUsers,
	getUserByName,
	insertUser,
} from "../repositories/user.repository";

export async function doesUserExist(name: string): Promise<boolean> {
	// If user isn't found, it's not a "real" error
	try {
		await getUserByName(name);
		return true;
	} catch (_e) {
		return false;
	}
}

export async function createUsers(
	players: {
		leaderId: number;
		name: string;
		isHuman: boolean;
	}[]
) {
	const promises = players.map(async (player) => {
		// prevent no-name players (ai)
		if (!player.name) return;

		const name = player.name.toLocaleLowerCase();

		const exist = await doesUserExist(name);
		if (exist) return;

		await insertUser({
			name: name,
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
