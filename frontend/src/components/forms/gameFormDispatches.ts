import { addToast } from "@heroui/toast";

import { FormAction, GameOptionsAction } from "./gameFormReducer";

import { Civ, GameForm } from "@/interfaces/game.interface";
import { MAP_SIZE } from "@/constants/gameSettings";

export interface FormDispatches {
	resetFormDispatch: (form: GameForm) => void;
	gameOptionsDispatch: (
		option: string,
		value: string | number | Set<number> | boolean
	) => void;
	addCivDispatch: (isHuman: boolean) => void;
	deleteCivDispatch: (civ: Civ) => void;
	changeCivDispatch: (civ: Partial<Civ>) => void;
	parseSaveDispatch: (parsed: Partial<GameForm>) => void;
}

// Dispatches
export function getFormDispatches(
	dispatch: React.ActionDispatch<[action: FormAction]>,
	form: GameForm
): FormDispatches {
	const resetFormDispatch = (form: GameForm) => {
		dispatch({ field: "reset", payload: form });
	};

	const gameOptionsDispatch = (
		option: string,
		value: string | number | Set<number> | boolean
	) => {
		dispatch({
			field: "options",
			option: option,
			payload: value,
		} as GameOptionsAction);
	};

	const addCivDispatch = (isHuman: boolean) => {
		const currMapSize = MAP_SIZE.find(
			(mapSize) => mapSize.key === form.mapSize
		);

		if (currMapSize) {
			if (form.players.length >= currMapSize.players.max) {
				addToast({
					title: "Error",
					color: "warning",
					description: `${currMapSize.size} maps have a maximum of ${currMapSize.players.max.toString()} players`,
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
		} else {
			addToast({
				title: "Error",
				color: "warning",
				description: "No map size selected",
				timeout: 3000,
				shouldShowTimeoutProgress: true,
			});

			return;
		}
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

	const changeCivDispatch = (civ: Partial<Civ>) => {
		dispatch({ field: "player", type: "change", payload: civ });
	};
	const parseSaveDispatch = (parsed: Partial<GameForm>) => {
		dispatch({ field: "parse", payload: parsed });
	};

	return {
		resetFormDispatch,
		gameOptionsDispatch,
		addCivDispatch,
		deleteCivDispatch,
		changeCivDispatch,
		parseSaveDispatch,
	};
}
