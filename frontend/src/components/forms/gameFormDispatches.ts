import { addToast } from "@heroui/toast";

import { AddFormAction, GameOptionsAction } from "./addGameReducer";

import { MAP_SIZE } from "@/constants/gameSettings";
import { Civ, GameOptions } from "@/interfaces/game.interface";

export interface FormDispatches {
	resetFormDispatch: () => void;
	gameOptionsDispatch: (
		option: string,
		value: string | number | Set<number> | boolean
	) => void;
	addCivDispatch: (isHuman: boolean) => void;
	deleteCivDispatch: (civ: Civ) => void;
	changeCivDispatch: (civ: Partial<Civ>) => void;
	parseSaveDispatch: (parsed: Partial<GameOptions>) => void;
}

// Dispatches
export function getFormDispatches(
	dispatch: React.ActionDispatch<[action: AddFormAction]>,
	form: GameOptions
): FormDispatches {
	const resetFormDispatch: () => void = () => dispatch({ field: "reset" });

	const gameOptionsDispatch = (
		option: string,
		value: string | number | Set<number> | boolean
	) =>
		dispatch({
			field: "options",
			option: option,
			payload: value,
		} as GameOptionsAction);

	const addCivDispatch = (isHuman: boolean) => {
		const currMapSize = MAP_SIZE.find(
			(mapSize) => mapSize.key === form.mapSize
		);

		if (form.players.length === currMapSize?.players.max) {
			addToast({
				title: "Error",
				color: "warning",
				description: `${currMapSize.size} maps have a maximum of ${currMapSize.players.max} players`,
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});

			return;
		}

		dispatch({
			field: "player",
			type: "add",
			payload: isHuman,
		});
	};

	const deleteCivDispatch = (civ: Civ) => {
		if (form.players.length <= 2) {
			addToast({
				title: "Error",
				color: "warning",
				description: "Must have at least 2 players",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});

			return;
		}
		dispatch({ field: "player", type: "delete", payload: civ });
	};

	const changeCivDispatch = (civ: Partial<Civ>) =>
		dispatch({ field: "player", type: "change", payload: civ });
	const parseSaveDispatch = (parsed: Partial<GameOptions>) =>
		dispatch({ field: "parse", payload: parsed });

	return {
		resetFormDispatch,
		gameOptionsDispatch,
		addCivDispatch,
		deleteCivDispatch,
		changeCivDispatch,
		parseSaveDispatch,
	};
}
