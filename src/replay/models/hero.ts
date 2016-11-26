import { normalize, join } from 'path';

export class Hero {
  public name: string;
  public talents: Array<string>;
  public talentIds: Array<number>;

  constructor(obj?: any, version?: number) {
    this.name = obj && obj.name || null;
    this.talentIds = obj && obj.talentIds;

    if (obj && obj.talentIds && version)  {
      this.talents = this.parseTalents(version);
    }
  }

  private parseTalents(version: number) {
    let parsedName = this.name.replace(/\W+/g, '_').replace(/_+/g, '_').toLowerCase();
    let data;
    try {
      let path = normalize(join(__dirname, '..', '..', 'data', 'heroes', parsedName));
      data = require(path);
    } catch (e) {
      return;
    }
    // Check if we found the hero
    if (!data) {
      return;
    }
    let buildsAvailable: Array<number> = data.availableVersions;
    // Check if the smallest build version is available, else can't parse due to the lack of historic data
    if (buildsAvailable.length > 0 && version < buildsAvailable[0]) {
      return;
    }
    // Filter for previous versions, find smallest patch distance
    let versionToUse;
    buildsAvailable.filter(v => version <= v).forEach(v => {
      if (!versionToUse) versionToUse = v;
      if (v - version < versionToUse - version) versionToUse = v;
    });
    let heroTalents: Array<string> = data[versionToUse].talents;
    return this.talentIds.map(ti => heroTalents[ti]);
  }
}