"use strict";

import "buffer-v6-polyfill";

const loggingEnabled = false;
import {
	find,
	pull,
	clone,
	mapValues,
	isArray,
	map,
	isObject,
} from "lodash-es";

import { unzipSync, constants } from "zlib";
import pkg from "iconv-lite";
import { remove } from "diacritics";
import { Buffer } from "node:buffer";
const { encode } = pkg;
const START_ACTOR = Buffer.from([0x58, 0xba, 0x7f, 0x4c]);
const ZLIB_HEADER = Buffer.from([0x78, 0x9c]);
const END_UNCOMPRESSED = Buffer.from([0, 0, 1, 0]);
const COMPRESSED_DATA_END = Buffer.from([0, 0, 0xff, 0xff]);

const GAME_DATA = {
	GAME_TURN: Buffer.from([0x9d, 0x2c, 0xe6, 0xbd]),
	GAME_SPEED: Buffer.from([0x99, 0xb0, 0xd9, 0x05]),
	MOD_BLOCK_1: Buffer.from([0x5c, 0xae, 0x27, 0x84]),
	MOD_BLOCK_2: Buffer.from([0xc8, 0xd1, 0x8c, 0x1b]),
	MOD_BLOCK_3: Buffer.from([0x44, 0x7f, 0xd4, 0xfe]),
	MOD_BLOCK_4: Buffer.from([0xbb, 0x5e, 0x30, 0x88]),
	MOD_ID: Buffer.from([0x54, 0x5f, 0xc4, 0x04]),
	MOD_TITLE: Buffer.from([0x72, 0xe1, 0x34, 0x30]),
	MAP_FILE: Buffer.from([0x5a, 0x87, 0xd8, 0x63]),
	MAP_SIZE: Buffer.from([0x40, 0x5c, 0x83, 0x0b]),
};

const SLOT_HEADERS = [
	Buffer.from([0xc8, 0x9b, 0x5f, 0x65]),
	Buffer.from([0x5e, 0xab, 0x58, 0x12]),
	Buffer.from([0xe4, 0xfa, 0x51, 0x8b]),
	Buffer.from([0x72, 0xca, 0x56, 0xfc]),
	Buffer.from([0xd1, 0x5f, 0x32, 0x62]),
	Buffer.from([0x47, 0x6f, 0x35, 0x15]),
	Buffer.from([0xfd, 0x3e, 0x3c, 0x8c]),
	Buffer.from([0x6b, 0x0e, 0x3b, 0xfb]),
	Buffer.from([0xfa, 0x13, 0x84, 0x6b]),
	Buffer.from([0x6c, 0x23, 0x83, 0x1c]),
	Buffer.from([0xf4, 0x14, 0x18, 0xaa]),
	Buffer.from([0x62, 0x24, 0x1f, 0xdd]),
];

const ACTOR_DATA = {
	ACTOR_NAME: Buffer.from([0x2f, 0x5c, 0x5e, 0x9d]), //civ name
	LEADER_NAME: Buffer.from([0x5f, 0x5e, 0xcd, 0xe8]),
	ACTOR_TYPE: Buffer.from([0xbe, 0xab, 0x55, 0xca]), //civ, city-state, etc.
	PLAYER_NAME: Buffer.from([0xfd, 0x6b, 0xb9, 0xda]),
	PLAYER_PASSWORD: Buffer.from([0x6c, 0xd1, 0x7c, 0x6e]),
	PLAYER_ALIVE: Buffer.from([0xa6, 0xdf, 0xa7, 0x62]),
	IS_CURRENT_TURN: Buffer.from([0xcb, 0x21, 0xb0, 0x7a]),
	ACTOR_AI_HUMAN: Buffer.from([0x95, 0xb9, 0x42, 0xce]), // 3 = Human, 1 = AI
	ACTOR_DESCRIPTION: Buffer.from([0x65, 0x19, 0x9b, 0xff]),
};

export const MARKERS = {
	START_ACTOR,
	END_UNCOMPRESSED,
	COMPRESSED_DATA_END,
	GAME_DATA,
	ACTOR_DATA,
};

const DATA_TYPES = {
	BOOLEAN: 1,
	INTEGER: 2,
	STRING: 5,
	UTF_STRING: 6,
	ARRAY_START: 0x0a,
};

function log(message) {
	if (loggingEnabled) {
		console.log(message);
	}
}

const _DATA_TYPES = DATA_TYPES;
export { _DATA_TYPES as DATA_TYPES };

export function parse(buffer, options) {
	options = options || {};

	let parsed = {
		ACTORS: [],
		CIVS: [],
	};

	const chunks = [];
	let chunkStart = 0;
	let curActor;
	let compressed;

	let state = readState(buffer);

	if (state.next4.toString() !== "CIV6") {
		throw new Error("Not a Civilization 6 save file. :(");
	}

	while (null !== (state = readState(buffer, state))) {
		if (state.next4.equals(GAME_DATA.GAME_SPEED)) {
			break;
		}
		state.pos++;
	}

	chunks.push(buffer.slice(chunkStart, state.pos));

	chunkStart = state.pos;

	do {
		if (state.next4.equals(END_UNCOMPRESSED)) {
			if (options.outputCompressed) {
				compressed = readCompressedData(buffer, state);
			}

			break;
		}

		const info = parseEntry(buffer, state);
		log(`${chunkStart}/${chunkStart.toString(16)}: ${JSON.stringify(info)}`);

		const tryAddActor = (key, marker) => {
			if (info.marker.equals(marker)) {
				curActor = {};
				curActor[key] = info;

				parsed.ACTORS.push(curActor);
			}
		};

		for (const marker of SLOT_HEADERS) {
			tryAddActor("SLOT_HEADER", marker);
		}

		if (!curActor && info.marker.equals(START_ACTOR)) {
			tryAddActor("START_ACTOR", START_ACTOR);
		} else if (info.marker.equals(ACTOR_DATA.ACTOR_DESCRIPTION)) {
			curActor = null;
		} else {
			for (const key in GAME_DATA) {
				if (info.marker.equals(GAME_DATA[key])) {
					if (parsed[key]) {
						// Sometimes markers can repeat?  I really don't understand this file format...
						let suffix = 2;
						let uniqueKey;

						do {
							uniqueKey = `${key}_${suffix}`;
							suffix++;
						} while (parsed[uniqueKey]);

						parsed[uniqueKey] = info;
					} else {
						parsed[key] = info;
					}
				}
			}

			if (curActor) {
				for (const key in ACTOR_DATA) {
					if (info.marker.equals(ACTOR_DATA[key])) {
						curActor[key] = info;
					}
				}
			}
		}

		info.chunk = buffer.slice(chunkStart, state.pos);
		chunks.push(info.chunk);

		chunkStart = state.pos;
	} while (null !== (state = readState(buffer, state)));

	if (state) {
		chunks.push(buffer.slice(state.pos));
	}

	for (const curMarker of SLOT_HEADERS) {
		const curCiv = find(parsed.ACTORS, (actor) => {
			return (
				actor.SLOT_HEADER &&
				actor.SLOT_HEADER.marker.equals(curMarker) &&
				actor.ACTOR_AI_HUMAN &&
				actor.ACTOR_AI_HUMAN.data !== 2 &&
				actor.ACTOR_TYPE &&
				actor.ACTOR_TYPE.data === "CIVILIZATION_LEVEL_FULL_CIV" &&
				actor.ACTOR_NAME
			);
		});

		if (curCiv) {
			parsed.CIVS.push(curCiv);
			pull(parsed.ACTORS, curCiv);
		}
	}

	for (const actor of clone(parsed.ACTORS)) {
		if (!actor.ACTOR_TYPE || !actor.ACTOR_NAME) {
			pull(parsed.ACTORS, actor);
		}
	}

	//Options
	if (options.simple) {
		parsed = simplify(parsed);
	}

	if (options.api) {
		return api(parsed);
	}

	return {
		parsed,
		chunks,
		compressed,
	};
}

export function addChunk(chunks, after, marker, type, value) {
	const newChunk = writeValue(marker, type, value);
	const chunkIndex = chunks.indexOf(after.chunk) + 1;
	chunks.splice(chunkIndex, 0, newChunk);
}

export function modifyChunk(chunks, toModify, newValue) {
	const chunkIndex = chunks.indexOf(toModify.chunk);
	chunks[chunkIndex] = toModify.chunk = writeValue(
		toModify.marker,
		toModify.type,
		newValue,
	);
}

export function deleteMod(buffer, modid) {
	const result = parse(buffer);

	const modBlockList = Object.keys(result.parsed)
		.filter((x) => x.startsWith("MOD_BLOCK_"))
		.map((x) => result.parsed[x]);

	for (const modBlock of modBlockList) {
		if (!modBlock) {
			continue;
		}
		const chunks = readArray0B(buffer, {
			pos: modBlock.marker.byteOffset + 8,
		}).chunks;
		for (let i = 2; i < chunks.length; i++) {
			const c = chunks[i];
			const state = readState(c.slice(24), null);
			const id = readString(c.slice(24), state);
			if (id === modid) {
				chunks.splice(i, 1);
				chunks[1] = Buffer.concat([
					Buffer.from([chunks[1][0] - 1]),
					chunks[1].slice(1),
				]);
				break;
			}
		}
		const modifyingChunkIndex = result.chunks.indexOf(modBlock.chunk);
		chunks.unshift(result.chunks[modifyingChunkIndex].slice(0, 8));
		result.chunks[modifyingChunkIndex] = Buffer.concat(chunks);
	}
	return result;
}

export function addMod(buffer, modId, modTitle) {
	const result = parse(buffer);

	const modBlockList = Object.keys(result.parsed)
		.filter((x) => x.startsWith("MOD_BLOCK_"))
		.map((x) => result.parsed[x]);

	for (const modBlock of modBlockList) {
		if (!modBlock) {
			continue;
		}
		let chunks = readArray0B(buffer, {
			pos: modBlock.marker.byteOffset + 8,
		}).chunks;
		chunks = addElementToArray0B(chunks, [
			{ marker: GAME_DATA.MOD_ID, value: modId },
			{ marker: GAME_DATA.MOD_TITLE, value: modTitle },
		]);
		const modifyingChunkIndex = result.chunks.indexOf(modBlock.chunk);
		chunks.unshift(result.chunks[modifyingChunkIndex].slice(0, 8));
		result.chunks[modifyingChunkIndex] = Buffer.concat(chunks);
	}
	return result;
}

export function deleteChunk(chunks, toDelete) {
	pull(chunks, toDelete.chunk);
}

// Helper functions
function writeValue(marker, type, value) {
	switch (type) {
		case DATA_TYPES.INTEGER:
			return writeInt(marker, value);

		case DATA_TYPES.ARRAY_START:
			return writeArrayLen(marker, value);

		case DATA_TYPES.STRING:
			return writeString(marker, value);

		case DATA_TYPES.BOOLEAN:
			return writeBoolean(marker, value);

		default:
			throw new Error("I don't know how to write type " + type);
	}
}

function simplify(result) {
	let mapFn = mapValues;

	if (isArray(result)) {
		mapFn = map;
	}

	return mapFn(result, (i) => {
		if (i.data && !isObject(i.data)) {
			return i.data;
		}

		if (i.data === false) {
			return false;
		}

		return simplify(i.data || i);
	});
}

function api(parsed) {
	const gameState = {
		speed: parsed.GAME_SPEED.data,
		turns: parsed.GAME_TURN.data,
		map: parsed.MAP_FILE.data,
		mapSize: parsed.MAP_SIZE.data,
	};

	let players = [];
	for (const civ of parsed.CIVS) {
		players.push({
			leader: civ.LEADER_NAME.data,
			isHuman: civ.ACTOR_AI_HUMAN.data === 3,
			...(civ.ACTOR_AI_HUMAN.data === 3 ? { name: civ.PLAYER_NAME?.data } : {}),
		});
	}

	// DLC
	// Only barbarian gamemode is seprate, the rest is attatched to a frontier-pass pack so not sure how to find it
	let expansions = [];
	// let mods = [];
	if (parsed.MOD_BLOCK_1) {
		for (const mod of parsed.MOD_BLOCK_1.data) {
			if (mod.MOD_TITLE.data.includes("EXPANSION"))
				expansions.push(mod.MOD_TITLE.data.replace(/\W/g, ""));
			// else mods.push(mod.MOD_TITLE.data.replace(/\W/g, ""));
		}
	}

	return {
		...gameState,
		players: players,
		expansions: expansions,
		// mods: mods,
	};
}

function readState(buffer, state) {
	if (!state) {
		state = {
			pos: 0,
			next4: buffer.slice(0, 4),
		};
	} else {
		if (state.pos >= buffer.length - 4) {
			return null;
		}

		state.next4 = buffer.slice(state.pos, state.pos + 4);
	}

	return state;
}

function parseEntry(buffer, state, dontSkip) {
	let successfulParse;
	let result;

	do {
		const typeBuffer = buffer.slice(state.pos + 4, state.pos + 8);

		result = {
			marker: state.next4,
			type: typeBuffer.readUInt32LE(),
		};

		state.pos += 8;

		successfulParse = true;

		if (
			!dontSkip &&
			(result.marker.readUInt32LE() < 256 || result.type === 0)
		) {
			result.data = "SKIP";
		} else if (
			result.type === 0x18 ||
			typeBuffer.slice(0, 2).equals(ZLIB_HEADER)
		) {
			// compressed data, skip for now...
			result.data = "UNKNOWN COMPRESSED DATA";
			state.pos = buffer.indexOf(COMPRESSED_DATA_END, state.pos) + 4;
			state.readCompressedData = true;
		} else {
			switch (result.type) {
				case DATA_TYPES.BOOLEAN:
					result.data = readBoolean(buffer, state);
					break;

				case DATA_TYPES.INTEGER:
					result.data = readInt(buffer, state);
					break;
				case DATA_TYPES.ARRAY_START:
					result.data = readArray0A(buffer, state);
					break;

				case 3:
					result.data = "UNKNOWN!";
					state.pos += 12;
					break;

				case 0x15:
					result.data = "UNKNOWN!";

					if (
						buffer
							.slice(state.pos, state.pos + 4)
							.equals(Buffer.from([0, 0, 0, 0x80]))
					) {
						state.pos += 20;
					} else {
						state.pos += 12;
					}
					break;

				case 4:
				case DATA_TYPES.STRING:
					result.data = readString(buffer, state);
					break;

				case DATA_TYPES.UTF_STRING:
					result.data = readUtfString(buffer, state);
					break;

				case 0x14:
				case 0x0d:
					result.data = "UNKNOWN!";
					state.pos += 16;
					break;

				case 0x0b:
					result.data = readArray0B(buffer, state).data;
					break;

				default:
					successfulParse = false;
					state.pos -= 7;
					break;
			}
		}
	} while (!successfulParse);

	return result;
}

function readString(buffer, state) {
	const origState = clone(state);
	let result = null;

	// Length can be up to 3 bytes, but the 4th byte is a marker?
	const strLenBuf = Buffer.concat([
		buffer.slice(state.pos, state.pos + 3),
		Buffer.from([0]),
	]);
	const strLen = strLenBuf.readUInt32LE(0);
	state.pos += 2;

	const strInfo = buffer.slice(state.pos, state.pos + 6);
	// Buffer.from([0, 0x21, 1, 0, 0, 0]))
	if (strInfo[1] === 0 || strInfo[1] === 0x20) {
		state.pos += 10;
		result = "Don't know what this kind of string is...";
	} else if (strInfo[1] === 0x21) {
		state.pos += 6;
		// Instead of assuming string length is actually length of chunk, find our null terminator in the string...
		const nullTerm = buffer.indexOf(0, state.pos) - state.pos;
		result = buffer.slice(state.pos, state.pos + nullTerm).toString();
		state.pos += strLen;
	}

	if (result === null) {
		return "Error reading string: " + JSON.stringify(origState);
	}

	return result;
}

function readArray0A(buffer, state) {
	const result = [];

	state.pos += 8;
	const arrayLen = buffer.readUInt32LE(state.pos);
	log("array length " + arrayLen);
	state.pos += 4;

	for (let i = 0; i < arrayLen; i++) {
		const index = buffer.readUInt32LE(state.pos);

		if (index > arrayLen) {
			// If we can't understand the array format, just return what we parsed for length
			log("Index outside bounds of array at " + state.pos.toString(16));
			return arrayLen;
		}

		log(`reading array index ${index} at ${state.pos.toString(16)}`);

		state = readState(buffer, state);
		const info = parseEntry(buffer, state, true);
		result.push(info.data);
	}

	return result;
}

function addElementToArray0B(chunks, markerValues) {
	if (chunks.length < 3) {
		// (Chunk 0: marker, 1: size, 2: first entry that we copy to make new entry)
		throw new Error("Array must already have at least one entry!");
	}

	chunks[1] = Buffer.concat([
		Buffer.from([chunks[1][0] + 1]),
		chunks[1].slice(1),
	]);
	const cloneChunk = Buffer.from(chunks[2]);
	const newSubChunks = [];

	let state = readState(cloneChunk, null);
	let chunkStart = 0;

	while (state) {
		const entry = parseEntry(cloneChunk, state);
		entry.chunk = cloneChunk.slice(chunkStart, state.pos);
		newSubChunks.push(entry.chunk);
		chunkStart = state.pos;

		for (const { marker, value } of markerValues) {
			if (entry.marker.equals(marker)) {
				modifyChunk(newSubChunks, entry, value);
			}
		}

		state = readState(cloneChunk, state);
	}

	chunks.push(Buffer.concat(newSubChunks));

	return chunks;
}

function readArray0B(buffer, state) {
	const origState = clone(state);
	const result = {
		data: [],
		chunks: [],
	};

	result.chunks.push(buffer.slice(state.pos, state.pos + 8));
	state.pos += 8;
	const arrayLen = buffer.readUInt32LE(state.pos);

	result.chunks.push(buffer.slice(state.pos, state.pos + 4));
	state.pos += 4;

	for (let i = 0; i < arrayLen; i++) {
		if (buffer[state.pos] !== 0x0a) {
			return "Error reading array: " + JSON.stringify(origState);
		}

		const startPos = state.pos;
		state.pos += 16;
		const curData = {};
		result.data.push(curData);
		let info;

		do {
			state = readState(buffer, state);
			info = parseEntry(buffer, state);

			for (const key in GAME_DATA) {
				if (info.marker.equals(GAME_DATA[key])) {
					curData[key] = info;
				}
			}
		} while (info.data !== "1");

		result.chunks.push(buffer.slice(startPos, state.pos));
	}

	return result;
}

function writeString(marker, newValue) {
	const safeValue = encode(remove(newValue), "ascii");
	const strLenBuffer = Buffer.from([0, 0, 0, 0x21, 1, 0, 0, 0]);
	strLenBuffer.writeUInt16LE(safeValue.length + 1, 0);

	return Buffer.concat([
		marker,
		Buffer.from([5, 0, 0, 0]),
		strLenBuffer,
		Buffer.from(safeValue),
		Buffer.from([0]),
	]);
}

function readUtfString(buffer, state) {
	const origState = clone(state);
	let result = null;

	const strLen = buffer.readUInt16LE(state.pos) * 2;
	state.pos += 2;

	if (
		buffer
			.slice(state.pos, state.pos + 6)
			.equals(Buffer.from([0, 0x21, 2, 0, 0, 0]))
	) {
		state.pos += 6;
		result = buffer.slice(state.pos, state.pos + strLen - 2).toString("ucs2"); // Ignore null terminator
		state.pos += strLen;
	}

	if (result === null) {
		return "Error reading string: " + JSON.stringify(origState);
	}

	return result;
}

function readBoolean(buffer, state) {
	state.pos += 8;
	const result = !!buffer[state.pos];
	state.pos += 4;
	return result;
}

function readInt(buffer, state) {
	state.pos += 8;
	const result = buffer.readUInt32LE(state.pos);
	state.pos += 4;
	return result;
}

function writeInt(marker, value) {
	const valueBuffer = Buffer.alloc(4);
	valueBuffer.writeUInt32LE(value);

	return Buffer.concat([
		marker,
		Buffer.from([2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
		valueBuffer,
	]);
}

function writeArrayLen(marker, value) {
	const valueBuffer = Buffer.alloc(4);
	valueBuffer.writeUInt32LE(value);

	return Buffer.concat([
		marker,
		Buffer.from([0x0a, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0]),
		valueBuffer,
	]);
}

function writeBoolean(marker, value) {
	const valueBuffer = Buffer.alloc(4);
	valueBuffer.writeUInt32LE(value ? 1 : 0);

	return Buffer.concat([
		marker,
		Buffer.from([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
		valueBuffer,
	]);
}

function readCompressedData(buffer, state) {
	const data = buffer.slice(
		state.pos + 4,
		buffer.indexOf(COMPRESSED_DATA_END, state.pos) + COMPRESSED_DATA_END.length,
	);

	// drop 4 bytes away after every chunk
	const chunkSize = 64 * 1024;
	const chunks = [];
	let pos = 0;
	while (pos < data.length) {
		chunks.push(data.slice(pos, pos + chunkSize));
		pos += chunkSize + 4;
	}
	const compressedData = Buffer.concat(chunks);

	return unzipSync(compressedData, { finishFlush: constants.Z_SYNC_FLUSH });
}
