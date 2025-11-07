import { GameModalType } from "../types/modal.types";

export function isModalFieldEnabled(mode: GameModalType): boolean {
	switch (mode) {
		case "add":
			return true;
		case "view":
			return false;
		case "edit":
			return true;
		default:
			return false;
	}
}
