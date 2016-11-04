import { MPQArchive } from './../../src/mpq';
import { expect } from 'chai';
import * as path from 'path';

describe('MPQ Archive', () => {
  it('Should be able to load a StormReplay File', () => {
    let dragon_shire = path.normalize(path.join(__dirname, '..', 'support', 'dragon_shire.StormReplay'));
    let archive = new MPQArchive(dragon_shire);

    expect(archive).to.not.be.null;
  });
})