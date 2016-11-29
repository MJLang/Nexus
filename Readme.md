# Nexus - a Heroes of the Storm Replay Parser
[![npm version](https://badge.fury.io/js/nexus-parser.svg)](https://badge.fury.io/js/nexus-parser)

Thanks goes to [@farof](https://github.com/Farof)  for inspiration with the MPQ Parser  

Nexus is a simple ES6 parser for Heroes of the Storm Replay `.StormReplay` files.

## Install

`npm install nexus-parser`


## Usage

#### TypeScript
```typescript
import { Replay } from 'nexus-parser';
let replay = Replay.fromFile(<path/to/replay.StormReplay>);
```

#### JavaScript
```js
const { Replay } = require('nexus-parser');
let replay = Replay.fromFile(<path/to/replay.StormReplay>);
```

## Whats in the Replay?

#### Replay

Example from Build 48297 

```js
{
  build: 48297,
  map: 'Warhead Junction',
  players: [ Players },
}
```


#### Player

```js
{
  playerId: null,
  userName: "USERNAME",
  hero: Hero,
  team: 'red',
  won: true,
  slot: 8 
}
```

#### Hero

```js
{
    name: 'The Butcher',
    talentIds: [ 3, 6, 7, 10, 13, 17, 20 ],
    talents:
     [ 'Abattoir',
       'Cheap Shot',
       'Insatiable Blade',
       'Furnace Blast',
       'Savage Charge',
       'Blood Frenzy',
       'Nexus Blades' ] 
  
}
```

## Contributing

Bug Reports & Pull Requests are always welcome!

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016, Martin Lang-Roman
Copyright (c) 2016 Blizzard Entertainment
