import z from "zod";
import { $ZodError } from "zod/v4/core";

export function treeifyError(error: $ZodError) {
	return z.treeifyError(error);
}
