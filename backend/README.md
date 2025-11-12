# Backend

The backend consists of an Express framework running on Node.js. It has two main functions:

- Passing and validating data (Zod) bewteen the client and database
- Parsing `.Civ6Save` files

## Usage

To run this project:

- Dev: `pnpm run dev`
- Debug: `npm run debug` (this prevents auto-reload so we can attach the debugger persistently)
- Build: `pnpm run build`

## Parser

The parser takes in a .Civ6Save file and outputs a JSON. For more details, see: [jerryjtj/civ-6-parser](https://github.com/JerryJTJ/civ6-save-parser).

## Database

The PostgreSQL database consists of two main categories:

- _Lookups_: `mod`, `user`, `civilization`, `expansion`, `gamemode`, and `leader`.
  - The schema of these is roughly `id: int8, name: text, code: text`
- _Game Data_: `game`, `game_expansion`, `game_player`, `game_gamemode`
  - The relationship is a many-to-one, with the latter all referencing `game`

The `game` schema is as follows:

```
    id: uuid
    created_at: timestamptz,
    map: text,
    speed: text,
    turns: smallint,
    finished: boolean,
    winner_player: text,
    victory_id: bigint,
    map_size: text,
    winner_leader_id: bigint,
    winner_civilization_id: bigint,
    name: text,
    active: boolean,
    date: timestamp with time zone,
```
