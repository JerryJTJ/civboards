# Backend

The backend consists of an Express framework running on Node.js. 

It's primary functions are:
- Authenticating JWT from the client and authorizing functionality accordingly
- Passing and validating data (Zod) bewteen the client and database
- Parsing `.Civ6Save` files from the client

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
  name: text
  active: boolean
  date: timestamptz
  created_at: timestamptz
  created_by: text
  map: text
  map_size: text
  speed: text
  turns: smallint
  finished: boolean
  winner_player: text
  victory_id: foreignkey bigint
  winner_leader_id: bigint
  winner_civilization_id: bigint
```

For the structure of the objects used in apps, see the [shared/schemas](https://github.com/JerryJTJ/civboards/tree/master/packages/schemas) folder.
