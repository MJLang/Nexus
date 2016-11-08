import { MPQArchive } from './../../mpq';
import { parseStrings } from './../../helpers/helper';
import { decodeReplayHeader } from './../../protocols/29406';
export class Replay {
  public version: string;


  static fromMPQ(filename): Replay {
    let archive = new MPQArchive(filename);
    let header = parseStrings(decodeReplayHeader(archive.header.userDataHeader.content));
    console.log(header);
    return new Replay();
  }


}