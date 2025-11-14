import { Civ, GameForm } from "@interfaces/game.interface";
import { DEFAULT_ADD_FORM } from "@constants/gameDefaults";
import { MAP_SIZE } from "@constants/gameSettings";

const generateNewPlayer = (isHuman: boolean) => ({
	id: crypto.randomUUID(),
	name: "",
	leaderId: undefined,
	isHuman: isHuman,
});

export type GameOptionsAction = {
	[Option in keyof GameForm]: {
		field: "options";
		option: Option;
		payload: GameForm[Option];
	};
}[keyof GameForm];

export type GamePlayerAction =
	| { field: "player"; type: "add"; payload: boolean }
	| { field: "player"; type: "delete"; payload: Civ }
	| { field: "player"; type: "change"; payload: Partial<Civ> };

export type ChangeFormAction =
	| { field: "reset"; payload: GameForm }
	| { field: "parse"; payload: Partial<GameForm> };

export type FormAction =
	| GameOptionsAction
	| GamePlayerAction
	| ChangeFormAction;

function gameFormReducer(form: GameForm, action: FormAction) {
	switch (action.field) {
		case "player":
			switch (action.type) {
				case "add": {
					const currMapSize = MAP_SIZE.find(
						(mapSize) => mapSize.key === form.mapSize
					);

					if (form.players.length === currMapSize?.players.max) return form;

					return {
						...form,
						players: [...form.players, generateNewPlayer(action.payload)],
					};
				}
				case "delete":
					return {
						...form,
						players: form.players.filter(
							(player) => player.id !== action.payload.id
						),
					};
				case "change":
					return {
						...form,
						players: form.players.map((player) => {
							return player.id === action.payload.id
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
				case "finished":
					return {
						...form,
						finished: action.payload,
					};
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
				case "mapSize": {
					const mapSize = MAP_SIZE.find((size) => size.key === action.payload);
					const players = form.players;

					//auto-resize civs
					if (mapSize) {
						if (form.players.length < mapSize.players.default) {
							//resize up to default
							while (players.length < mapSize.players.default) {
								players.push(generateNewPlayer(true));
							}
						} else if (form.players.length > mapSize.players.default) {
							//resize down to default
							players.splice(mapSize.players.default);
						}
					}

					return {
						...form,
						players: players,
						mapSize: mapSize?.key ?? action.payload,
					};
				}
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
				case "createdBy":
					return {
						...form,
						createdBy: action.payload,
					};
				default:
			}
			break;
		case "parse": {
			const players = action.payload.players?.map((player) => ({
				...player,
				id: crypto.randomUUID(),
			}));

			const parsed = {
				...DEFAULT_ADD_FORM,
				...action.payload,
				players: players,
			} as GameForm;

			return parsed;
		}
		case "reset":
			return action.payload;
	}

	//fallback case
	return form;
}

export default gameFormReducer;
