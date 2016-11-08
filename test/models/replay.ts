import { Replay } from './../../src/replay/models';
import { expect } from 'chai';
import * as path from 'path';

describe('Replay', () => {
  it('Should be able to parse Replay from MPQ', () => {
    let dragon_shire = path.normalize(path.join(__dirname, '..', 'support', 'dragon_shire.StormReplay'));
    let replay = Replay.fromMPQ(dragon_shire);
    console.log(replay);
  });
});