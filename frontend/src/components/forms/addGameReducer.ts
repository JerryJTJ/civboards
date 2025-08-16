import { DEFAULT_ADD_FORM, MAP_SIZE } from "@/constants/gameSettings";
import { Civ, GameOptions } from "@/interfaces/game.interface";

const generateNewPlayer = (isHuman: boolean | undefined) => ({
	key: crypto.randomUUID(),
	name: "",
	leaderId: undefined,
	isHuman: isHuman === undefined ? true : isHuman,
});

export type GameOptionsAction = {
	[Option in keyof GameOptions]: {
		field: "options";
		option: Option;
		payload: GameOptions[Option];
	};
}[keyof GameOptions];

export type GamePlayerAction =
	| { field: "player"; type: "add"; payload: boolean }
	| { field: "player"; type: "delete"; payload: Civ }
	| { field: "player"; type: "change"; payload: Partial<Civ> };

export type ChangeFormAction =
	| { field: "reset" }
	| { field: "parse"; payload: Partial<GameOptions> };

export type AddFormAction =
	| GameOptionsAction
	| GamePlayerAction
	| ChangeFormAction;

function addGameReducer(form: GameOptions, action: AddFormAction) {
	switch (action.field) {
		case "player":
			switch (action.type) {
				case "add":
					const currMapSize = MAP_SIZE.find(
						(mapSize) => mapSize.key === form.mapSize
					);
					if (form.players.length === currMapSize?.players.max)
						return form;

					return {
						...form,
						players: [
							...form.players,
							generateNewPlayer(action.payload),
						],
					};
				case "delete":
					if (form.players.length <= 2) return form;
					return {
						...form,
						players: form.players.filter(
							(player) => player.key !== action.payload.key
						),
					};
				case "change":
					return {
						...form,
						players: form.players.map((player) => {
							return player.key === action.payload.key
								? { ...player, ...action.payload }
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
						name: action.payload,
					};
				case "winner":
					return {
						...form,
						winner: action.payload,
					};
				case "victoryId":
					return {
						...form,
						victoryId: action.payload,
					};

				case "speed":
					return {
						...form,
						speed: action.payload,
					};
				case "map":
					return {
						...form,
						map: action.payload,
					};
				case "mapSize":
					const mapSize = MAP_SIZE.find(
						(size) => size.key === action.payload
					);
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
						mapSize: mapSize?.key || action.payload,
					};
				case "turns":
					return {
						...form,
						turns: action.payload,
					};
				case "expansions":
					return {
						...form,
						expansions: action.payload,
					};
				case "gamemodes":
					return {
						...form,
						gamemodes: action.payload,
					};
				default:
			}
			break;
		case "parse":
			const players = action.payload.players?.map((player) => ({
				...player,
				key: crypto.randomUUID(),
			}));
			return {
				...DEFAULT_ADD_FORM,
				...action.payload,
				players: players,
			} as GameOptions;
		case "reset":
			return DEFAULT_ADD_FORM;
	}
	//fallback case
	return form;
}

export default addGameReducer;
