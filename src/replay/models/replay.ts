import { MPQArchive } from './../../mpq';
import { parseStrings } from './../../helpers/helper';
import { protocol as baseProtocol } from './../../protocols/29406';
import { Protocol } from './../../protocols/protocol';
import { FILES } from './../../helpers/config';
import { Hero, Player } from './';
export class Replay {
  public build: string;
  public map: string;
  public players: Array<Player>;

  static fromMPQ(filename): Replay {
    let archive = new MPQArchive(filename);
    let content = archive.header.userDataHeader.content;
    let header = parseStrings(baseProtocol.decodeReplayHeader(archive.header.userDataHeader.content));

    let replay = new Replay();
    replay.build = header.m_version.m_baseBuild;
    let protocol = require(`./../../protocols/${replay.build}`);
    if (!protocol) throw new Error('Invalid Replay Build Version');
    protocol = protocol.protocol;

    let details = this.getDetails(archive, protocol);
    let gameEvents = this.getGameEvents(archive, protocol);

    replay.map = details.m_title;
    replay.players = this.parsePlayers(details, gameEvents);
    return replay;
  }


  private static getDetails(archive: MPQArchive, protocol: Protocol) {
    let content = archive.readFile(FILES.DETAILS);
    let data = protocol.decodeReplayDetails(content);
    let parsedData = parseStrings(data);
    return parsedData;
  }

  private static getInitData(archive: MPQArchive, protocol: Protocol) {
    let content = archive.readFile(FILES.INITDATA);
    let data = protocol.decodeReplayInitData(content);
    let parsedData = parseStrings(data);
    return parsedData;
  }

  private static getAttributeEvents(archive: MPQArchive, protocol: Protocol) {
    let content = archive.readFile(FILES.ATTRIBUTES_EVENTS);
    let data = protocol.decodeReplayAttributesEvents(content);
    let parsedData = parseStrings(data);
    return parsedData;
  }

  private static getGameEvents(archive: MPQArchive, protocol: Protocol) {
    let content = archive.readFile(FILES.GAME_EVENTS);
    let parsedEvents = []
    let events = protocol.decodeReplayGameEvents(content);
    return events.map(e => parseStrings(e));
  }

  private static parsePlayers(details, gameEvents) {
    let rawPlayerData = details.m_playerList;
    // Filter out observers:
    rawPlayerData = rawPlayerData.filter(p => p.m_observe === 0);

    let players = rawPlayerData.map(p => {
      return new Player({
        userName: p.m_name,
        won: p.m_result === 1 ? true : false,
        playerId: p.m_id,
        slot: p.m_workingSetSlotId,
        team: p.m_color.m_b === 255 ? 'blue' : 'red',
        hero: new Hero({
          name: p.m_hero
        })
      });
    });

    let talents = gameEvents.filter(ge => ge.eventType === 'NNet.Game.SHeroTalentTreeSelectedEvent');
    console.log(talents);

    return players;
  }
}