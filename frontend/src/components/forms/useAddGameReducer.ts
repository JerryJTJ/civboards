import { MAP_SIZE } from "@/constants/gameSettings";
import { Civ } from "./AddGameModal";

const generateNewPlayer = (isHuman: boolean | undefined) => ({
	id: crypto.randomUUID(),
	playerName: "",
	civilizationName: "",
	isHuman: isHuman || true,
});

interface AddFormDispatch {
	field: string;
	option?: string;
	type: string;
	payload?: {
		value?: any;
		id?: string;
		isHuman?: boolean;
	};
}

interface GameOptions {
	name: string;
	speed: string;
	map: string;
	mapSize: string;
	turns: number | undefined;
	winner: string;
	victory: string;
	isFinished: boolean;
	players: Array<Civ>;
}

function addGameReducer(form: GameOptions, action: AddFormDispatch) {
	const mapSize = MAP_SIZE.find((mapSize) => mapSize.size === form.mapSize);
	switch (action.field) {
		case "player":
			switch (action.type) {
				case "add":
					if (form.players.length === mapSize?.players.max)
						return form;
					return {
						...form,
						players: [
							...form.players,
							generateNewPlayer(action.payload?.isHuman),
						],
					};
				case "delete":
					if (form.players.length === 2) return form;
					return {
						...form,
						players: form.players.filter((player) => {
							player.id !== action.payload?.id;
						}),
					};
					break;
				case "change":
					return {
						...form,
						players: form.players.map((player) => {
							return player.id === action.payload?.id
								? { ...player, ...action.payload?.value }
								: player;
						}),
					};

				default:
					break;
			}
			break;
		case "options":
			switch (action.option) {
				case "name":
					return {
						...form,
						name: action.payload?.value,
					};
				case "winner":
					return {
						...form,
						winner: action.payload?.value,
					};
				case "victory":
					return {
						...form,
						victory: action.payload?.value,
					};

				case "speed":
					return {
						...form,
						speed: action.payload?.value,
					};
				case "map":
					return {
						...form,
						map: action.payload?.value,
					};
				case "mapSize":
					const mapSize = MAP_SIZE.find((size) => {
						size.size === action.payload?.value;
					});
					const players = form.players;

					//auto-resize civs
					if (mapSize) {
						if (form.players.length < mapSize?.players?.default) {
							//resize up to default
							while (players.length < mapSize.players.default) {
								players.push(generateNewPlayer(true));
							}
						} else if (form.players.length > mapSize.players.max) {
							//resize down to max
							players.splice(mapSize.players.max);
						}
					}

					return {
						...form,
						players: players,
						mapSize: mapSize,
					};
				case "turns":
					return {
						...form,
						turns: action.payload?.value,
					};
				case "expansions":
					return {
						...form,
						expansions: action.payload?.value,
					};
				case "gamemodes":
					return {
						...form,
						gamemodes: action.payload?.value,
					};
				default:
			}
	}
}
