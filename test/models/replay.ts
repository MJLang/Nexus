import { Replay } from './../../src/replay/models';
import { expect } from 'chai';
import * as path from 'path';

describe('Replay', () => {
  it('Should be able to parse Replay from MPQ', () => {
    let dragon_shire = path.normalize(path.join(__dirname, '..', 'support', 'warhead_junction.StormReplay'));
    let replay = Replay.fromFile(dragon_shire);
    console.log(replay.players.map(r => r.hero));
  });
});