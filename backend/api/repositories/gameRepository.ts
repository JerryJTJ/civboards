import { Database, TablesInsert } from "../../interfaces/supabase";
import { supabase } from "../server";

async function insertGame(game: TablesInsert<"game">) {
	const { data, error } = await supabase
		.from("game")
		.insert({
			finished: game.finished,
			map: game.map,
			speed: game.speed,
			turns: game.turns,
			victory_id: game.victory_id,
			winner_player: game.winner_player,
		})
		.select();

	return data;
}
