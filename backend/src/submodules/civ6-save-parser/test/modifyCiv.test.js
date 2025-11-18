"use strict";

/* global describe, it -- Globals defined by Mocha */

import { readFileSync } from "fs";
import { expect } from "chai";
import {
	parse,
	addMod,
	deleteMod,
	modifyChunk,
	addChunk,
	MARKERS,
	DATA_TYPES,
	deleteChunk,
} from "../parse.js";

describe("Modify civtype2 save", function () {
	const buffer = Buffer.from(readFileSync("test/saves/civtype2.Civ6Save"));
	const data = parse(buffer);

	it("should be able to add MPH mod", () => {
		const modid = "619ac86e-d99d-4bf3-b8f0-8c5b8c402176";
		const modname = "Multiplayer Helper 1.5.1";
		const saveWithAddedMod = addMod(buffer, modid, modname);

		const modifiedData = parse(Buffer.concat(saveWithAddedMod.chunks));

		expect(
			data.parsed.MOD_BLOCK_1.data.some(
				(x) => x.MOD_ID.data === "619ac86e-d99d-4bf3-b8f0-8c5b8c402176",
			),
		).to.equal(false);
		expect(data.parsed.MOD_BLOCK_1.data.length).to.equal(
			modifiedData.parsed.MOD_BLOCK_1.data.length - 1,
		);
		expect(
			modifiedData.parsed.MOD_BLOCK_1.data.some(
				(x) => x.MOD_ID.data === "619ac86e-d99d-4bf3-b8f0-8c5b8c402176",
			),
		).to.equal(true);
		expect(data.parsed.MOD_BLOCK_2.data.length).to.equal(
			modifiedData.parsed.MOD_BLOCK_2.data.length - 1,
		);
		expect(data.parsed.MOD_BLOCK_2_2.data.length).to.equal(
			modifiedData.parsed.MOD_BLOCK_2_2.data.length - 1,
		);
		expect(data.parsed.MOD_BLOCK_3.data.length).to.equal(
			modifiedData.parsed.MOD_BLOCK_3.data.length - 1,
		);
		expect(data.parsed.MOD_BLOCK_3_2.data.length).to.equal(
			modifiedData.parsed.MOD_BLOCK_3_2.data.length - 1,
		);
		expect(data.parsed.MOD_BLOCK_4.data.length).to.equal(
			modifiedData.parsed.MOD_BLOCK_4.data.length - 1,
		);
	});

	it("should be able to add and remove MPH mod", () => {
		const buffer = Buffer.from(
			readFileSync("test/saves/CATHERINE DE MEDICI 1 4000 BC.Civ6Save"),
		);
		const modid = "619ac86e-d99d-4bf3-b8f0-8c5b8c402176";
		const modname = "Multiplayer Helper 1.5.1";
		const saveWithAddedMod = addMod(buffer, modid, modname);
		const saveWithoutMod = deleteMod(
			Buffer.concat(saveWithAddedMod.chunks),
			modid,
		);
		expect(buffer).deep.to.equal(Buffer.concat(saveWithoutMod.chunks));
	});
});

describe("Modify Cathy Save", function () {
	const buffer = Buffer.from(
		readFileSync("test/saves/CATHERINE DE MEDICI 1 4000 BC.Civ6Save"),
	);
	let data = parse(buffer);

	it("should be able to add MPH mod", () => {
		const modid = "619ac86e-d99d-4bf3-b8f0-8c5b8c402176";
		const modname = "Multiplayer Helper 1.5.1";
		const saveWithAddedMod = addMod(buffer, modid, modname);

		const modifiedData = parse(Buffer.concat(saveWithAddedMod.chunks));

		expect(
			data.parsed.MOD_BLOCK_1.data.some(
				(x) => x.MOD_ID.data === "619ac86e-d99d-4bf3-b8f0-8c5b8c402176",
			),
		).to.equal(false);
		expect(data.parsed.MOD_BLOCK_1.data.length).to.equal(
			modifiedData.parsed.MOD_BLOCK_1.data.length - 1,
		);
		expect(
			modifiedData.parsed.MOD_BLOCK_1.data.some(
				(x) => x.MOD_ID.data === "619ac86e-d99d-4bf3-b8f0-8c5b8c402176",
			),
		).to.equal(true);
		expect(data.parsed.MOD_BLOCK_2.data.length).to.equal(
			modifiedData.parsed.MOD_BLOCK_2.data.length - 1,
		);
		expect(data.parsed.MOD_BLOCK_3.data.length).to.equal(
			modifiedData.parsed.MOD_BLOCK_3.data.length - 1,
		);
	});

	it("should be able to change player names in any order", () => {
		modifyChunk(data.chunks, data.parsed.CIVS[0].PLAYER_NAME, "Mike Rosack 0");
		modifyChunk(data.chunks, data.parsed.CIVS[2].PLAYER_NAME, "Mike Rosack 2");
		modifyChunk(data.chunks, data.parsed.CIVS[1].PLAYER_NAME, "Mike Rosack 1");

		data = parse(Buffer.concat(data.chunks));

		expect(data.parsed.CIVS[0].PLAYER_NAME.data).to.equal("Mike Rosack 0");
		expect(data.parsed.CIVS[1].PLAYER_NAME.data).to.equal("Mike Rosack 1");
		expect(data.parsed.CIVS[2].PLAYER_NAME.data).to.equal("Mike Rosack 2");
	});

	it("should be able to set a non-ascii player name and have it safely save", () => {
		modifyChunk(data.chunks, data.parsed.CIVS[0].PLAYER_NAME, "ϻĮЌẸ ŘỖŜÃČЌ");

		data = parse(Buffer.concat(data.chunks));

		expect(data.parsed.CIVS[0].PLAYER_NAME.data).to.equal("MI?E ROSAC?");
	});

	it("should be able to add a password", () => {
		const headerLen0 = data.parsed.CIVS[0].SLOT_HEADER.data;
		addChunk(
			data.chunks,
			data.parsed.CIVS[0].PLAYER_NAME,
			MARKERS.ACTOR_DATA.PLAYER_PASSWORD,
			DATA_TYPES.STRING,
			"password1",
		);
		modifyChunk(data.chunks, data.parsed.CIVS[0].SLOT_HEADER, headerLen0 + 1);

		const headerLen1 = data.parsed.CIVS[1].SLOT_HEADER.data;
		addChunk(
			data.chunks,
			data.parsed.CIVS[1].PLAYER_NAME,
			MARKERS.ACTOR_DATA.PLAYER_PASSWORD,
			DATA_TYPES.STRING,
			"password2",
		);
		modifyChunk(data.chunks, data.parsed.CIVS[1].SLOT_HEADER, headerLen1 + 1);

		data = parse(Buffer.concat(data.chunks));

		expect(data.parsed.CIVS[0].PLAYER_PASSWORD.data).to.equal("password1");
		expect(data.parsed.CIVS[0].SLOT_HEADER.data).to.equal(headerLen0 + 1); // The value of slot header needs to equal the number of "chunks" of data in the slot
		expect(data.parsed.CIVS[1].PLAYER_PASSWORD.data).to.equal("password2");
		expect(data.parsed.CIVS[1].SLOT_HEADER.data).to.equal(headerLen1 + 1);
	});

	it("should be able to delete a password", () => {
		const headerLen1 = data.parsed.CIVS[1].SLOT_HEADER.data;
		deleteChunk(data.chunks, data.parsed.CIVS[1].PLAYER_PASSWORD);
		modifyChunk(data.chunks, data.parsed.CIVS[1].SLOT_HEADER, headerLen1 - 1);

		data = parse(Buffer.concat(data.chunks));

		expect(data.parsed.CIVS[1]).to.not.have.property("PLAYER_PASSWORD");
		expect(data.parsed.CIVS[1].SLOT_HEADER.data).to.equal(headerLen1 - 1);
	});

	it("should be able to change a human player to AI", () => {
		modifyChunk(data.chunks, data.parsed.CIVS[1].ACTOR_AI_HUMAN, 1);

		data = parse(Buffer.concat(data.chunks));

		expect(data.parsed.CIVS[1].ACTOR_AI_HUMAN.data).to.equal(1);
	});

	it("should be able to change flag that it's current player's turn", () => {
		expect(data.parsed.CIVS[0].IS_CURRENT_TURN.data).to.equal(true);

		modifyChunk(data.chunks, data.parsed.CIVS[0].IS_CURRENT_TURN, false);
		data = parse(Buffer.concat(data.chunks));

		expect(data.parsed.CIVS[0].IS_CURRENT_TURN.data).to.equal(false);
	});

	/* it('writes the modified save file for debugging purposes', () => {
    fs.writeFileSync('test/saves/modified.Civ6Save', Buffer.concat(data.chunks));
  });*/
});
