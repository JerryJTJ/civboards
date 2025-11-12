"use strict";

import { readFileSync, writeFileSync } from "fs";
import { basename } from "path";
import { inspect } from "util";
import { pathToFileURL } from "node:url";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { parse } from "./parse.js";

//Using console node
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	const argv = yargs(hideBin(process.argv)).parse();

	if (!argv._.length) {
		console.log("Please pass the filename as the argument to the script.");
	} else {
		const buffer = Buffer.from(readFileSync(argv._[0]));
		const result = parse(buffer, argv);
		console.log(inspect(result.parsed, false, null));

		if (argv.outputCompressed) {
			writeFileSync(basename(argv._[0]) + ".bin", result.compressed);
		}

		if (argv.clean) {
			writeFileSync(
				`${basename(argv._[0])}_CLEAN.json`,
				JSON.stringify(result.parsed),
			);
		}
	}
}
